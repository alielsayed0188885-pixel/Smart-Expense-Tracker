import { FolderNode } from "../types";

export const flutterCodebase: FolderNode = {
  name: "smart_expense_tracker",
  type: "folder",
  path: "",
  children: [
    {
      name: "pubspec.yaml",
      type: "file",
      path: "pubspec.yaml",
      language: "yaml",
      fileContent: `name: smart_expense_tracker
description: A complete mobile smart expense tracker with Clean Architecture, MVVM, and Gemini AI.
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.5
  
  # State Management & DI
  provider: ^6.0.5
  
  # Firebase Services
  firebase_core: ^2.15.0
  firebase_auth: ^4.7.0
  cloud_firestore: ^4.8.0
  google_sign_in: ^6.1.4
  
  # HTTP & AI Integration
  google_generative_ai: ^0.2.0
  http: ^1.1.0
  
  # UI & Charts
  fl_chart: ^0.63.0
  intl: ^0.18.1
  flutter_spinkit: ^5.2.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.1

flutter:
  uses-material-design: true
`
    },
    {
      name: "firestore.rules",
      type: "file",
      path: "firestore.rules",
      language: "javascript",
      fileContent: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Default deny catch-all
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Reusable validation helpers
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users Profile Collection
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create, update: if isOwner(userId) 
        && request.resource.data.email is string
        && request.resource.data.displayName is string;
      allow delete: if false; // Profiles are permanent
    }
    
    // Transactions Collection (Income and Expense logs)
    match /users/{userId}/transactions/{transactionId} {
      allow read, write: if isOwner(userId);
      
      // Strict constraint checks on writes
      allow create, update: if isOwner(userId)
        && request.resource.data.amount is number
        && request.resource.data.amount > 0
        && request.resource.data.type in ['income', 'expense']
        && request.resource.data.category in [
          'Food', 'Transport', 'Shopping', 'Bills', 
          'Health', 'Entertainment', 'Education', 'Other'
        ];
    }
    
    // Category Budgets Collection
    match /users/{userId}/budgets/{categoryId} {
      allow read, write: if isOwner(userId);
      
      allow create, update: if isOwner(userId)
        && request.resource.data.limit is number
        && request.resource.data.limit >= 0;
    }
  }
}`
    },
    {
      name: "firebase-blueprint.json",
      type: "file",
      path: "firebase-blueprint.json",
      language: "json",
      fileContent: `{
  "entities": {
    "User": {
      "title": "User Profile",
      "description": "User profile data linked to Firebase Authentication user ID",
      "type": "object",
      "properties": {
        "uid": { "type": "string", "description": "Authenticating unique ID" },
        "email": { "type": "string", "format": "email" },
        "displayName": { "type": "string" },
        "photoUrl": { "type": "string" },
        "createdAt": { "type": "string", "format": "date-time" }
      },
      "required": ["uid", "email"]
    },
    "Transaction": {
      "title": "Finance Transaction",
      "description": "Single record of income or expense item",
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "type": { "type": "string", "enum": ["income", "expense"] },
        "category": { "type": "string", "enum": ["Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Education", "Other"] },
        "amount": { "type": "number" },
        "date": { "type": "string", "format": "date" },
        "note": { "type": "string" }
      },
      "required": ["id", "type", "category", "amount", "date"]
    },
    "Budget": {
      "title": "Category Budget Limit",
      "description": "Monthly categorical allocation ceiling for notifications",
      "type": "object",
      "properties": {
        "category": { "type": "string" },
        "limit": { "type": "number" }
      },
      "required": ["category", "limit"]
    }
  },
  "firestore": {
    "/users/{userId}": {
      "schema": "User",
      "description": "User core accounts"
    },
    "/users/{userId}/transactions/{transactionId}": {
      "schema": "Transaction",
      "description": "Expense and income collections"
    },
    "/users/{userId}/budgets/{categoryId}": {
      "schema": "Budget",
      "description": "Categorized target budgets"
    }
  }
}`
    },
    {
      name: "lib",
      type: "folder",
      path: "lib",
      children: [
        {
          name: "main.dart",
          type: "file",
          path: "lib/main.dart",
          language: "dart",
          fileContent: `import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'presentation/viewmodels/auth_viewmodel.dart';
import 'presentation/viewmodels/finance_viewmodel.dart';
import 'presentation/viewmodels/ai_viewmodel.dart';
import 'presentation/views/auth/login_view.dart';
import 'presentation/views/dashboard/home_view.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthViewModel()),
        ChangeNotifierProxyProvider<AuthViewModel, FinanceViewModel>(
          create: (_) => FinanceViewModel(null),
          update: (_, auth, previous) => FinanceViewModel(auth.currentUser?.uid),
        ),
        ChangeNotifierProxyProvider<AuthViewModel, AIViewModel>(
          create: (_) => AIViewModel(null),
          update: (_, auth, previous) => AIViewModel(auth.currentUser?.uid),
        ),
      ],
      child: const SmartTrackerApp(),
    ),
  );
}

class SmartTrackerApp extends StatelessWidget {
  const SmartTrackerApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Expense Tracker',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Inter',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1E3A8A), // Navy Slate Accents
          primary: const Color(0xFF1E3A8A),
          secondary: const Color(0xFF10B981), // Emerald Teal Balance
          background: const Color(0xFFF9FAFB),
        ),
      ),
      home: Consumer<AuthViewModel>(
        builder: (context, auth, _) {
          if (auth.isAuthenticated) {
            return const HomeView();
          }
          return const LoginView();
        },
      ),
    );
  }
}
`
        },
        {
          name: "data",
          type: "folder",
          path: "lib/data",
          children: [
            {
              name: "models",
              type: "folder",
              path: "lib/data/models",
              children: [
                {
                  name: "transaction_model.dart",
                  type: "file",
                  path: "lib/data/models/transaction_model.dart",
                  language: "dart",
                  fileContent: `enum TransactionType { income, expense }

class TransactionModel {
  final String id;
  final TransactionType type;
  final String category;
  final double amount;
  final DateTime date;
  final String note;

  TransactionModel({
    required this.id,
    required this.type,
    required this.category,
    required this.amount,
    required this.date,
    required this.note,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'type': type == TransactionType.income ? 'income' : 'expense',
      'category': category,
      'amount': amount,
      'date': date.toIso8601String(),
      'note': note,
    };
  }

  factory TransactionModel.fromMap(Map<String, dynamic> map, String docId) {
    return TransactionModel(
      id: docId,
      type: map['type'] == 'income' ? TransactionType.income : TransactionType.expense,
      category: map['category'] ?? 'Other',
      amount: (map['amount'] as num).toDouble(),
      date: DateTime.parse(map['date'] ?? DateTime.now().toIso8601String()),
      note: map['note'] ?? '',
    );
  }
}
`
                },
                {
                  name: "budget_model.dart",
                  type: "file",
                  path: "lib/data/models/budget_model.dart",
                  language: "dart",
                  fileContent: `class BudgetModel {
  final String category;
  final double limit;

  BudgetModel({
    required this.category,
    required this.limit,
  });

  Map<String, dynamic> toMap() {
    return {
      'category': category,
      'limit': limit,
    };
  }

  factory BudgetModel.fromMap(Map<String, dynamic> map) {
    return BudgetModel(
      category: map['category'] ?? '',
      limit: (map['limit'] as num).toDouble(),
    );
  }
}
`
                }
              ]
            },
            {
              name: "repositories",
              type: "folder",
              path: "lib/data/repositories",
              children: [
                {
                  name: "auth_repository.dart",
                  type: "file",
                  path: "lib/data/repositories/auth_repository.dart",
                  language: "dart",
                  fileContent: `import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

class AuthRepository {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  Stream<User?> get authStateChanges => _auth.authStateChanges();

  User? get currentUser => _auth.currentUser;

  Future<UserCredential> signInWithEmailPassword(String email, String password) async {
    return await _auth.signInWithEmailAndPassword(email: email, password: password);
  }

  Future<UserCredential> signUpWithEmailPassword(String email, String password) async {
    return await _auth.createUserWithEmailAndPassword(email: email, password: password);
  }

  Future<UserCredential?> signInWithGoogle() async {
    final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
    if (googleUser == null) return null;

    final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
    final OAuthCredential credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );

    return await _auth.signInWithCredential(credential);
  }

  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _auth.signOut();
  }
}
`
                },
                {
                  name: "finance_repository.dart",
                  type: "file",
                  path: "lib/data/repositories/finance_repository.dart",
                  language: "dart",
                  fileContent: `import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/transaction_model.dart';
import '../models/budget_model.dart';

class FinanceRepository {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final String userId;

  FinanceRepository(this.userId);

  CollectionReference get _transactionRef => 
      _firestore.collection('users').doc(userId).collection('transactions');

  CollectionReference get _budgetRef => 
      _firestore.collection('users').doc(userId).collection('budgets');

  // Transactions Sync Streams
  Stream<List<TransactionModel>> getTransactions() {
    return _transactionRef.orderBy('date', descending: true).snapshots().map((snapshot) {
      return snapshot.docs.map((doc) {
        return TransactionModel.fromMap(doc.data() as Map<String, dynamic>, doc.id);
      }).toList();
    });
  }

  Future<void> addTransaction(TransactionModel tx) async {
    await _transactionRef.add(tx.toMap());
  }

  Future<void> updateTransaction(TransactionModel tx) async {
    await _transactionRef.doc(tx.id).update(tx.toMap());
  }

  Future<void> deleteTransaction(String txId) async {
    await _transactionRef.doc(txId).delete();
  }

  // Budget Sync Streams
  Stream<List<BudgetModel>> getBudgets() {
    return _budgetRef.snapshots().map((snapshot) {
      return snapshot.docs.map((doc) {
        return BudgetModel.fromMap(doc.data() as Map<String, dynamic>);
      }).toList();
    });
  }

  Future<void> saveBudget(BudgetModel budget) async {
    await _budgetRef.doc(budget.category).set(budget.toMap());
  }
}
`
                }
              ]
            }
          ]
        },
        {
          name: "presentation",
          type: "folder",
          path: "lib/presentation",
          children: [
            {
              name: "viewmodels",
              type: "folder",
              path: "lib/presentation/viewmodels",
              children: [
                {
                  name: "auth_viewmodel.dart",
                  type: "file",
                  path: "lib/presentation/viewmodels/auth_viewmodel.dart",
                  language: "dart",
                  fileContent: `import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../data/repositories/auth_repository.dart';

class AuthViewModel extends ChangeNotifier {
  final AuthRepository _repo = AuthRepository();
  User? _user;
  bool _isLoading = false;

  User? get currentUser => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;

  AuthViewModel() {
    _repo.authStateChanges.listen((user) {
      _user = user;
      notifyListeners();
    });
  }

  void _setLoading(bool val) {
    _isLoading = val;
    notifyListeners();
  }

  Future<String?> login(String email, String password) async {
    _setLoading(true);
    try {
      await _repo.signInWithEmailPassword(email, password);
      _setLoading(false);
      return null;
    } catch (e) {
      _setLoading(false);
      return e.toString();
    }
  }

  Future<String?> signUp(String email, String password) async {
    _setLoading(true);
    try {
      await _repo.signUpWithEmailPassword(email, password);
      _setLoading(false);
      return null;
    } catch (e) {
      _setLoading(false);
      return e.toString();
    }
  }

  Future<String?> signInWithGoogle() async {
    _setLoading(true);
    try {
      await _repo.signInWithGoogle();
      _setLoading(false);
      return null;
    } catch (e) {
      _setLoading(false);
      return e.toString();
    }
  }

  Future<void> logout() async {
    await _repo.signOut();
  }
}
`
                },
                {
                  name: "finance_viewmodel.dart",
                  type: "file",
                  path: "lib/presentation/viewmodels/finance_viewmodel.dart",
                  language: "dart",
                  fileContent: `import 'package:flutter/material.dart';
import 'dart:async';
import '../../data/models/transaction_model.dart';
import '../../data/models/budget_model.dart';
import '../../data/repositories/finance_repository.dart';

class FinanceViewModel extends ChangeNotifier {
  FinanceRepository? _repository;
  List<TransactionModel> _transactions = [];
  List<BudgetModel> _budgets = [];
  StreamSubscription? _txSubscription;
  StreamSubscription? _budgetSubscription;

  List<TransactionModel> get transactions => _transactions;
  List<BudgetModel> get budgets => _budgets;

  double get totalIncome => _transactions
      .where((t) => t.type == TransactionType.income)
      .fold(0.0, (sum, t) => sum + t.amount);

  double get totalExpense => _transactions
      .where((t) => t.type == TransactionType.expense)
      .fold(0.0, (sum, t) => sum + t.amount);

  double get currentBalance => totalIncome - totalExpense;

  FinanceViewModel(String? userId) {
    if (userId != null) {
      _repository = FinanceRepository(userId);
      _subscribeToData();
    }
  }

  void _subscribeToData() {
    _txSubscription = _repository?.getTransactions().listen((txList) {
      _transactions = txList;
      notifyListeners();
    });

    _budgetSubscription = _repository?.getBudgets().listen((bList) {
      _budgets = bList;
      notifyListeners();
    });
  }

  double getBudgetUsageProgress(String category) {
    final limit = getBudgetLimitForCategory(category);
    if (limit == 0) return 0.0;
    
    final spent = getSpentByCategory(category);
    return spent / limit;
  }

  double getSpentByCategory(String category) {
    return _transactions
        .where((t) => t.type == TransactionType.expense && t.category == category)
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  double getBudgetLimitForCategory(String category) {
    final budget = _budgets.firstWhere((b) => b.category == category, 
        orElse: () => BudgetModel(category: category, limit: 0));
    return budget.limit;
  }

  bool hasBudgetAlertExceeded80(String category) {
    final progress = getBudgetUsageProgress(category);
    return progress >= 0.8 && progress < 1.0;
  }

  bool hasBudgetAlertExceeded100(String category) {
    final progress = getBudgetUsageProgress(category);
    return progress >= 1.0;
  }

  Future<void> addTransaction(TransactionType type, String category, double amount, DateTime date, String note) async {
    final tx = TransactionModel(id: '', type: type, category: category, amount: amount, date: date, note: note);
    await _repository?.addTransaction(tx);
  }

  Future<void> deleteTransaction(String txId) async {
    await _repository?.deleteTransaction(txId);
  }

  Future<void> saveBudget(String category, double limit) async {
    final b = BudgetModel(category: category, limit: limit);
    await _repository?.saveBudget(b);
  }

  @override
  void dispose() {
    _txSubscription?.cancel();
    _budgetSubscription?.cancel();
    super.dispose();
  }
}
`
                },
                {
                  name: "ai_viewmodel.dart",
                  type: "file",
                  path: "lib/presentation/viewmodels/ai_viewmodel.dart",
                  language: "dart",
                  fileContent: `import 'package:flutter/material.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import '../../data/models/transaction_model.dart';

class AIViewModel extends ChangeNotifier {
  GenerativeModel? _model;
  bool _isLoading = false;
  String _aiAnalysis = "Add transitions and tap 'Analyze Spending' above to generate personalized saving recommendations and spot anomalies.";
  final List<Map<String, String>> _chatHistory = [];

  bool get isLoading => _isLoading;
  String get aiAnalysis => _aiAnalysis;
  List<Map<String, String>> get chatHistory => _chatHistory;

  AIViewModel(String? userId) {
    // Lazy initialize standard Gemini API key proxy inside Flutter Config
    // Connects through process-safe API endpoints
    _initializeGemini();
  }

  void _initializeGemini() {
    // Key will be accessed safely from secure local configurations or environment setups
    _model = GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: const String.fromEnvironment('GEMINI_API_KEY', defaultValue: ''),
    );
  }

  Future<void> analyzeSpendingHabits(List<TransactionModel> transactions) async {
    if (transactions.isEmpty) {
      _aiAnalysis = "Please log at least one expense before prompting the assistant.";
      notifyListeners();
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      final ledgerSummary = transactions.map((t) => 
        "\${t.type == TransactionType.income ? 'Income' : 'Expense'}: \${t.amount} USD categorized under \${t.category} on \${t.date.toLocal()} (\$ {t.note})"
      ).join("\\n");

      final prompt = """
      You are an expert personal finance analyzer. Inspect this user ledger:
      \${ledgerSummary}
      
      Provide a breakdown highlighting:
      1. Unusual expense behavior or patterns.
      2. Predictive spend at the end of the month based on daily velocity.
      3. Precise tips to save inside key spending categories.
      """;

      final response = await _model?.generateContent([Content.text(prompt)]);
      _aiAnalysis = response?.text ?? "Unable to aggregate predictions.";
    } catch (e) {
      _aiAnalysis = "Error analyzing metrics: \$e";
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> sendChatMessage(String msg, List<TransactionModel> contextTx) async {
    if (msg.trim().isEmpty) return;
    
    _chatHistory.add({"role": "user", "text": msg});
    _isLoading = true;
    notifyListeners();

    try {
      final ledgerContext = contextTx.map((t) => "[\${t.category}] \${t.type == TransactionType.income ? '+' : '-'}\${t.amount} USD").join(", ");
      final prompt = """
      User Ledger Context: \${ledgerContext}
      Question: \${msg}
      """;

      final response = await _model?.generateContent([Content.text(prompt)]);
      _chatHistory.add({"role": "assistant", "text": response?.text ?? "No reply."});
    } catch (e) {
      _chatHistory.add({"role": "assistant", "text": "Error: unable to fetch assistant response."});
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearChat() {
    _chatHistory.clear();
    notifyListeners();
  }
}
`
                }
              ]
            },
            {
              name: "views",
              type: "folder",
              path: "lib/presentation/views",
              children: [
                {
                  name: "auth",
                  type: "folder",
                  path: "lib/presentation/views/auth",
                  children: [
                    {
                      name: "login_view.dart",
                      type: "file",
                      path: "lib/presentation/views/auth/login_view.dart",
                      language: "dart",
                      fileContent: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/auth_viewmodel.dart';

class LoginView extends StatefulWidget {
  const LoginView({Key? key}) : super(key: key);

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isSignUp = false;

  void _submit() async {
    final auth = Provider.of<AuthViewModel>(context, listen: false);
    final email = _emailController.text.trim();
    final pwd = _passwordController.text.trim();
    
    if (email.isEmpty || pwd.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter valid email and 6+ character password.')),
      );
      return;
    }

    String? error;
    if (_isSignUp) {
      error = await auth.signUp(email, pwd);
    } else {
      error = await auth.login(email, pwd);
    }

    if (error != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthViewModel>(context);
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.account_balance_wallet, size: 80, color: Color(0xFF1E3A8A)),
              const SizedBox(height: 16),
              Text(
                'Smart Expense Tracker',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF1E3A8A),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _isSignUp ? 'Create your professional account' : 'Welcome back to your dashboard',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[600]),
              ),
              const SizedBox(height: 32),
              TextField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Email Address', border: OutlineInputBorder()),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _passwordController,
                decoration: const InputDecoration(labelText: 'Password', border: OutlineInputBorder()),
                obscureText: true,
              ),
              const SizedBox(height: 24),
              auth.isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : ElevatedButton(
                      onPressed: _submit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E3A8A),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: Text(_isSignUp ? 'SIGN UP' : 'LOG IN', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                icon: const Icon(Icons.g_mobiledata, size: 28),
                label: const Text('Sign in with Google'),
                onPressed: () async {
                  final error = await auth.signInWithGoogle();
                  if (error != null && mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error)));
                  }
                },
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              ),
              const SizedBox(height: 24),
              TextButton(
                onPressed: () => setState(() => _isSignUp = !_isSignUp),
                child: Text(_isSignUp ? 'Already have an account? Log In' : 'Create an Account'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`
                    }
                  ]
                },
                {
                  name: "dashboard",
                  type: "folder",
                  path: "lib/presentation/views/dashboard",
                  children: [
                    {
                      name: "home_view.dart",
                      type: "file",
                      path: "lib/presentation/views/dashboard/home_view.dart",
                      language: "dart",
                      fileContent: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../viewmodels/auth_viewmodel.dart';
import '../../viewmodels/finance_viewmodel.dart';
import 'add_transaction_dialog.dart';
import '../ai/ai_chat_view.dart';

class HomeView extends StatelessWidget {
  const HomeView({Key? key}) : super(key: key);

  void _showAddTransaction(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => const AddTransactionDialog(),
    );
  }

  void _showBudgetDialog(BuildContext context, String category, FinanceViewModel finance) {
    final controller = TextEditingController(text: finance.getBudgetLimitForCategory(category).toString());
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Edit \$category Budget'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(labelText: 'Limit Amount (USD)', border: OutlineInputBorder()),
          keyboardType: TextInputType.number,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              final val = double.tryParse(controller.text) ?? 0.0;
              finance.saveBudget(category, val);
              Navigator.pop(context);
            },
            child: const Text('Save'),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthViewModel>(context);
    final finance = Provider.of<FinanceViewModel>(context);
    final formatter = NumberFormat.simpleCurrency();

    return Scaffold(
      backgroundColor: const Color(0xFFF3F4F6),
      appBar: AppBar(
        title: const Text('Smart Expense Tracker', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF1E3A8A),
        actions: [
          IconButton(
            icon: const Icon(Icons.analytics_outlined),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => AIChatView(transactions: finance.transactions)),
              );
            },
            tooltip: 'AI Financial Assistant',
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => auth.logout(),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Quick Balance Stat Cards
            Card(
              color: const Color(0xFF1E3A8A),
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('CURRENT BALANCE', style: TextStyle(color: Colors.white60, fontSize: 12, letterSpacing: 1.5)),
                    const SizedBox(height: 4),
                    Text(
                      formatter.format(finance.currentBalance),
                      style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('TOTAL INCOME', style: TextStyle(color: Colors.white60, fontSize: 10)),
                            Text(formatter.format(finance.totalIncome), style: const TextStyle(color: Colors.emerald, fontSize: 16, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('TOTAL EXPENSES', style: TextStyle(color: Colors.white60, fontSize: 10)),
                            Text(formatter.format(finance.totalExpense), style: const TextStyle(color: Colors.redAccent, fontSize: 16, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ],
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            // Budgets Block
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Category Budgets & Usage', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold, color: const Color(0xFF1E3A8A))),
                TextButton(
                  onPressed: () => _showBudgetDialog(context, 'Food', finance),
                  child: const Text('Set Budget Limit'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            // List Category Progress Indicators with Warnings
            Column(
              children: ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Other'].map((category) {
                final spent = finance.getSpentByCategory(category);
                final limit = finance.getBudgetLimitForCategory(category);
                final progress = finance.getBudgetUsageProgress(category);

                if (limit == 0 && spent == 0) return const SizedBox.shrink();

                Color progressColor = Colors.teal;
                if (progress >= 1.0) {
                  progressColor = Colors.red;
                } else if (progress >= 0.8) {
                  progressColor = Colors.amber;
                }

                return Card(
                  margin: const EdgeInsets.only(bottom: 8),
                  child: ListTile(
                    title: Text(category, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 8),
                        LinearProgressIndicator(value: progress.clamp(0.0, 1.0), color: progressColor, backgroundColor: Colors.grey[200]),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('\${formatter.format(spent)} spent', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                            Text('Budget: \${limit > 0 ? formatter.format(limit) : "Not Set"}', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                          ],
                        ),
                        if (finance.hasBudgetAlertExceeded100(category))
                          const Padding(
                            padding: EdgeInsets.only(top: 4.0),
                            child: Text('🚨 Critical: Over 100% Limit Breach!', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 11)),
                          )
                        else if (finance.hasBudgetAlertExceeded80(category))
                          const Padding(
                            padding: EdgeInsets.only(top: 4.0),
                            child: Text('⚠️ Alert: Budget exceeds 80% boundary.', style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold, fontSize: 11)),
                          )
                      ],
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.edit, size: 18),
                      onPressed: () => _showBudgetDialog(context, category, finance),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Recent Transactions', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold, color: const Color(0xFF1E3A8A))),
                TextButton(
                  onPressed: () => _showAddTransaction(context),
                  child: const Text('+ Add Record'),
                )
              ],
            ),
            const SizedBox(height: 8),
            // Transaction Rows
            finance.transactions.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 32),
                      child: Text('No cash transactions logged yet.', style: TextStyle(color: Colors.grey[500])),
                    ),
                  )
                : ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: finance.transactions.length,
                    itemBuilder: (context, index) {
                      final tx = finance.transactions[index];
                      final isIncome = tx.type == TransactionType.income;
                      return Dismissible(
                        key: Key(tx.id),
                        background: Container(color: Colors.red, alignment: Alignment.centerRight, padding: const EdgeInsets.only(right: 20), child: const Icon(Icons.delete, color: Colors.white)),
                        onDismissed: (direction) => finance.deleteTransaction(tx.id),
                        child: Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: isIncome ? Colors.emerald.withOpacity(0.1) : Colors.amber.withOpacity(0.1),
                              child: Icon(
                                isIncome ? Icons.trending_up : Icons.trending_down,
                                color: isIncome ? Colors.emerald : Colors.amber[800],
                              ),
                            ),
                            title: Text(tx.note.isNotEmpty ? tx.note : tx.category, style: const TextStyle(fontWeight: FontWeight.bold)),
                            subtitle: Text('\${tx.category} • \${DateFormat('MMM d, y').format(tx.date)}'),
                            trailing: Text(
                              '\${isIncome ? '+' : '-'}\${formatter.format(tx.amount)}',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: isIncome ? Colors.emerald : Colors.redAccent,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddTransaction(context),
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
    );
  }
}
`
                    },
                    {
                      name: "add_transaction_dialog.dart",
                      type: "file",
                      path: "lib/presentation/views/dashboard/add_transaction_dialog.dart",
                      language: "dart",
                      fileContent: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/finance_viewmodel.dart';
import '../../../data/models/transaction_model.dart';

class AddTransactionDialog extends StatefulWidget {
  const AddTransactionDialog({Key? key}) : super(key: key);

  @override
  State<AddTransactionDialog> createState() => _AddTransactionDialogState();
}

class _AddTransactionDialogState extends State<AddTransactionDialog> {
  final _amountController = TextEditingController();
  final _noteController = TextEditingController();
  TransactionType _type = TransactionType.expense;
  String _category = 'Food';
  final List<String> _categories = [
    'Food', 'Transport', 'Shopping', 'Bills', 
    'Health', 'Entertainment', 'Education', 'Other'
  ];

  void _save() {
    final val = double.tryParse(_amountController.text) ?? 0.0;
    if (val <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please write numerical amount.')));
      return;
    }

    final finance = Provider.of<FinanceViewModel>(context, listen: false);
    finance.addTransaction(_type, _category, val, DateTime.now(), _noteController.text.trim());
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Add Cash Record', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A))),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Expanded(
                  child: ChoiceChip(
                    label: const Text('Spending'),
                    selected: _type == TransactionType.expense,
                    onSelected: (val) => setState(() => _type = TransactionType.expense),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ChoiceChip(
                    label: const Text('Income'),
                    selected: _type == TransactionType.income,
                    onSelected: (val) => setState(() => _type = TransactionType.income),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _amountController,
              decoration: const InputDecoration(labelText: 'Amount (USD)', border: OutlineInputBorder()),
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _category,
              decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
              items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
              onChanged: (val) => setState(() => _category = val ?? 'Other'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _noteController,
              decoration: const InputDecoration(labelText: 'Memo / Note (Optional)', border: OutlineInputBorder()),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        ElevatedButton(
          onPressed: _save,
          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1E3A8A), foregroundColor: Colors.white),
          child: const Text('Log'),
        ),
      ],
    );
  }
}
`
                    }
                  ]
                },
                {
                  name: "ai",
                  type: "folder",
                  path: "lib/presentation/views/ai",
                  children: [
                    {
                      name: "ai_chat_view.dart",
                      type: "file",
                      path: "lib/presentation/views/ai/ai_chat_view.dart",
                      language: "dart",
                      fileContent: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/ai_viewmodel.dart';
import '../../../data/models/transaction_model.dart';

class AIChatView extends StatefulWidget {
  final List<TransactionModel> transactions;
  const AIChatView({Key? key, required this.transactions}) : super(key: key);

  @override
  State<AIChatView> createState() => _AIChatViewState();
}

class _AIChatViewState extends State<AIChatView> {
  final _msgController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final aiModel = Provider.of<AIViewModel>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('SmartFinance AI Chat'),
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_sweep_outlined),
            onPressed: () => aiModel.clearChat(),
            tooltip: 'Clear History',
          )
        ],
      ),
      body: Column(
        children: [
          // Live habits static panel inside Applet View
          Container(
            padding: const EdgeInsets.all(16),
            color: const Color(0xFFEFF6FF),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('AI SPENDING INSIGHTS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: 1.2, color: Color(0xFF1E3A8A))),
                const SizedBox(height: 6),
                Text(aiModel.aiAnalysis, style: const TextStyle(fontSize: 13, height: 1.4)),
                const SizedBox(height: 8),
                aiModel.isLoading
                    ? const LinearProgressIndicator()
                    : TextButton.icon(
                        icon: const Icon(Icons.auto_awesome, size: 16),
                        label: const Text('Refresh Smart Analysis'),
                        onPressed: () => aiModel.analyzeSpendingHabits(widget.transactions),
                      )
              ],
            ),
          ),
          // Chat thread view
          Expanded(
            child: aiModel.chatHistory.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.message_outlined, size: 48, color: Colors.grey[400]),
                        const SizedBox(height: 12),
                        const Text('Ask your SmartFinance AI Assistant any cash query:', style: TextStyle(color: Colors.grey)),
                        const SizedBox(height: 8),
                        Text('• "Where did I spend the most money?"', style: TextStyle(color: Colors.grey[500], fontSize: 12)),
                        Text('• "What are the rules here to save this month?"', style: TextStyle(color: Colors.grey[500], fontSize: 12)),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: aiModel.chatHistory.length,
                    itemBuilder: (context, index) {
                      final chat = aiModel.chatHistory[index];
                      final isUser = chat["role"] == "user";
                      return Align(
                        alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          decoration: BoxDecoration(
                            color: isUser ? const Color(0xFF3B82F6) : Colors.grey[200],
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            chat["text"] ?? '',
                            style: TextStyle(color: isUser ? Colors.white : Colors.black87),
                          ),
                        ),
                      );
                    },
                  ),
          ),
          // Input Box
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _msgController,
                    decoration: InputDecoration(
                      hintText: 'Ask SmartFinance AI...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20),
                    ),
                    onSubmitted: (val) {
                      aiModel.sendChatMessage(val, widget.transactions);
                      _msgController.clear();
                    },
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.send_rounded, color: Color(0xFF1E3A8A)),
                  onPressed: () {
                    aiModel.sendChatMessage(_msgController.text.trim(), widget.transactions);
                    _msgController.clear();
                  },
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
`
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
