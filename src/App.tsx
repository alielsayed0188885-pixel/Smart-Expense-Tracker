/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent, useMemo } from "react";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Bot, 
  Sparkles, 
  FileText, 
  Folder, 
  FolderOpen, 
  BookOpen, 
  Copy, 
  Check, 
  Settings, 
  Coins, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  HelpCircle,
  Code2,
  RefreshCw,
  Sliders,
  AppWindow,
  ArrowRightLeft,
  Sun,
  Moon
} from "lucide-react";
import { flutterCodebase } from "./data/flutterCodebase";
import { Transaction, Category, Budget, ChatMessage, AIResult, FolderNode } from "./types";
import { WORLD_CURRENCIES } from "./data/currencies";

// Static premium initial values to make sure the app arrives beautifully pre-populated
const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: "tx-1", type: "income", category: "Other", amount: 4800, date: "2026-06-01", note: "Monthly Salary Core Pay" },
  { id: "tx-2", type: "expense", category: "Food", amount: 165.50, date: "2026-06-03", note: "Weekly Groceries at Whole Foods" },
  { id: "tx-3", type: "expense", category: "Transport", amount: 45.00, date: "2026-06-05", note: "Premium Gasoline Fuel" },
  { id: "tx-4", type: "expense", category: "Shopping", amount: 189.90, date: "2026-06-08", note: "Ergonomic Office Chair Upgrade" },
  { id: "tx-5", type: "expense", category: "Bills", amount: 110.00, date: "2026-06-10", note: "Smart Grid Electricity Utility" },
  { id: "tx-6", type: "expense", category: "Entertainment", amount: 48.00, date: "2026-06-12", note: "Vaporwave Concert Ticket" },
  { id: "tx-7", type: "expense", category: "Health", amount: 85.00, date: "2026-06-14", note: "Holistic Dental Care Scaling" }
];

const DEFAULT_BUDGETS: Budget[] = [
  { category: "Food", limit: 200 },
  { category: "Transport", limit: 120 },
  { category: "Shopping", limit: 300 },
  { category: "Bills", limit: 150 },
  { category: "Health", limit: 200 },
  { category: "Entertainment", limit: 50 },
  { category: "Education", limit: 100 },
  { category: "Other", limit: 250 }
];

const CATEGORIES: Category[] = [
  "Food", 
  "Transport", 
  "Shopping", 
  "Bills", 
  "Health", 
  "Entertainment", 
  "Education", 
  "Other"
];

const CATEGORY_COLORS: Record<Category, string> = {
  Food: "#3B82F6",         // Blue
  Transport: "#10B981",    // Emerald
  Shopping: "#F59E0B",     // Amber
  Bills: "#EF4444",        // Red
  Health: "#8B5CF6",       // Purple
  Entertainment: "#EC4899",// Pink
  Education: "#6366F1",    // Indigo
  Other: "#6B7280"         // Gray
};

const CATEGORY_TRANSLATIONS: Record<Category, Record<"en" | "ar" | "fr" | "it" | "de" | "es", string>> = {
  Food: { en: "Food", ar: "طعام", fr: "Alimentation", it: "Cibo", de: "Lebensmittel", es: "Comida" },
  Transport: { en: "Transport", ar: "مواصلات", fr: "Transport", it: "Trasporti", de: "Transport", es: "Transporte" },
  Shopping: { en: "Shopping", ar: "تسوق", fr: "Shopping", it: "Acquisti", de: "Einkaufen", es: "Compras" },
  Bills: { en: "Bills", ar: "فواتير", fr: "Factures", it: "Bollette", de: "Rechnungen", es: "Facturas" },
  Health: { en: "Health", ar: "صحة", fr: "Santé", it: "Salute", de: "Gesundheit", es: "Salud" },
  Entertainment: { en: "Entertainment", ar: "ترفيه", fr: "Divertissement", it: "Intrattenimento", de: "Unterhaltung", es: "Entretenimiento" },
  Education: { en: "Education", ar: "تعليم", fr: "Éducation", it: "Istruzione", de: "Bildung", es: "Educación" },
  Other: { en: "Other", ar: "أخرى", fr: "Autre", it: "Altro", de: "Sonstiges", es: "Otros" }
};

const MESSAGES_DICT = {
  en: {
    title: "Smart Expense Tracker",
    badge: "Firebase & AI",
    subtitle: "Simulated Live Playground & Flutter Core Codebase Code explorer",
    tabSim: "Interactive Demo",
    tabCode: "Flutter Source Explorer",
    netBalance: "NET LIQUID BALANCE",
    totalIncome: "TOTAL INCOME INFLOW",
    totalExpense: "TOTAL EXPENSE OUTFLOW",
    verifiedWealth: "Total verified asset wealth",
    verifiedDeposits: "↑ Verified deposits",
    categoryExpenditures: "↓ Category expenditures",
    addLogText: "Add Income or Expense",
    outflowSpent: "Outflow Spend",
    inflowDeposit: "Inflow Deposit",
    amountUsd: "Amount (USD)",
    categoryType: "Category Type",
    memoNotes: "Memo Notes",
    dateLocked: "Date Locked",
    logToLedger: "Log Record to Ledger",
    ledgerLogs: "Cash Ledger Logs",
    purgeTrashTip: "Swipe or Click trash to purge",
    noLogsMsg: "No Cash logs present in cache database.",
    noLogsSubMsg: "Populate items using the transaction builder above.",
    categoryBudgets: "Category Budgets",
    dragSlider: "Drag Slider to Edit",
    spentOf: "spent of",
    limitExceeded: "Limit Exceeded!",
    highUsage: "High usage warning!",
    visualCap: "Visual Capital Distribution",
    visualCapOutflow: "Outflow",
    advisorTitle: "SmartFinance Advisor (Gemini 3.5 Flash Client)",
    habitTitle: "AI Habit Advisor & Saving Forecast",
    advisorDesc: "Get precise forecast projections, outlier spending checks, and direct recommendations based on your custom targets.",
    telemetryReport: "System ledger telemetry report",
    triggerScan: "Trigger Model Scan",
    analyzing: "Analyzing...",
    unusualExpTitle: "⚠️ Outlier Anomaly Checker",
    predictionTitle: "📈 Velocity Spend Prediction",
    savingRecTitle: "🎯 Saving Recommendations",
    clickScanPrompt: "Click \"Trigger Model Scan\" above to run our detailed categories analyzer.",
    threadTitle: "Conversation thread with Advisor",
    clearThread: "Clear Thread",
    advisorReviewing: "Advisor is reviewing ledger indexes...",
    askPrompt: "Ask: 'How can I save more than 20% on bills?'",
    questionWhereSpend: "Where did I spend the most?",
    questionPredict: "Predict Month-End Outflow",
    questionSaveTactic: "Suggest detailed saving tactics",
    submitText: "Submit",
    flutterRepoTitle: "Flutter Clean MVVM Repo",
    flutterRepoDesc: "Explore the absolute code structure, folder indices, and configuration variables of the production-ready app.",
    mvvmArch: "MVVM Architecture",
    cleanPres: "Clean presentation separators",
    openSetup: "Open Setup Instructions",
    activeTerminal: "Active Source Viewer",
    technicalContext: "File Technical Context Annotations",
    technicalDesc: "This complete, highly scalable Flutter file is patterned strictly with clean model separation & decoupled layout architecture. Copy this file into your editor to integrate with your personal Flutter mobile application.",
    copiedText: "Copied!",
    copySource: "Copy Source",
    workspaceFiles: "Workspace Files",
    aiInitMessage: "Hello! I am your SmartFinance AI advisor. I've analyzed your monthly cash ledger. Ask me any spending patterns questions, like: 'Where is my cash going?', 'Can you forecast my end-of-month spent?', or 'How can I save \$100 more this season?'",
    alertGenuineAmount: "Please specify a genuine numeric amount.",
    
    // Keys used dynamically on screens
    logRecordButton: "Log Record to Ledger",
    cashLedgerLogs: "Cash Ledger Logs",
    trashToPurge: "Click trash to delete",
    noLogsPresent: "No Cash logs present in cache database.",
    populateUsingBuilder: "Populate items using the transaction builder above.",
    ofText: "spent of",
    limitText: "limit",
    limitExceededText: "Limit Exceeded!",
    spendingAt: "spending at",
    warningOver80: "High usage warning! (Spending over 80%)",
    distributionTitle: "Visual Capital Distribution",
    outflowLabel: "Outflow",
    themeLightButton: "Light Mode",
    themeDarkButton: "Dark Mode",
    graphsWithArrowsTitle: "Interactive Flow & Trend Maps",
    cashFlowMap: "Sankey Flow Node Map",
    cashFlowMapDesc: "Live micro-animated fluid arrows tracking deposits to budget nodes.",
    weeklyTrend: "Weekly Spend Velocity & Indicators",
    weeklyTrendDesc: "Weekly expenditure progression with delta change arrows."
  },
  ar: {
    title: "مُتتبع المصروفات الذكي",
    badge: "فايربيس والذكاء الاصطناعي",
    subtitle: "بيئة تجريبية تفاعلية ومستودع كود فلاتر المصدري",
    tabSim: "العرض التجريبي والتفاعل",
    tabCode: "مستكشف كود فلاتر",
    netBalance: "صافي الرصيد الحالي",
    totalIncome: "إجمالي الدخل الوارد",
    totalExpense: "إجمالي المصروفات الخارجة",
    verifiedWealth: "إجمالي الثروة المعتمدة",
    verifiedDeposits: "↑ إيداعات مؤكدة",
    categoryExpenditures: "↓ مصروفات حسب الفئة",
    addLogText: "تسجيل دخل أو مصروف جديد",
    outflowSpent: "تسجيل مصروفات",
    inflowDeposit: "تسجيل واردات / دخل",
    amountUsd: "المبلغ (دولار)",
    categoryType: "الفئة",
    memoNotes: "الملاحظة / البيان",
    dateLocked: "التاريخ والتوقيت",
    logToLedger: "حفظ المعاملة في الدفتر",
    ledgerLogs: "المعاملات المالية الحالية",
    purgeTrashTip: "اضغط على سلة المهملات للحذف",
    noLogsMsg: "لا توجد أي معاملات مسجلة في قاعدة البيانات حالياً.",
    noLogsSubMsg: "استخدم نموذج الإدخال أعلاه لإضافة معاملات جديدة.",
    categoryBudgets: "ميزانيات الفئات المحددة",
    dragSlider: "اسحب لتعديل ميزانية الفئة المحددة",
    spentOf: "تم إنفاقه من أصل",
    limitExceeded: "لقد تجاوزت ميزانية هذه الفئة!",
    highUsage: "تحذير: استهلاك مرتفع تجاوز 80%!",
    visualCap: "توزيع رأس المال والمصروفات مرئياً",
    visualCapOutflow: "مصروفات",
    advisorTitle: "مستشار الإدارة المالية بالذكاء الاصطناعي (Gemini 3.5)",
    habitTitle: "تقرير مستشار عادات الإنفاق وتوقعات الادخار الفعالة",
    advisorDesc: "احصل على توقعات تفصيلية دقيقة لمستويات إنفاقك ومراجعة المصروفات الشاذة مع توصيات ادخار مخصصة.",
    telemetryReport: "تقرير حالة الميزانية والتدفقات النقدية",
    triggerScan: "تحديث مراجعة الذكاء الاصطناعي",
    analyzing: "جاري تحليل البيانات...",
    unusualExpTitle: "⚠️ فحص المصروفات غير المعتادة",
    predictionTitle: "📈 توقعات الإنفاق بنهاية الشهر",
    savingRecTitle: "🎯 نصائح وتوصيات الادخار المقترحة",
    clickScanPrompt: "انقر على زر 'تحديث مراجعة الذكاء الاصطناعي' للحصول على مسح شامل لميزانيتك ومصروفاتك.",
    threadTitle: "محادثة مخصصة مع مستشار التمويل الشخصي",
    clearThread: "مسح المحادثة بالكامل",
    advisorReviewing: "جاري تحليل المعاملات والميزانيات...",
    askPrompt: "مثال: كيف يمكنني توفير أكثر من 20% هذا الشهر؟",
    questionWhereSpend: "أين أنفقت معظم أموالي؟",
    questionPredict: "توقع مصروفاتي بنهاية الشهر",
    questionSaveTactic: "ما هي أفضل الطرق لتقليص النفقات بالكامل؟",
    submitText: "إرسال",
    flutterRepoTitle: "مستودع كود فلاتر النظيف MVVM",
    flutterRepoDesc: "تفقد بنية المجلدات وهيكلية المكونات البرمجية النظيفة لإنشاء تطبيق الموبايل الحقيقي المتكامل.",
    mvvmArch: "بنية الكود النظيف MVVM",
    cleanPres: "فصل طبقات العرض والبيانات",
    openSetup: "فتح إرشادات التثبيت والتشغيل",
    activeTerminal: "مستعرض الكود المصدري المفصل",
    technicalContext: "ملاحظات الدعم الفني لكود فلاتر",
    technicalDesc: "هذا الملف البرمجي متكامل ومكتوب بلغة ديرت (Dart) وفقاً لأعلى معايير جودة الكود وبنية MVVM. انسخ الكود مباشرة وادمجه في تطبيق فلاتر الخاص بك.",
    copiedText: "تم النسخ بنجاح!",
    copySource: "نسخ الكود",
    workspaceFiles: "ملفات المستودع",
    aiInitMessage: "مرحباً بك! أنا مستشارك المالي المدعوم بالذكاء الاصطناعي. لقد قمت بتحليل حركتك المالية لمجموع الفئات والمصروفات المسجلة. يمكنك سؤالي عن نمط استهلاكك المالي، مثل: 'أين تذهب أموالي؟' أو 'كيف يمكنني توفير أكثر من 150 دولاراً هذا الشهر؟'",
    alertGenuineAmount: "يرجى تحديد مبلغ مالي صحيح أكبر من الصفر.",

    // Keys used dynamically on screens
    logRecordButton: "حفظ المعاملة في الدفتر",
    cashLedgerLogs: "المعاملات المالية الحالية",
    trashToPurge: "حذف المعاملة",
    noLogsPresent: "لا توجد أي معاملات مسجلة في قاعدة البيانات حالياً.",
    populateUsingBuilder: "استخدم نموذج الإدخال أعلاه لإضافة معاملات جديدة.",
    ofText: "تم إنفاقه من أصل",
    limitText: "ميزانية مخصصة",
    limitExceededText: "تجاوزت الحد المسموح!",
    spendingAt: "الإنفاق الحالي بنسبة",
    warningOver80: "تحذير: استهلاك مرتفع تجاوز 80%!",
    distributionTitle: "توزيع رأس المال والمصروفات مرئياً",
    outflowLabel: "مصروفات خارجة",
    themeLightButton: "الوضع المضيء",
    themeDarkButton: "الوضع الداكن",
    graphsWithArrowsTitle: "خرائط التدفق والاتجاهات التفاعلية",
    cashFlowMap: "خريطة تدفق السيولة النقدية",
    cashFlowMapDesc: "أسهم انسيابية متحركة لتتبع توزيع الودائع والإنفاق.",
    weeklyTrend: "مؤشرات سرعة الإنفاق الأسبوعي",
    weeklyTrendDesc: "مستويات المصروفات الأسبوعية مع أسهم الدلتا للتغير."
  },
  fr: {
    title: "Suivi des Dépenses",
    badge: "Firebase & IA",
    subtitle: "Démonstration interactive & Explorateur de code source Flutter",
    tabSim: "Démo Interactive",
    tabCode: "Explorateur de Code Flutter",
    netBalance: "SOLDE NET DISPONIBLE",
    totalIncome: "REVENUS ENTRANT TOTAUX",
    totalExpense: "DÉPENSES SORTANTES TOTALES",
    verifiedWealth: "Actifs financiers totaux vérifiés",
    verifiedDeposits: "↑ Dépôts vérifiés",
    categoryExpenditures: "↓ Dépenses par catégorie",
    addLogText: "Ajouter un revenu ou une dépense",
    outflowSpent: "Dépense",
    inflowDeposit: "Revenu",
    amountUsd: "Montant (USD)",
    categoryType: "Type de catégorie",
    memoNotes: "Notes / Médo",
    dateLocked: "Date verrouillée",
    logToLedger: "Enregistrer la transaction",
    ledgerLogs: "Registre des transactions",
    purgeTrashTip: "Glisser ou cliquer sur la corbeille pour supprimer",
    noLogsMsg: "Aucun log n'est disponible dans le cache.",
    noLogsSubMsg: "Ajoutez des transactions à l'aide du formulaire ci-dessus.",
    categoryBudgets: "Budgets des catégories",
    dragSlider: "Faites glisser pour modifier le budget",
    spentOf: "dépensé sur",
    limitExceeded: "Limite dépassée !",
    highUsage: "Alerte de consommation élevée !",
    visualCap: "Répartition visuelle du capital",
    visualCapOutflow: "Dépenses",
    advisorTitle: "Conseiller SmartFinance (Gemini 3.5)",
    habitTitle: "Analyse d'habitudes IA & Prédictions d'épargne",
    advisorDesc: "Bénéficiez de prévisions de dépenses personnalisées, d'une détection des anomalies et de stratégies d'épargne.",
    telemetryReport: "Rapport télémétrique budgétaire",
    triggerScan: "Lancer l'analyse IA",
    analyzing: "Analyse des données...",
    unusualExpTitle: "⚠️ Détecteur d'anomalies de dépenses",
    predictionTitle: "📈 Prédiction de fin de mois",
    savingRecTitle: "🎯 Recommandations d'épargne",
    clickScanPrompt: "Cliquez sur \"Lancer l'analyse IA\" ci-dessus pour exécuter l'analyse complète de votre solde.",
    threadTitle: "Discussion avec le conseiller IA",
    clearThread: "Effacer la discussion",
    advisorReviewing: "Le conseiller analyse vos flux budgétaires...",
    askPrompt: "Exemple : 'Comment économiser 20% sur mes factures ?'",
    questionWhereSpend: "Où ai-je le plus dépensé ?",
    questionPredict: "Prédire mes dépenses à la fin du mois",
    questionSaveTactic: "Donne-moi des astuces de réduction de budget",
    submitText: "Envoyer",
    flutterRepoTitle: "Dépôt de Code Flutter MVVM Clean",
    flutterRepoDesc: "Explorez l'architecture complète, la structure des dossiers et la configuration globale.",
    mvvmArch: "Architecture MVVM",
    cleanPres: "Séparation d'interface et logique",
    openSetup: "Voir les instructions d'installation",
    activeTerminal: "Visualiseur actif de source",
    technicalContext: "Annotations d'architecture de fichier",
    technicalDesc: "Ce fichier Flutter de production hautement évolutif est structuré selon les standards d'architecture propre découplée.",
    copiedText: "Copié !",
    copySource: "Copier le code",
    workspaceFiles: "Fichiers du projet",
    aiInitMessage: "Bonjour ! Je suis votre conseiller financier IA. J'ai analysé votre budget mensuel. Posez-moi vos questions, comme : 'Où va mon argent ?', 'Quelles sont mes dépenses estimées de fin de mois ?' ou 'Comment économiser 100 $ supplémentaires ?'",
    alertGenuineAmount: "Veuillez spécifier un montant numérique valide.",

    // Keys used dynamically on screens
    logRecordButton: "Enregistrer la transaction",
    cashLedgerLogs: "Registre des transactions",
    trashToPurge: "Cliquer sur la corbeille pour supprimer",
    noLogsPresent: "Aucun log n'est disponible dans le cache.",
    populateUsingBuilder: "Ajoutez des transactions à l'aide du formulaire ci-dessus.",
    ofText: "dépensé sur",
    limitText: "limite",
    limitExceededText: "Limite dépassée !",
    spendingAt: "taux de dépenses à",
    warningOver80: "Consommation excessive (plus de 80%) !",
    distributionTitle: "Répartition visuelle du capital",
    outflowLabel: "Dépenses",
    themeLightButton: "Mode Clair",
    themeDarkButton: "Mode Sombre",
    graphsWithArrowsTitle: "Cartes de Flux & Tendances",
    cashFlowMap: "Carte de Flux de Trésorerie",
    cashFlowMapDesc: "Flèches fluides animées pour suivre les dépôts vers les catégories.",
    weeklyTrend: "Vélocité & Indicateurs Hebdos",
    weeklyTrendDesc: "Progression hebdomadaire avec flèches de variation de delta."
  },
  it: {
    title: "Gestore Spese Intelligente",
    badge: "Firebase & IA",
    subtitle: "Dettagli interattivi & Navigatore codice sorgente Flutter",
    tabSim: "Demo Interattiva",
    tabCode: "Navigatore sorgenti Flutter",
    netBalance: "SALDO NETTO DISPONIBILE",
    totalIncome: "ENTRATE TOTALI",
    totalExpense: "USCITE TOTALI",
    verifiedWealth: "Valore totale degli attivi verificati",
    verifiedDeposits: "↑ Depositi verificati",
    categoryExpenditures: "↓ Uscite per categoria",
    addLogText: "Registra entrate o uscite",
    outflowSpent: "Spesa",
    inflowDeposit: "Entrata",
    amountUsd: "Importo (USD)",
    categoryType: "Tipo di categoria",
    memoNotes: "Annotazioni / Memo",
    dateLocked: "Data bloccata",
    logToLedger: "Registra transazione nel libro",
    ledgerLogs: "Libro delle transazioni",
    purgeTrashTip: "Scorri o clicca sul cestino per rimuovere",
    noLogsMsg: "Nessuna transazione registrata in memoria.",
    noLogsSubMsg: "Aggiungi voci finanziarie utilizzando il modulo sopra.",
    categoryBudgets: "Budget stabiliti per categoria",
    dragSlider: "Trascina per variare la soglia",
    spentOf: "speso di",
    limitExceeded: "Soglia superata !",
    highUsage: "Attenzione: utilizzo elevato !",
    visualCap: "Distribuzione visiva dei beni",
    visualCapOutflow: "Spese",
    advisorTitle: "Consulente SmartFinance (Gemini 3.5)",
    habitTitle: "Consulente abitudini IA & Previsione risparmi",
    advisorDesc: "Ricevi proiezioni di budget reali, rilevazione di anomalie e dritte di risparmio mirate.",
    telemetryReport: "Analisi telemetrica del saldo",
    triggerScan: "Esegui analisi IA",
    analyzing: "Analisi in corso...",
    unusualExpTitle: "⚠️ Rilevatore anomalie spese",
    predictionTitle: "📈 Previsioni finanziarie fine mese",
    savingRecTitle: "🎯 Suggerimenti di ottimizzazione",
    clickScanPrompt: "Clicca su \"Esegui analisi IA\" sopra per avviare il controllo completo del portafoglio.",
    threadTitle: "In chat con il consulente personale",
    clearThread: "Svuota chat",
    advisorReviewing: "Il consulente controlla il registro spese...",
    askPrompt: "Ad esempio: 'Come risparmio il 20% sulle bollette ?'",
    questionWhereSpend: "Dove ho speso maggiormente questo mese ?",
    questionPredict: "Prevedi il bilancio complessivo a fine mese",
    questionSaveTactic: "Elenca tattiche per tagliare i costi",
    submitText: "Invia",
    flutterRepoTitle: "Repository Clean MVVM Flutter",
    flutterRepoDesc: "Scopri il flusso architetturale, le directory e le variabili operative della base codice nativa.",
    mvvmArch: "Architettura MVVM",
    cleanPres: "Separazione netta View e Model",
    openSetup: "Leggi istruzioni di avvio",
    activeTerminal: "Visualizzatore codice attivo",
    technicalContext: "Commenti tecnici di sviluppo",
    technicalDesc: "Questo file Dart completo ed ottimizzato rispetta pienamente i requisiti industriali di codice pulito.",
    copiedText: "Copiato !",
    copySource: "Copia codice",
    workspaceFiles: "File nel workspace",
    aiInitMessage: "Ciao! Sono il tuo pianificatore finanziario della chat IA. Ho esaminato le tue registrazioni correnti. Chiedimi qualunque cosa: 'Oltre a cibo e trasporti, dove posso risparmiare ?', 'Qual è la stima del mio saldo complessivo ?' o 'Come conservare 100 $ di più ?'",
    alertGenuineAmount: "Per inserire una transazione, specifica un valore numerico positivo.",

    // Keys used dynamically on screens
    logRecordButton: "Registra transazione nel libro",
    cashLedgerLogs: "Libro delle transazioni",
    trashToPurge: "Clicca sul cestino per rimuovere",
    noLogsPresent: "Nessuna transazione registrata in memoria.",
    populateUsingBuilder: "Aggiungi voci finanziarie utilizzando il modulo sopra.",
    ofText: "speso di",
    limitText: "limite",
    limitExceededText: "Soglia superata !",
    spendingAt: "spesa corrente al",
    warningOver80: "Attenzione: utilizzo elevato oltre l'80% !",
    distributionTitle: "Distribuzione visiva dei beni",
    outflowLabel: "Spese",
    themeLightButton: "Modalità Chiara",
    themeDarkButton: "Modalità Scura",
    graphsWithArrowsTitle: "Mappe di Flusso & Tendenze",
    cashFlowMap: "Mappa del Flusso di Cassa",
    cashFlowMapDesc: "Frecce fluide animate che tracciano depositi e budget.",
    weeklyTrend: "Velocità & Indicatori Settimanali",
    weeklyTrendDesc: "Progressione delle spese settimanali con frecce di variazione delta."
  },
  de: {
    title: "Budget-Manager",
    badge: "Firebase & KI",
    subtitle: "Interaktives Dashboard & Flutter-Quellcode-Explorer",
    tabSim: "Interaktives Demobild",
    tabCode: "Flutter Code-Verzeichnis",
    netBalance: "NETTO-KASSENSALDO",
    totalIncome: "GESAMTEINNAHMEN (EINFLUSS)",
    totalExpense: "GESAMTAUSGABEN (AUSFLUSS)",
    verifiedWealth: "Gesamtes dokumentiertes Vermögen",
    verifiedDeposits: "↑ Verifizierte Einnahmen",
    categoryExpenditures: "↓ Ausgaben nach Kategorie",
    addLogText: "Einnahme oder Ausgabe buchen",
    outflowSpent: "Ausgabe",
    inflowDeposit: "Einnahme",
    amountUsd: "Betrag (USD)",
    categoryType: "Kategorietyp",
    memoNotes: "Notiz / Betreff",
    dateLocked: "Uhrzeit & Datum",
    logToLedger: "Buchungssatz speichern",
    ledgerLogs: "Dokumentierte Transaktionen",
    purgeTrashTip: "Wische oder klicke das Müll-Icon zum Löschen",
    noLogsMsg: "Keine Buchungen in der lokalen Cache-Datenbank.",
    noLogsSubMsg: "Fügen Sie mit dem obigen Formular erste Buchungen hinzu.",
    categoryBudgets: "Kategorieweise monatliche Budgets",
    dragSlider: "Schieberegler zum Ändern ziehen",
    spentOf: "ausgegeben von",
    limitExceeded: "Kategoriebudget überschritten !",
    highUsage: "Warnung vor hohen Ausgaben !",
    visualCap: "Muster der Kostenverteilung",
    visualCapOutflow: "Ausgaben Ausfluss",
    advisorTitle: "SmartFinance-Berater (Gemini 3.5)",
    habitTitle: "KI-Analysen & Spar-Projektionen",
    advisorDesc: "Profitieren Sie von präzisen Ausgabenvorschauen, Anomalieprüfungen und maßgeschneiderten Ratschlägen.",
    telemetryReport: "Telemetriebericht für Budgetverlauf",
    triggerScan: "KI-Scan ausführen",
    analyzing: "Analysiere Datensätze...",
    unusualExpTitle: "⚠️ Erkennung untypischer Kosten",
    predictionTitle: "📈 Hochrechnung für Monatsende",
    savingRecTitle: "🎯 Konkrete Handlungsempfehlungen",
    clickScanPrompt: "Klicken Sie oben auf \"KI-Scan ausführen\" für eine eingehende finanzielle Beurteilung durch die KI.",
    threadTitle: "Sitzung mit dem Finanzassistenten",
    clearThread: "Chatverlauf leeren",
    advisorReviewing: "KI liest Buchhaltungsinformationen ein...",
    askPrompt: "Frage z. B.: 'Wie reduziere ich meine Fixkosten um 20% ?'",
    questionWhereSpend: "Wo sind meine größten Kostentreiber ?",
    questionPredict: "Analysiere Gesamtausgaben am Ende des Monats",
    questionSaveTactic: "Gib mir erprobte Spartipps zur Budgetierung",
    submitText: "Senden",
    flutterRepoTitle: "Flutter MVVM Clean Repository",
    flutterRepoDesc: "Prüfen Sie Architekturmuster, Verzeichnisse und Umgebungsdaten der Mobil-App.",
    mvvmArch: "MVVM Muster",
    cleanPres: "Saubere Dekopplung von UI und Logik",
    openSetup: "Bereitstellungsanleitung lesen",
    activeTerminal: "Dart-Quelltextansicht",
    technicalContext: "Kontextkommentar des Moduls",
    technicalDesc: "Diese Flutter-Klasse folgt streng den Best Practices für entkoppelte und testbare Codebasen.",
    copiedText: "Kopiert !",
    copySource: "Quelltext kopieren",
    workspaceFiles: "Workspace Dateien",
    aiInitMessage: "Guten Tag! Ich bin Ihr intelligenter SmartFinance-Berater. Ich habe Ihre Buchdaten eingelesen. Fragen Sie mich z. B.: 'Wohin fließt mein Geld?', 'Wie hoch ist meine geschätzte Kreditkartennutzung?' oder 'Wie spare ich 100 $ mehr?'",
    alertGenuineAmount: "Bitte tragen Sie einen korrekten numerischen Wert ein.",

    // Keys used dynamically on screens
    logRecordButton: "Buchungssatz speichern",
    cashLedgerLogs: "Dokumentierte Transaktionen",
    trashToPurge: "Klicke das Müll-Icon zum Löschen",
    noLogsPresent: "Keine Buchungen in der lokalen Cache-Datenbank.",
    populateUsingBuilder: "Fügen Sie mit dem obigen Formular erste Buchungen hinzu.",
    ofText: "ausgegeben von",
    limitText: "Limit",
    limitExceededText: "Kategoriebudget überschritten !",
    spendingAt: "Ausgabenquote aktuell bei",
    warningOver80: "Warnung: Budgetauslastung über 80% !",
    distributionTitle: "Muster der Kostenverteilung",
    outflowLabel: "Ausgaben Ausfluss",
    themeLightButton: "Heller Modus",
    themeDarkButton: "Dunkler Modus",
    graphsWithArrowsTitle: "Interaktive Fluss- & Trendkarten",
    cashFlowMap: "Cashflow-Flussdiagramm",
    cashFlowMapDesc: "Animierte Pfeile zeigen den Weg von Einzahlungen zu Budgets.",
    weeklyTrend: "Wöchentliche Ausgabengeschwindigkeit",
    weeklyTrendDesc: "Wöchentlicher Ausgabenverlauf mit Delta-Tendenzpfeilen."
  },
  es: {
    title: "Controlador de Gastos",
    badge: "Firebase e IA",
    subtitle: "Área interactiva de simulación y explorador de código de Flutter",
    tabSim: "Demo Interactiva",
    tabCode: "Explorador de Código Flutter",
    netBalance: "SALDO NETO RECTIFICADO",
    totalIncome: "INGRESOS TOTALES (ENTRADAS)",
    totalExpense: "EGRESOS TOTALES (SALIDAS)",
    verifiedWealth: "Total acumulado verificado en activos",
    verifiedDeposits: "↑ Depósitos verificados",
    categoryExpenditures: "↓ Detalle de gastos por categorías",
    addLogText: "Añadir ingreso o egreso de caja",
    outflowSpent: "Gasto",
    inflowDeposit: "Ingreso",
    amountUsd: "Monto total (USD)",
    categoryType: "Categoría de transacción",
    memoNotes: "Observaciones / Memo",
    dateLocked: "Fecha de operación",
    logToLedger: "Contabilizar movimiento",
    ledgerLogs: "Libro de caja diario",
    purgeTrashTip: "Haz clic o desliza el icono para eliminar",
    noLogsMsg: "No se registran operaciones en la base de datos local.",
    noLogsSubMsg: "Ingresa transacciones a través del formulario superior para poblar la vista.",
    categoryBudgets: "Límites y presupuestos mensuales",
    dragSlider: "Arrastra el control para redefinir el límite",
    spentOf: "gastado de",
    limitExceeded: "¡Límite de presupuesto excedido!",
    highUsage: "¡Alerta: consumo superior al 80%!",
    visualCap: "Estructura de dispersión del capital",
    visualCapOutflow: "Egresos de caja",
    advisorTitle: "Asesor Financiero Virtual (Gemini 3.5)",
    habitTitle: "Plan de ahorro e indicadores de consumo",
    advisorDesc: "Visualice de manera simple sus predicciones, anomalías de facturación e ideas inteligentes de ahorro.",
    telemetryReport: "Reporte general de saldos consolidados",
    triggerScan: "Ejecutar análisis IA",
    analyzing: "Analizando registros...",
    unusualExpTitle: "⚠️ Detección de gastos atípicos",
    predictionTitle: "📈 Simulación de consumo a fin de mes",
    savingRecTitle: "🎯 Recomendaciones de reducción de costes",
    clickScanPrompt: "Haz clic en \"Ejecutar análisis IA\" de la parte superior para consultar a la inteligencia artificial.",
    threadTitle: "Panel interactivo con el asesor",
    clearThread: "Limpiar historial",
    advisorReviewing: "El asesor está examinando sus cuentas...",
    askPrompt: "Ejemplo: '¿Cómo puedo recortar un 20% en facturas mensuales?'",
    questionWhereSpend: "¿Cuáles son mis categorías con mayor gasto?",
    questionPredict: "Estima mis egresos para el término del ciclo diario",
    questionSaveTactic: "Sugiere tácticas concretas para reservar dinero",
    submitText: "Enviar pregunta",
    flutterRepoTitle: "Estructura Flutter MVVM Impecable",
    flutterRepoDesc: "Inspeccione la jerarquía de directorios, ViewModels y configuraciones nativas.",
    mvvmArch: "Patrón MVVM",
    cleanPres: "Desacoplamiento de vistas e infraestructura",
    openSetup: "Leer documentación técnica",
    activeTerminal: "Lector de código fuente Dart",
    technicalContext: "Contextualización del módulo de desarrollo",
    technicalDesc: "Este archivo Dart implementa altos estándares de arquitectura desacoplada ideales para producción.",
    copiedText: "¡Copiado!",
    copySource: "Copiar código",
    workspaceFiles: "Archivos del proyecto",
    aiInitMessage: "¡Hola! Soy tu planificador y asesor financiero inteligente de IA. He procesado tu libreta de cuentas. Consúltame lo que necesites, por ejemplo: '¿En qué concepto he consumido más saldo?', '¿Cuál es mi estimación de gastos para fin de mes?' o '¿Cómo puedo maximizar mis ahorros?'",
    alertGenuineAmount: "Por favor, introduce una cifra numérica válida.",

    // Keys used dynamically on screens
    logRecordButton: "Contabilizar movimiento",
    cashLedgerLogs: "Libro de caja diario",
    trashToPurge: "Haz clic en el icono para eliminar",
    noLogsPresent: "No se registran operaciones en la base de datos local.",
    populateUsingBuilder: "Ingresa transacciones a través del formulario superior para poblar la vista.",
    ofText: "gastado de",
    limitText: "límite",
    limitExceededText: "¡Límite de presupuesto excedido!",
    spendingAt: "porcentaje de coste corriente al",
    warningOver80: "¡Alerta: consumo superior al 80%!",
    distributionTitle: "Estructura de dispersión del capital",
    outflowLabel: "Egresos de caja",
    themeLightButton: "Modo Claro",
    themeDarkButton: "Modo Oscuro",
    graphsWithArrowsTitle: "Mapas de Flujo e Indicadores",
    cashFlowMap: "Mapa de Flujo de Efectivo",
    cashFlowMapDesc: "Flechas animadas fluidas que rastrean depósitos y egresos.",
    weeklyTrend: "Velocidad de Gastos Semanales",
    weeklyTrendDesc: "Evolución acumulada con flechas delta de desviación."
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"simulator" | "flutter-explorer">("simulator");
  const [language, setLanguage] = useState<"en" | "ar" | "fr" | "it" | "de" | "es">(() => {
    const cached = localStorage.getItem("smart_finance_lang");
    return (cached === "ar" || cached === "en" || cached === "fr" || cached === "it" || cached === "de" || cached === "es") ? cached : "en";
  });
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const cached = localStorage.getItem("smart_finance_theme");
    return (cached === "dark" || cached === "light") ? cached : "light";
  });
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem("smart_finance_currency") || "USD";
  });

  const activeCurrency = WORLD_CURRENCIES.find(c => c.code === currency) || { code: "USD", symbol: "$", name: "US Dollar" };

  const formatAmount = (val: number, decimals: number = 2) => {
    return `${activeCurrency.symbol}${val.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}`;
  };
  
  // Ledger States
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const cached = localStorage.getItem("smart_finance_txs");
    return cached ? JSON.parse(cached) : DEFAULT_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const cached = localStorage.getItem("smart_finance_budgets");
    return cached ? JSON.parse(cached) : DEFAULT_BUDGETS;
  });

  // Daily, Weekly, and Monthly Accounting System States
  const [accountingMode, setAccountingMode] = useState<"all" | "daily" | "weekly" | "monthly">("all");
  const [accountingDate, setAccountingDate] = useState<string>("2026-06-17");
  const [copiedReport, setCopiedReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  // Maximum Consumption Limit state
  const [maxConsumptionLimit, setMaxConsumptionLimit] = useState<number>(() => {
    const cached = localStorage.getItem("smart_finance_max_consumption_limit");
    return cached ? parseFloat(cached) : 3500;
  });

  // Return the Sunday to Saturday boundaries of a date string "YYYY-MM-DD"
  const getWeeklyBoundaries = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        return { startStr: "2026-06-14", endStr: "2026-06-20", label: "Sunday, June 14 - Saturday, June 20, 2026" };
      }
      const day = d.getDay(); // 0 is Sunday, 1 is Monday...
      const start = new Date(d);
      start.setDate(d.getDate() - day);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const startStr = start.toISOString().split("T")[0];
      const endStr = end.toISOString().split("T")[0];

      // Formatted label like "Jun 14 - Jun 20"
      const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
      const startLabel = start.toLocaleDateString(language, options);
      const endLabel = end.toLocaleDateString(language, { ...options, year: "numeric" });
      
      return {
        startStr,
        endStr,
        label: language === "ar" 
          ? `أسبوع الحسابات: من ${start.toLocaleDateString("ar-EG", options)} إلى ${end.toLocaleDateString("ar-EG", { ...options, year: "numeric" })}`
          : `Accounting Week: ${startLabel} - ${endLabel}`
      };
    } catch (e) {
      return { startStr: "2026-06-14", endStr: "2026-06-20", label: "June 14 - June 20, 2026" };
    }
  };

  const getMonthlyBoundaries = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      const year = parts[0];
      const month = parts[1];
      const d = new Date(parseInt(year), parseInt(month) - 1, 1);
      const monthName = d.toLocaleDateString(language, { month: "long" });
      return {
        label: language === "ar"
          ? `دورة دفاتر شهر: ${d.toLocaleDateString("ar-EG", { month: "long" })} ${year}`
          : `Accounting Month: ${monthName} ${year}`,
        prefix: `${year}-${month}`
      };
    } catch {
      return { label: "June 2026", prefix: "2026-06" };
    }
  };

  const getDailyLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(language, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const handleShiftPeriod = (direction: -1 | 1) => {
    const d = new Date(accountingDate);
    if (isNaN(d.getTime())) return;

    if (accountingMode === "daily") {
      d.setDate(d.getDate() + direction);
    } else if (accountingMode === "weekly") {
      d.setDate(d.getDate() + direction * 7);
    } else if (accountingMode === "monthly") {
      // Prevent running out of bounds
      d.setMonth(d.getMonth() + direction);
    }
    setAccountingDate(d.toISOString().split("T")[0]);
  };

  // Inputs for adding Transaction
  const [amountInput, setAmountInput] = useState("");
  const [typeInput, setTypeInput] = useState<"income" | "expense">("expense");
  const [categoryInput, setCategoryInput] = useState<Category>("Food");
  const [noteInput, setNoteInput] = useState("");
  const [dateInput, setDateInput] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Flutter Explorer states
  const [selectedFile, setSelectedFile] = useState<FolderNode | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "/": true,
    "lib": true,
    "lib/data": true,
    "lib/data/models": true,
    "lib/data/repositories": true,
    "lib/presentation": true,
    "lib/presentation/viewmodels": true,
    "lib/presentation/views": true,
    "lib/presentation/views/auth": true,
    "lib/presentation/views/dashboard": true,
    "lib/presentation/views/ai": true,
  });
  const [copiedFile, setCopiedFile] = useState(false);

  // Gemini AI Panel States
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const cached = localStorage.getItem("smart_finance_lang");
    const initLang = (cached === "ar" || cached === "en" || cached === "fr" || cached === "it" || cached === "de" || cached === "es") ? cached : "en";
    return [
      {
        id: "init",
        role: "assistant",
        content: MESSAGES_DICT[initLang].aiInitMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [userInput, setUserInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIResult | null>(null);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);

  // Interactive Graph Hover States
  const [hoveredSankeyNode, setHoveredSankeyNode] = useState<string | null>(null);
  const [hoveredTrendNode, setHoveredTrendNode] = useState<{ weekIndex: number; type: "inflow" | "outflow" } | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem("smart_finance_txs", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("smart_finance_budgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("smart_finance_lang", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("smart_finance_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("smart_finance_currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("smart_finance_max_consumption_limit", maxConsumptionLimit.toString());
  }, [maxConsumptionLimit]);

  // Set default preview file
  useEffect(() => {
    if (flutterCodebase && flutterCodebase.children && !selectedFile) {
      const readme = flutterCodebase.children.find(c => c.name.endsWith(".md"));
      if (readme) {
        setSelectedFile(readme);
      } else {
        setSelectedFile(flutterCodebase.children[0]);
      }
    }
  }, [selectedFile]);

  // Automatically synchronize builder date default with active observed accounting period
  useEffect(() => {
    setDateInput(accountingDate);
  }, [accountingDate]);

  // Master Filtered Transactions based on selected Accounting Period (Daily/Weekly/Monthly)
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (accountingMode === "all") return true;
      if (accountingMode === "daily") {
        return tx.date === accountingDate;
      }
      if (accountingMode === "weekly") {
        const { startStr, endStr } = getWeeklyBoundaries(accountingDate);
        return tx.date >= startStr && tx.date <= endStr;
      }
      if (accountingMode === "monthly") {
        const { prefix } = getMonthlyBoundaries(accountingDate);
        return tx.date.startsWith(prefix);
      }
      return true;
    });
  }, [transactions, accountingMode, accountingDate]);

  // Calculations
  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Category summary values
  const categorySpends = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = filteredTransactions
      .filter(t => t.type === "expense" && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return acc;
  }, {} as Record<Category, number>);

  // Helper validation for budget exceed thresholds
  const getCategoryProgress = (category: Category) => {
    const spent = categorySpends[category] || 0;
    const limitObj = budgets.find(b => b.category === category);
    const limit = limitObj ? limitObj.limit : 0;
    if (limit === 0) return { progress: 0, percentage: 0 };
    const progress = spent / limit;
    return {
      progress,
      percentage: Math.round(progress * 100),
      limit,
      spent
    };
  };

  // Compile deep certified accounting balance ledger reports
  const generateAccountingReport = () => {
    const formattedDate = getDailyLabel(accountingDate);
    const modeName = 
      accountingMode === "daily" ? "Daily Ledger Closure" :
      accountingMode === "weekly" ? "Weekly Account Review" :
      accountingMode === "monthly" ? "Monthly Closing Statement" : "Absolute Ledger Audit";

    let rangeDetails = "";
    if (accountingMode === "daily") {
      rangeDetails = `Observed Date: ${formattedDate} (${accountingDate})`;
    } else if (accountingMode === "weekly") {
      const { startStr, endStr } = getWeeklyBoundaries(accountingDate);
      rangeDetails = `Calendar Week: ${startStr} to ${endStr}`;
    } else if (accountingMode === "monthly") {
      const { label } = getMonthlyBoundaries(accountingDate);
      rangeDetails = `Statement Period: ${label}`;
    } else {
      rangeDetails = "Aegis Master Historical Database Balance Sheet";
    }

    const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) + "%" : "0.0%";

    const reportLines = [
      `======================================================`,
      `           OFFICIAL ACCOUNTING LEDGER REPORT          `,
      `======================================================`,
      `  Generated At        : ${new Date().toLocaleString()}`,
      `  Accounting Paradigm : ${modeName}`,
      `  Timeframe Context   : ${rangeDetails}`,
      `  Preferred Currency  : ${activeCurrency.name} (${activeCurrency.code})`,
      `  Auditor Certification: BALANCED & VERIFIED`,
      `------------------------------------------------------`,
      `  FINANCIAL SUMMARY:`,
      `    Aggregated Influx Deposits  : ${formatAmount(totalIncome)}`,
      `    Aggregated Outflux Spends   : ${formatAmount(totalExpense)}`,
      `    Computed Liquid Savings     : ${formatAmount(netBalance)}`,
      `    Derived Profit/Saving Rate  : ${savingsRate}`,
      `------------------------------------------------------`,
      `  BUDGET EXPENDITURE BY CATEGORY:`,
    ];

    CATEGORIES.forEach(cat => {
      const spent = categorySpends[cat] || 0;
      const budgetLimit = budgets.find(b => b.category === cat)?.limit || 0;
      const pct = budgetLimit > 0 ? ((spent / budgetLimit) * 100).toFixed(0) : "0";
      reportLines.push(`    - ${cat.padEnd(14)}: Spent ${formatAmount(spent, 2)} / Budget limit ${formatAmount(budgetLimit, 0)} (${pct}%)`);
    });

    reportLines.push(`------------------------------------------------------`);
    reportLines.push(`  RECORD JOURNAL (${filteredTransactions.length} items verified):`);
    if (filteredTransactions.length === 0) {
      reportLines.push(`    [No transaction logs matched in active accounting session]`);
    } else {
      filteredTransactions.forEach((tx, idx) => {
        const entryNo = String(idx + 1).padStart(2, "0");
        const paddedType = tx.type.toUpperCase().padEnd(7);
        const paddedCat = tx.category.padEnd(12);
        const formattedAmt = formatAmount(tx.amount).padEnd(10);
        reportLines.push(`    [${entryNo}] ${tx.date} | ${paddedType} | ${paddedCat} | ${formattedAmt} | Memo: ${tx.note}`);
      });
    }
    reportLines.push(`======================================================`);
    reportLines.push(`  LEDGER STATUS INDEX: SEALED & CONCLUDED`);
    reportLines.push(`======================================================`);

    return reportLines.join("\n");
  };

  // Add transactional log
  const handleAddTransaction = (e: FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountInput);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert(MESSAGES_DICT[language].alertGenuineAmount);
      return;
    }

    const newTx: Transaction = {
      id: "tx-" + Date.now(),
      type: typeInput,
      category: categoryInput,
      amount: parsedAmount,
      date: dateInput || new Date().toISOString().split("T")[0],
      note: noteInput.trim() || `${CATEGORY_TRANSLATIONS[categoryInput][language]} Entry`
    };

    setTransactions(prev => [newTx, ...prev]);
    setAmountInput("");
    setNoteInput("");
  };

  // Delete transaction logic
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Handle budget slider updates
  const handleUpdateBudget = (category: Category, newLimit: number) => {
    setBudgets(prev => prev.map(b => b.category === category ? { ...b, limit: newLimit } : b));
  };

  // Fetch AI deep ledger pattern analysis
  const handleTriggerAnalysis = async () => {
    setAiAnalysisLoading(true);
    try {
      const response = await fetch("/api/ai/analyze-spending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions, budgets, language })
      });
      const data = await response.json();
      setAiAnalysis(data);
    } catch (err) {
      console.error(err);
      setAiAnalysis({
        unusualExpenses: language === "ar"
          ? "حدث عطل في الاتصال. مراجعة محلية افتراضية: انتبه لمصروفات الطعام والشراب والتسوق حيث تأخذ النصيب الأكبر."
          : "Connection error. Simulated fallback: Watch out for food & dining which takes up high budget ratios.",
        predictions: language === "ar"
          ? "معدل الإنفاق الحالي قد يؤدي إلى تجاوز ميزانية الفواتير إذا استمرت وتيرة الصرف الحالية دون تعديل."
          : "Run-rate suggests potential breach on bills if spending frequency remains static.",
        savingRecommendations: language === "ar"
          ? "حاول إعطاء الأولوية للادخار التلقائي، واقصر حد الإنفاق في فئة التسوق بمعدل غير متكرر."
          : "Try prioritizing automated saving accounts and setting a tighter Shopping threshold."
      });
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  // Chat with AI Assistant
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || userInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customMessage) setUserInput("");
    setAiLoading(true);

    try {
      // Keep only last 6 messages as summary context
      const chatHistoryForAPI = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistoryForAPI,
          transactions,
          budgets,
          language
        })
      });
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: "msg-reply-" + Date.now(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: "msg-err-" + Date.now(),
        role: "assistant",
        content: language === "ar"
          ? "أواجه حالياً مشكلة بسيطة في الاتصال بالشبكة. نصيحة افتراضية سريعة: فئة التسوق تسجل النسبة الأكبر بدفترك المالي ($189.90). للتوفير، حاول تأجيل المشتريات غير الضرورية لمدة 48 ساعة."
          : "I ran into a small connectivity hurdle. Direct local simulation tip: Based on your categories, your largest spending slice is Shopping ($189.90). To save, try deferring discretionary shopping items by 48 hours before purchasing.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setAiLoading(false);
    }
  };

  // Helper copy to clipboard
  const handleCopyCode = () => {
    if (selectedFile?.fileContent) {
      navigator.clipboard.writeText(selectedFile.fileContent);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    }
  };

  // Recursive folder node renderer
  const renderFileTreeNode = (node: FolderNode, depth: number = 0) => {
    const isFolder = node.type === "folder";
    const pathKey = node.path || node.name;
    const isExpanded = expandedFolders[pathKey] ?? false;

    const toggleFolder = () => {
      setExpandedFolders(prev => ({
        ...prev,
        [pathKey]: !isExpanded
      }));
    };

    return (
      <div key={pathKey} className="select-none">
        <div 
          className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
            selectedFile?.path === node.path && !isFolder 
              ? (theme === "dark" ? "bg-indigo-950/60 text-indigo-300 font-semibold" : "bg-blue-50 text-blue-700 font-semibold") 
              : (theme === "dark" ? "hover:bg-slate-800 text-slate-350" : "hover:bg-slate-100 text-slate-700")
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          onClick={() => {
            if (isFolder) {
              toggleFolder();
            } else {
              setSelectedFile(node);
            }
          }}
        >
          {isFolder ? (
            <span className={theme === "dark" ? "text-slate-400" : "text-slate-400"}>
              {isExpanded ? <FolderOpen size={16} className={theme === "dark" ? "text-indigo-400" : "text-blue-500"} /> : <Folder size={16} />}
            </span>
          ) : (
            <span className={theme === "dark" ? "text-slate-450" : "text-slate-400"}>
              <FileText size={15} />
            </span>
          )}
          <span className="text-sm truncate">{node.name}</span>
          {isFolder && (
            <ChevronRight 
              size={12} 
              className={`ml-auto text-slate-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} 
            />
          )}
        </div>
        
        {isFolder && isExpanded && node.children && (
          <div className="mt-0.5">
            {node.children.map(child => renderFileTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        theme === "dark" ? "bg-[#090d16] text-slate-100" : "bg-[#F8FAFC] text-slate-950"
      }`} 
      id="smart-expense-container"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      
      {/* Premium Header Rail */}
      <header className={`sticky top-0 z-30 transition-colors duration-300 border-b px-4 py-3 ${
        theme === "dark" 
          ? "bg-[#0f172a]/95 border-slate-800/80 text-white backdrop-blur-md" 
          : "bg-white border-slate-200 text-slate-900 shadow-subtle"
      }`} id="app-header-nav">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-blue-700 to-indigo-600 text-white p-2 rounded-xl shadow-md">
              <Wallet size={22} className="animate-pulse" />
            </div>
            <div>
              <h1 className={`text-lg font-bold tracking-tight flex items-center gap-1.5 leading-none ${
                theme === "dark" ? "text-slate-50" : "text-slate-900"
              }`}>
                {MESSAGES_DICT[language].title}
                <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {MESSAGES_DICT[language].badge}
                </span>
              </h1>
              <p className={`text-xs mt-1 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{MESSAGES_DICT[language].subtitle}</p>
            </div>
          </div>

          <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-xl border transition-colors duration-300 ${
            theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"
          }`}>
            {/* Elegant Language toggle */}
            <div className={`flex flex-wrap gap-0.5 p-0.5 rounded-lg border ${
              theme === "dark" ? "bg-slate-900/50 border-slate-700" : "bg-slate-200/60 border-slate-300/30"
            }`}>
              {[
                { code: "en", label: "EN" },
                { code: "ar", label: "العربية" },
                { code: "fr", label: "FR" },
                { code: "it", label: "IT" },
                { code: "de", label: "DE" },
                { code: "es", label: "ES" }
              ].map((langItem) => (
                <button
                  key={langItem.code}
                  onClick={() => {
                    const targetLang = langItem.code as "en" | "ar" | "fr" | "it" | "de" | "es";
                    setLanguage(targetLang);
                    setMessages(prev => prev.map(m => m.id === "init" ? { ...m, content: MESSAGES_DICT[targetLang].aiInitMessage } : m));
                  }}
                  className={`px-1.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    language === langItem.code 
                      ? (theme === "dark" ? "bg-slate-700 text-white shadow-xs" : "bg-white text-slate-900 shadow-xs") 
                      : (theme === "dark" ? "text-slate-400 hover:text-slate-100" : "text-slate-500 hover:text-slate-850")
                  }`}
                  title={`${langItem.label} Language`}
                >
                  {langItem.label}
                </button>
              ))}
            </div>

            <span className={`w-[1px] h-4 ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`} />

            {/* Elegant World Currency Selector */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg">
              <span className={`text-[10px] font-bold ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                {language === "ar" ? "العملة" : "CURR"}
              </span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`text-[11px] font-black bg-transparent border-none focus:outline-none cursor-pointer transition-all ${
                  theme === "dark" ? "text-indigo-400 focus:text-indigo-300 bg-[#0f172a] select-option" : "text-indigo-700 focus:text-indigo-900 focus:bg-white"
                }`}
                style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                title="Select Base Active Currency"
                id="world-currency-dropdown"
              >
                {WORLD_CURRENCIES.map((curr) => (
                  <option 
                    key={curr.code} 
                    value={curr.code} 
                    className={theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}
                  >
                    {curr.symbol} ({curr.code})
                  </option>
                ))}
              </select>
            </div>

            <span className={`w-[1px] h-4 ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`} />

            {/* Dynamic Card Theme Selector Switcher */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                theme === "dark" 
                  ? "text-amber-400 hover:text-amber-300 hover:bg-slate-700" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
              title={theme === "light" ? MESSAGES_DICT[language].themeDarkButton : MESSAGES_DICT[language].themeLightButton}
            >
              {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            <span className={`w-[1px] h-4 ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`} />

            {/* Tab switchers */}
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "simulator" 
                  ? (theme === "dark" ? "bg-slate-700 text-white shadow-sm font-bold" : "bg-white text-slate-900 shadow-sm font-bold") 
                  : (theme === "dark" ? "text-slate-350 hover:text-white" : "text-slate-600 hover:text-slate-900")
              }`}
              id="tab-btn-sim"
            >
              <AppWindow size={14} />
              {MESSAGES_DICT[language].tabSim}
            </button>
            <button
              onClick={() => setActiveTab("flutter-explorer")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "flutter-explorer" 
                  ? (theme === "dark" ? "bg-slate-700 text-white shadow-sm font-bold" : "bg-white text-slate-900 shadow-sm font-bold") 
                  : (theme === "dark" ? "text-slate-350 hover:text-white" : "text-slate-600 hover:text-slate-900")
              }`}
              id="tab-btn-code"
            >
              <Code2 size={14} />
              {MESSAGES_DICT[language].tabCode}
            </button>
          </div>

        </div>
      </header>

      {/* Primary Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6" id="app-workspace-canvas">
        {activeTab === "simulator" ? (
          
          /* VIEW 1: FLUTTER HYDRATE SIMULATOR & INTERACTIVE DASHBOARD */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-layout-grid">
            
            {/* Corporate Accounting System Console Card */}
            <div className={`lg:col-span-12 border rounded-2xl p-6 transition-all duration-300 shadow-xs ${
              theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
            }`} id="corporate-accounting-console">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-5 border-b border-dashed border-slate-800/40">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${theme === "dark" ? "bg-indigo-950/50 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h2 className={`font-black text-sm sm:text-base tracking-tight ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                      {language === "ar" ? "نظام الإقفال والتقارير المحاسبية المعتمد" :
                       language === "fr" ? "Gestion Comptable Certifiée" :
                       language === "it" ? "Sistema Finanziario di Chiusura" :
                       language === "de" ? "Zertifiziertes Buchhaltungssystem" :
                       language === "es" ? "Consola y Balance Contable" :
                       "Daily, Weekly, & Monthly Accounting System"}
                    </h2>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      {language === "ar" ? "حدد الدورة النشطة، تصفح التواريخ يدوياً، وصدر تقارير تسوية الدفاتر." :
                       language === "fr" ? "Sélectionnez le cycle, parcourez les dates et générez des rapports de clôture." :
                       language === "it" ? "Seleziona il ciclo, naviga tra le date e genera rapporti di bilancio." :
                       language === "de" ? "Abrechnungszyklus wählen, Termine anpassen und Buchungsberichte exportieren." :
                       language === "es" ? "Selecione el ciclo contable, explore fechas y genere balances del diario." :
                       "Switch counting cycles, navigate dates chronologically, and compile dynamic reconciliation statements."}
                    </p>
                  </div>
                </div>

                {/* Date Restarter / Today shortcut */}
                {accountingMode !== "all" && (
                  <button
                    onClick={() => setAccountingDate("2026-06-17")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      theme === "dark" ? "bg-slate-800 text-slate-200 hover:bg-slate-705" : "bg-slate-150 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    🎯 {language === "ar" ? "تعديل لليوم الحالي" : "Reset to Today (June 17)"}
                  </button>
                )}
              </div>

              {/* Dynamic Accounting Switchnodes */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Switch Tabs Block */}
                <div className="lg:col-span-6 space-y-4">
                  <span className={`block text-[10px] font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                    {language === "ar" ? "تحديد دورة تجميع الدفاتر" : "Active Reconciliation Cycle"}
                  </span>

                  <div className={`grid grid-cols-4 gap-1 p-1 rounded-xl ${
                    theme === "dark" ? "bg-slate-900/60" : "bg-slate-100/80"
                  }`}>
                    {[
                      { mode: "all", label: language === "ar" ? "الكل" : "All" },
                      { mode: "daily", label: language === "ar" ? "يومي" : "Daily" },
                      { mode: "weekly", label: language === "ar" ? "أسبوعي" : "Weekly" },
                      { mode: "monthly", label: language === "ar" ? "شهري" : "Monthly" }
                    ].map((btn) => (
                      <button
                        key={btn.mode}
                        onClick={() => {
                          setAccountingMode(btn.mode as any);
                          setGeneratedReport(null); // Reset report preview on mode change
                        }}
                        className={`py-2 rounded-lg text-xs font-black tracking-tight transition-all cursor-pointer text-center ${
                          accountingMode === btn.mode
                            ? (theme === "dark" ? "bg-indigo-600/20 text-indigo-400 shadow-sm border border-indigo-500/20" : "bg-white text-indigo-700 shadow-xs border border-indigo-200")
                            : "text-slate-400 hover:text-slate-500"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Range Display & Navigators */}
                  {accountingMode !== "all" && (
                    <div className={`p-4 rounded-xl border border-dashed flex flex-col sm:flex-row items-center justify-between gap-4 ${
                      theme === "dark" ? "bg-slate-900/35 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleShiftPeriod(-1)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            theme === "dark" ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                          title="Previous period"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        
                        <div className="text-center sm:text-left">
                          <span className="block text-[9px] uppercase font-bold text-indigo-400 tracking-wider">
                            {accountingMode === "daily" ? (language === "ar" ? "الحسابات اليومية" : "Active Daily Ledger") :
                             accountingMode === "weekly" ? (language === "ar" ? "الحسابات الأسبوعية" : "Active Weekly Boundaries") :
                             (language === "ar" ? "الحسابات الشهرية" : "Active Monthly Session")}
                          </span>
                          <span className={`text-[11px] font-black block mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                            {accountingMode === "daily" ? getDailyLabel(accountingDate) :
                             accountingMode === "weekly" ? getWeeklyBoundaries(accountingDate).label :
                             getMonthlyBoundaries(accountingDate).label}
                          </span>
                        </div>

                        <button
                          onClick={() => handleShiftPeriod(1)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            theme === "dark" ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                          title="Next period"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      {/* Explicit Date selection input */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-mono">Date:</span>
                        <input
                          type="date"
                          value={accountingDate}
                          onChange={(e) => setAccountingDate(e.target.value)}
                          className={`text-xs p-1 px-1.5 rounded-lg font-bold font-mono border ${
                            theme === "dark"
                              ? "bg-slate-900 border-slate-700 text-indigo-300 focus:ring-1 focus:ring-indigo-500"
                              : "bg-white border-slate-300 text-slate-800"
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Informational closing message */}
                  <div className={`text-[10px] sm:text-[11px] leading-relaxed p-3 rounded-lg border ${
                    theme === "dark" ? "text-slate-400 bg-slate-950/20 border-slate-850" : "text-slate-600 bg-slate-100/40 border-slate-200/50"
                  }`}>
                    💡 <span className="font-semibold">{language === "ar" ? "مزامنة النشاط:" : "Dynamic Scope Alignment:"}</span>{" "}
                    {language === "ar" ? "عند تصفح أي دورة فوقية، رصيد الحسابات ومؤشرات الميزانية والرسم البياني للتجميع تتزامن تلقائياً." :
                     "All cards, budget warn thresholds, and capital distribution charts adapt instantly to match the observed timeframe."}
                  </div>
                </div>

                {/* Sub-indicator report KPIs & closing actions */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className={`block text-[10px] font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                      {language === "ar" ? "مؤشرات الدورة والسيولة" : "Timeframe Velocity Calculations"}
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-3 rounded-xl border ${theme === "dark" ? "bg-slate-900/40 border-slate-850" : "bg-slate-50 border-slate-200"}`}>
                        <span className="text-[9px] text-slate-400 block font-bold mb-1 uppercase tracking-widest">
                          {language === "ar" ? "معدل الادخار للفترة" : "Period Saving Ratio"}
                        </span>
                        <span className={`text-[13px] font-black ${netBalance >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                          {totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) + "%" : "0.0%"}
                        </span>
                      </div>
                      
                      <div className={`p-3 rounded-xl border ${theme === "dark" ? "bg-slate-900/40 border-slate-850" : "bg-slate-50 border-slate-200"}`}>
                        <span className="text-[9px] text-slate-400 block font-bold mb-1 uppercase tracking-widest">
                          {language === "ar" ? "متوسط الاستهلاك اليومي" : "Daily Burn Rate"}
                        </span>
                        <span className="text-[13px] font-black text-amber-500">
                          {formatAmount(accountingMode === "daily" ? totalExpense :
                           accountingMode === "weekly" ? totalExpense / 7 :
                           accountingMode === "monthly" ? totalExpense / 30 : 
                           totalExpense / 30, 2)}
                        </span>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border border-dashed flex items-center justify-between ${
                      theme === "dark" ? "bg-indigo-950/20 border-indigo-500/20 text-indigo-300" : "bg-indigo-50/60 border-indigo-200 text-indigo-700"
                    }`}>
                      <div className="flex items-center gap-2">
                        <FileText size={14} />
                        <span className="text-xs font-semibold">
                          {filteredTransactions.length} {language === "ar" ? "معاملات تحت الاحتساب" : "Log entries audited currently"}
                        </span>
                      </div>
                      <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-400/20 font-mono">
                        {language === "ar" ? "معتمد" : "Locked"}
                      </span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGeneratedReport(generateAccountingReport())}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      🧾 {language === "ar" ? "مراجعة وإغلاق تقرير الميزانية" : "Generate Balance Report"}
                    </button>
                    {generatedReport && (
                      <button
                        onClick={() => {
                          setGeneratedReport(null);
                        }}
                        className={`p-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          theme === "dark" ? "border-slate-700 text-slate-350 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        Reset
                      </button>
                    )}
                  </div>

                </div>

              </div>

              {/* Generated Textual Audit Closing Report Panel */}
              {generatedReport && (
                <div className="mt-5 pt-5 border-t border-slate-800/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {language === "ar" ? "بيان تسوية الدفاتر المالي المعتمد" : "CERTIFIED BALANCE RECONCILIATION DOCUMENT"}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedReport);
                        setCopiedReport(true);
                        setTimeout(() => setCopiedReport(false), 2500);
                      }}
                      className={`text-[9px] font-bold tracking-wider uppercase p-1.5 px-3 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        copiedReport 
                          ? "bg-emerald-500 text-white font-bold" 
                          : (theme === "dark" ? "bg-slate-800 hover:bg-slate-700 text-indigo-400" : "bg-slate-100 hover:bg-slate-200 text-indigo-700")
                      }`}
                    >
                      {copiedReport ? <Check size={11} /> : <Copy size={11} />}
                      {copiedReport ? MESSAGES_DICT[language].copiedText : (language === "ar" ? "نسخ السجل" : "COPY REPORT")}
                    </button>
                  </div>

                  <div className="relative">
                    <pre className={`text-[10px] sm:text-[11px] leading-relaxed p-4 rounded-xl font-mono overflow-x-auto whitespace-pre border border-dashed text-left ${
                      theme === "dark"
                        ? "bg-[#0b0f19] border-slate-800/80 text-emerald-400"
                        : "bg-slate-50 border-slate-300/80 text-emerald-950 shadow-inner"
                    }`} style={{ direction: "ltr" }}>
                      {generatedReport}
                    </pre>
                    <div className={`absolute bottom-3 right-3 text-[8px] uppercase font-bold tracking-widest select-none pointer-events-none opacity-40 font-sans ${
                      theme === "dark" ? "text-slate-500" : "text-slate-400"
                    }`}>
                      LEGER VERIFICATION SEAL
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Top Stat Banner (Whole 12 Columns width) */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-banner-row">
              
              <div className={`border rounded-2xl p-5 flex items-center justify-between transition-colors duration-300 shadow-xs ${
                theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className="space-y-1">
                  <p className={`text-xs font-semibold uppercase tracking-widest ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{MESSAGES_DICT[language].netBalance}</p>
                  <p className={`text-2xl font-black ${netBalance >= 0 ? "text-emerald-500" : "text-rose-500"}`} id="liquid-val-total">
                    {formatAmount(netBalance)}
                  </p>
                  <p className="text-[11px] text-slate-400">{MESSAGES_DICT[language].verifiedWealth}</p>
                </div>
                <div className={`p-3 rounded-2xl ${theme === "dark" ? "bg-emerald-950/40 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                  <Coins size={24} />
                </div>
              </div>

              <div className={`border rounded-2xl p-5 flex items-center justify-between transition-colors duration-300 shadow-xs ${
                theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className="space-y-1">
                  <p className={`text-xs font-semibold uppercase tracking-widest ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{MESSAGES_DICT[language].totalIncome}</p>
                  <p className={`text-2xl font-black ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`} id="income-val-total">
                    {formatAmount(totalIncome)}
                  </p>
                  <p className="text-[11px] text-emerald-500 font-medium">{MESSAGES_DICT[language].verifiedDeposits}</p>
                </div>
                <div className={`p-3 rounded-2xl ${theme === "dark" ? "bg-blue-950/40 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                  <TrendingUp size={24} />
                </div>
              </div>

              <div className={`border rounded-2xl p-5 flex items-center justify-between transition-colors duration-300 shadow-xs ${
                theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className="space-y-1">
                  <p className={`text-xs font-semibold uppercase tracking-widest ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{MESSAGES_DICT[language].totalExpense}</p>
                  <p className={`text-2xl font-black ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`} id="expense-val-total">
                    {formatAmount(totalExpense)}
                  </p>
                  <p className="text-[11px] text-rose-400 font-medium">{MESSAGES_DICT[language].categoryExpenditures}</p>
                </div>
                <div className={`p-3 rounded-2xl ${theme === "dark" ? "bg-rose-950/40 text-rose-400" : "bg-rose-50 text-rose-600"}`}>
                  <TrendingDown size={24} />
                </div>
              </div>

              {/* Maximum Consumption Limit & Safety Card with interactive controls */}
              <div className={`border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xs relative overflow-hidden ${
                totalExpense > maxConsumptionLimit
                  ? (theme === "dark" 
                      ? "bg-rose-950/20 border-rose-900/40 text-rose-100" 
                      : "bg-rose-50 border-rose-200 text-rose-900")
                  : (theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200")
              }`} id="max-consumption-limit-card">
                {totalExpense > maxConsumptionLimit && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full filter blur-xl pointer-events-none" />
                )}

                <div className="space-y-1.5 z-10">
                  <p className={`text-xs font-semibold uppercase tracking-widest ${
                    totalExpense > maxConsumptionLimit 
                      ? "text-rose-400" 
                      : (theme === "dark" ? "text-slate-400" : "text-slate-500")
                  }`}>
                    {language === "ar" ? "حد الاستهلاك الأقصى" :
                     language === "fr" ? "LIMITE COMBINÉE MAX" :
                     language === "it" ? "LIMITE DI CONSUMO MAX" :
                     language === "de" ? "KONSUMGRENZE" :
                     language === "es" ? "LÍMITE DE CONSUMO MÁX" :
                     "MAX CONSUMPTION LIMIT"}
                  </p>
                  
                  <div className="flex items-baseline justify-between gap-1.5">
                    <span className={`text-2xl font-black ${
                      totalExpense > maxConsumptionLimit
                        ? "text-rose-500"
                        : (theme === "dark" ? "text-indigo-400" : "text-indigo-600")
                    }`}>
                      {formatAmount(maxConsumptionLimit)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold font-mono">
                      ({((totalExpense / (maxConsumptionLimit || 1)) * 100).toFixed(0)}%)
                    </span>
                  </div>

                  {totalExpense > maxConsumptionLimit ? (
                    <p className="text-[10px] sm:text-[11px] font-black text-rose-500 flex items-center gap-1 animate-pulse">
                      <span>⚠️ {language === "ar" ? "تجاوزت الحد الأقصى للمعدل!" : "LIMIT EXCEEDED !"}</span>
                    </p>
                  ) : (
                    <p className={`text-[10px] sm:text-[11px] font-bold ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"} flex items-center gap-1`}>
                      <span>✓ {language === "ar" ? "ضمن الاستهلاك المسموح" : "Safe & Under Budget"}</span>
                    </p>
                  )}
                </div>

                {/* Slider and direct settings for Maximum Consumption Limit */}
                <div className="mt-3 pt-3 border-t border-slate-850/40 flex flex-col gap-2 z-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      {language === "ar" ? "تعديل الحد الأقصى:" : "Set Limit:"}
                    </span>
                    
                    <div className="flex items-center gap-1 bg-slate-900/60 p-0.5 px-1 rounded">
                      <input
                        type="number"
                        min="10"
                        max="50000"
                        step="50"
                        value={maxConsumptionLimit}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) setMaxConsumptionLimit(val);
                        }}
                        className="w-12 bg-transparent text-center font-bold text-[10px] text-indigo-400 focus:outline-none focus:ring-0 select-all border-none p-0"
                      />
                      <span className="text-[8px] text-slate-400 font-mono font-bold">{activeCurrency.code}</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={maxConsumptionLimit}
                    onChange={(e) => setMaxConsumptionLimit(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 h-1 cursor-pointer bg-slate-800 rounded-lg appearance-none"
                    style={{ background: "#4B5563" }}
                    title="Slide to change max consumption limit"
                  />
                  
                  {/* Quick Preset Buttons */}
                  <div className="flex gap-1 justify-between">
                    {[1000, 2500, 5000, 10000].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setMaxConsumptionLimit(preset)}
                        className={`text-[8px] px-1 py-0.5 rounded font-mono transition-all text-slate-400 hover:text-slate-200 hover:bg-slate-850 border ${
                          maxConsumptionLimit === preset
                            ? "border-indigo-500 text-indigo-400 bg-indigo-500/10 font-bold"
                            : "border-slate-800"
                        }`}
                      >
                        {preset / 1000}k
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Interactive Graphs with Arrows */}
            {(() => {
              // Calculate weekly data
              const weeks_data = [
                { name: "Week 1", start: "2026-06-01", end: "2026-06-07", income: 1000, expense: 165 },
                { name: "Week 2", start: "2026-06-08", end: "2026-06-14", income: 1200, expense: 322 },
                { name: "Week 3", start: "2026-06-15", end: "2026-06-21", income: 1500, expense: 85 },
                { name: "Week 4", start: "2026-06-22", end: "2026-06-30", income: 1100, expense: 0 }
              ];

              filteredTransactions.forEach(tx => {
                const txDate = tx.date;
                const amount = tx.amount;
                const isIncome = tx.type === "income";

                for (let i = 0; i < weeks_data.length; i++) {
                  if (txDate >= weeks_data[i].start && txDate <= weeks_data[i].end) {
                    if (isIncome) {
                      weeks_data[i].income += amount;
                    } else {
                      weeks_data[i].expense += amount;
                    }
                    break;
                  }
                }
              });

              // Precalculate max value to scale trend graph correctly
              const maxVal = Math.max(500, ...weeks_data.map(w => Math.max(w.income, w.expense)));
              
              // Coordinates for Trend Line Nodes
              const trendX = [60, 165, 270, 375];
              const getY = (val: number) => 180 - (val / maxVal) * 120; // values scaled from Y=60 to Y=180

              const binSpends = {
                food: categorySpends.Food || 0,
                bills: categorySpends.Bills || 0,
                shopping: (categorySpends.Shopping || 0) + (categorySpends.Entertainment || 0),
                transport: categorySpends.Transport || 0,
                other: (categorySpends.Health || 0) + (categorySpends.Education || 0) + (categorySpends.Other || 0)
              };

              return (
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6" id="graphs-with-arrows-section">
                  
                  {/* Style block for micro-animated cash flows and pulses */}
                  <style>{`
                    @keyframes flowDash {
                      to {
                        stroke-dashoffset: -24;
                      }
                    }
                    .animate-flow-dash-green {
                      stroke-dasharray: 6, 6;
                      animation: flowDash 1s linear infinite;
                      stroke: #10B981;
                    }
                    .animate-flow-dash-red {
                      stroke-dasharray: 6, 6;
                      animation: flowDash 1.2s linear infinite;
                      stroke: #EF4444;
                    }
                    .animate-flow-dash-indigo {
                      stroke-dasharray: 6, 6;
                      animation: flowDash 1.4s linear infinite;
                      stroke: #6366F1;
                    }
                    @keyframes pulseRing {
                      0%, 100% { transform: scale(1); opacity: 0.2; }
                      50% { transform: scale(1.15); opacity: 0.6; }
                    }
                    .animate-pulse-ring {
                      animation: pulseRing 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                  `}</style>

                  {/* Graph 1: Live Capital Flow Map */}
                  <div className={`border rounded-2xl p-5 shadow-xs transition-all duration-300 ${
                    theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-emerald-950/40 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                          <ArrowRightLeft size={16} />
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                            {MESSAGES_DICT[language].cashFlowMap}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {MESSAGES_DICT[language].cashFlowMapDesc}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative w-full overflow-x-auto select-none" style={{ minWidth: "360px" }}>
                      <svg className="w-full h-auto min-h-[220px]" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10B981" />
                          </marker>
                          <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#EF4444" />
                          </marker>
                          <marker id="arrow-indigo" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#6366F1" />
                          </marker>
                          <marker id="arrow-grey" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94A3B8" />
                          </marker>
                          
                          <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                          <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* FLOW LINKS (ARROWS) */}
                        <path 
                          d="M 80 110 L 205 110" 
                          stroke={theme === "dark" ? "#1E293B" : "#E2E8F0"} 
                          strokeWidth="8" 
                          strokeLinecap="round" 
                        />
                        <path 
                          d="M 80 110 L 195 110" 
                          stroke="#10B981" 
                          strokeWidth="3" 
                          strokeLinecap="round"
                          markerEnd="url(#arrow-green)"
                          className="animate-flow-dash-green opacity-95"
                          style={{ filter: "url(#glow-green)" }}
                        />

                        {(() => {
                          const catBins = [
                            { key: "food", val: binSpends.food, y: 30, color: "#3B82F6", label: language === "ar" ? "الطعام" : "Food" },
                            { key: "bills", val: binSpends.bills, y: 70, color: "#EF4444", label: language === "ar" ? "الفواتير" : "Bills" },
                            { key: "shopping", val: binSpends.shopping, y: 110, color: "#F59E0B", label: language === "ar" ? "التسوق" : "Shopping" },
                            { key: "transport", val: binSpends.transport, y: 150, color: "#10B981", label: language === "ar" ? "المواصلات" : "Transport" },
                            { key: "other", val: binSpends.other, y: 190, color: "#8B5CF6", label: language === "ar" ? "الأخرى" : "Others" }
                          ];

                          return catBins.map((bin) => {
                            const isHovered = hoveredSankeyNode === bin.key;
                            const spent = bin.val;
                            const isZeroType = spent === 0;
                            const strokeColor = isZeroType ? (theme === "dark" ? "#334155" : "#CBD5E1") : bin.color;
                            
                            const pathData = `M 270 110 C 330 110 340 ${bin.y} 405 ${bin.y}`;

                            return (
                              <g key={bin.key}>
                                <path 
                                  d={pathData} 
                                  stroke={strokeColor} 
                                  strokeWidth={isHovered ? "5" : "2"} 
                                  opacity={isZeroType ? 0.3 : (isHovered ? 0.9 : 0.55)}
                                  strokeLinecap="round" 
                                  markerEnd={isZeroType ? "url(#arrow-grey)" : `url(#arrow-indigo)`}
                                  className="transition-all duration-300"
                                />
                                {!isZeroType && (
                                  <path 
                                    d={pathData} 
                                    stroke={bin.color} 
                                    strokeWidth="2" 
                                    opacity={isHovered ? 1 : 0.7}
                                    strokeLinecap="round"
                                    className="animate-flow-dash-indigo"
                                  />
                                )}
                              </g>
                            );
                          });
                        })()}

                        {/* NODES */}
                        <g 
                          className="cursor-pointer group" 
                          onMouseEnter={() => setHoveredSankeyNode("deposits")}
                          onMouseLeave={() => setHoveredSankeyNode(null)}
                        >
                          <circle cx="50" cy="110" r="32" fill={theme === "dark" ? "#064E3B" : "#D1FAE5"} className="transition-all group-hover:scale-105 duration-300" stroke="#10B981" strokeWidth="2.5" />
                          <circle cx="50" cy="110" r="26" fill={theme === "dark" ? "#022C22" : "#A7F3D0"} />
                          <text x="50" y="103" textAnchor="middle" fill="#10B981" className="text-[10px] font-black tracking-wider uppercase">Inflow</text>
                          <text x="50" y="119" textAnchor="middle" fill={theme === "dark" ? "#F0FDF4" : "#065F46"} className="text-xs font-black">{formatAmount(totalIncome, 0)}</text>
                        </g>

                        <g 
                          className="cursor-pointer group"
                          onMouseEnter={() => setHoveredSankeyNode("wallet")}
                          onMouseLeave={() => setHoveredSankeyNode(null)}
                        >
                          <circle cx="237" cy="110" r="42" fill="transparent" stroke="#6366F1" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse opacity-40" />
                          <circle cx="237" cy="110" r="34" fill={theme === "dark" ? "#1E1E38" : "#EEF2FF"} stroke="#6366F1" strokeWidth="3" className="transition-all group-hover:scale-105 duration-300" />
                          <text x="237" y="102" textAnchor="middle" fill="#6366F1" className="text-[10px] font-black tracking-wider uppercase">Wallet</text>
                          <text x="237" y="120" textAnchor="middle" fill={netBalance >= 0 ? "#10B981" : "#EF4444"} className="text-xs font-black">{formatAmount(netBalance, 0)}</text>
                        </g>

                        {(() => {
                          const catBins = [
                            { key: "food", val: binSpends.food, y: 30, color: "#3B82F6", label: language === "ar" ? "طعام" : "Food", emoji: "🍔" },
                            { key: "bills", val: binSpends.bills, y: 70, color: "#EF4444", label: language === "ar" ? "فواتير" : "Bills", emoji: "⚡" },
                            { key: "shopping", val: binSpends.shopping, y: 110, color: "#F59E0B", label: language === "ar" ? "تسوق" : "Shopping", emoji: "🛍️" },
                            { key: "transport", val: binSpends.transport, y: 150, color: "#10B981", label: language === "ar" ? "نقل" : "Transport", emoji: "🚗" },
                            { key: "other", val: binSpends.other, y: 190, color: "#8B5CF6", label: language === "ar" ? "أخرى" : "Others", emoji: "✨" }
                          ];

                          return catBins.map((bin) => {
                            const isHovered = hoveredSankeyNode === bin.key;
                            const spent = bin.val;
                            const isZeroType = spent === 0;

                            return (
                              <g 
                                key={bin.key}
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredSankeyNode(bin.key)}
                                onMouseLeave={() => setHoveredSankeyNode(null)}
                              >
                                <circle 
                                  cx="430" 
                                  cy={bin.y} 
                                  r={isHovered ? "18" : "15"} 
                                  fill={theme === "dark" ? "#1E293B" : "#F1F5F9"} 
                                  stroke={isZeroType ? (theme === "dark" ? "#475569" : "#CBD5E1") : bin.color} 
                                  strokeWidth={isHovered ? "2.5" : "1.5"}
                                  className="transition-all duration-200"
                                />
                                <text x="430" y={bin.y + 4} textAnchor="middle" className="text-[12px]">{bin.emoji}</text>

                                <text 
                                  className="text-[10px] font-bold"
                                  x={language === "ar" ? "398" : "455"} 
                                  y={bin.y - 2}
                                  textAnchor={language === "ar" ? "end" : "start"}
                                  fill={theme === "dark" ? (isHovered ? "#FFFFFF" : "#94A3B8") : (isHovered ? "#0F172A" : "#475569")}
                                >
                                  {bin.label}
                                </text>
                                <text 
                                  className="text-[9px] font-black font-mono"
                                  x={language === "ar" ? "398" : "455"} 
                                  y={bin.y + 9}
                                  textAnchor={language === "ar" ? "end" : "start"}
                                  fill={isZeroType ? "#94A3B8" : bin.color}
                                >
                                  {formatAmount(spent, 0)}
                                </text>
                              </g>
                            );
                          });
                        })()}
                      </svg>
                    </div>
                  </div>

                  {/* Graph 2: Analytics Trend Coordinate Plane */}
                  <div className={`border rounded-2xl p-5 shadow-xs transition-all duration-300 ${
                    theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-indigo-950/40 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                          <Sliders size={16} />
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                            {MESSAGES_DICT[language].weeklyTrend}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {MESSAGES_DICT[language].weeklyTrendDesc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] font-bold leading-none">
                        <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Inflow
                        </span>
                        <span className="flex items-center gap-1 text-rose-500 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-rose-500" /> Outflow
                        </span>
                      </div>
                    </div>

                    <div className="relative w-full overflow-x-auto select-none" style={{ minWidth: "360px" }}>
                      <svg className="w-full h-auto min-h-[220px]" viewBox="0 0 440 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="50" y1="180" x2="400" y2="180" stroke={theme === "dark" ? "#1E293B" : "#F1F5F9"} strokeWidth="1" />
                        <line x1="50" y1="120" x2="400" y2="120" stroke={theme === "dark" ? "#1E293B" : "#F1F5F9"} strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="50" y1="60" x2="400" y2="60" stroke={theme === "dark" ? "#1E293B" : "#F1F5F9"} strokeWidth="1" strokeDasharray="3 3" />
                        
                        <text x="40" y="183" textAnchor="end" className="text-[8px] font-bold font-mono fill-slate-400">{formatAmount(0, 0)}</text>
                        <text x="40" y="123" textAnchor="end" className="text-[8px] font-bold font-mono fill-slate-400">{formatAmount(Math.round(maxVal / 2), 0)}</text>
                        <text x="40" y="63" textAnchor="end" className="text-[8px] font-bold font-mono fill-slate-400">{formatAmount(Math.round(maxVal), 0)}</text>

                        {(() => {
                          const pW1 = `M ${trendX[0]} ${getY(weeks_data[0].income)}`;
                          const pW2 = ` L ${trendX[1]} ${getY(weeks_data[1].income)}`;
                          const pW3 = ` L ${trendX[2]} ${getY(weeks_data[2].income)}`;
                          const pW4 = ` L ${trendX[3]} ${getY(weeks_data[3].income)}`;
                          
                          const fillPath = `${pW1}${pW2}${pW3}${pW4} L 375 180 L 60 180 Z`;

                          return (
                            <g>
                              <path d={fillPath} fill="url(#grad-inflow)" opacity={theme === "dark" ? 0.08 : 0.15} />
                              <path 
                                d={`${pW1}${pW2}${pW3}${pW4}`} 
                                stroke="#10B981" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                              />
                            </g>
                          );
                        })()}

                        {(() => {
                          const pW1 = `M ${trendX[0]} ${getY(weeks_data[0].expense)}`;
                          const pW2 = ` L ${trendX[1]} ${getY(weeks_data[1].expense)}`;
                          const pW3 = ` L ${trendX[2]} ${getY(weeks_data[2].expense)}`;
                          const pW4 = ` L ${trendX[3]} ${getY(weeks_data[3].expense)}`;
                          
                          const fillPath = `${pW1}${pW2}${pW3}${pW4} L 375 180 L 60 180 Z`;

                          return (
                            <g>
                              <path d={fillPath} fill="url(#grad-outflow)" opacity={theme === "dark" ? 0.08 : 0.12} />
                              <path 
                                d={`${pW1}${pW2}${pW3}${pW4}`} 
                                stroke="#EF4444" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                              />
                            </g>
                          );
                        })()}

                        <defs>
                          <linearGradient id="grad-inflow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="grad-outflow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" />
                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {weeks_data.map((wd, index) => {
                          const x = trendX[index];
                          const yIn = getY(wd.income);
                          const yOut = getY(wd.expense);

                          const prevW = index > 0 ? weeks_data[index - 1] : null;

                          return (
                            <g key={index}>
                              <circle 
                                cx={x} 
                                cy={yIn} 
                                r="5.5" 
                                fill={theme === "dark" ? "#064E3B" : "#D1FAE5"} 
                                stroke="#10B981" 
                                strokeWidth="2.5" 
                                className="cursor-pointer transition-all duration-150 hover:scale-125"
                                onMouseEnter={() => setHoveredTrendNode({ weekIndex: index, type: "inflow" })}
                                onMouseLeave={() => setHoveredTrendNode(null)}
                              />
                              
                              <circle 
                                cx={x} 
                                cy={yOut} 
                                r="5.5" 
                                fill={theme === "dark" ? "#991B1B" : "#FEE2E2"} 
                                stroke="#EF4444" 
                                strokeWidth="2.5" 
                                className="cursor-pointer transition-all duration-150 hover:scale-125"
                                onMouseEnter={() => setHoveredTrendNode({ weekIndex: index, type: "outflow" })}
                                onMouseLeave={() => setHoveredTrendNode(null)}
                              />

                              {prevW && (() => {
                                const expDelta = wd.expense - prevW.expense;
                                const isExpUp = expDelta > 0;
                                const expPct = prevW.expense > 0 ? Math.round((Math.abs(expDelta) / prevW.expense) * 100) : 100;

                                return (
                                  <g>
                                    {expDelta !== 0 && (
                                      <g transform={`translate(${x - 4}, ${yOut - (isExpUp ? 18 : -10)})`}>
                                        <g className="animate-bounce" style={{ animationDuration: "3.5s" }}>
                                          {isExpUp ? (
                                            <g>
                                              <path d="M 1 7 L 7 1 M 7 1 L 3 1 M 7 1 L 7 5" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                              <text x="11" y="5" fill="#EF4444" className="text-[8px] font-black pointer-events-none">+{expPct}%</text>
                                            </g>
                                          ) : (
                                            <g>
                                              <path d="M 1 1 L 7 7 M 7 7 L 3 7 M 7 7 L 7 3" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                              <text x="11" y="8" fill="#10B981" className="text-[8px] font-black pointer-events-none">-{expPct}%</text>
                                            </g>
                                          )}
                                        </g>
                                      </g>
                                    )}
                                  </g>
                                );
                              })()}

                              <text x={x} y="200" textAnchor="middle" className={`text-[10px] font-black ${theme === "dark" ? "fill-slate-400" : "fill-slate-500"}`}>{wd.name}</text>
                            </g>
                          );
                        })}

                        {hoveredTrendNode && (() => {
                          const targetWeek = weeks_data[hoveredTrendNode.weekIndex];
                          const x = trendX[hoveredTrendNode.weekIndex];
                          const isInflowHover = hoveredTrendNode.type === "inflow";
                          const y = getY(isInflowHover ? targetWeek.income : targetWeek.expense);
                          const value = isInflowHover ? targetWeek.income : targetWeek.expense;

                          return (
                            <g transform={`translate(${x - 45}, ${y - 38})`}>
                              <rect width="90" height="26" rx="6" fill={theme === "dark" ? "#1E293B" : "#0F172A"} stroke={isInflowHover ? "#10B981" : "#EF4444"} strokeWidth="1.5" />
                              <text x="45" y="10" textAnchor="middle" fill="#94A3B8" className="text-[7.5px] font-bold uppercase tracking-wider">
                                {isInflowHover ? "Weekly Inflow" : "Weekly Outflow"}
                              </text>
                              <text x="45" y="20" textAnchor="middle" fill="#FFFFFF" className="text-[10px] font-black font-mono">
                                {formatAmount(value, 2)}
                              </text>
                            </g>
                          );
                        })()}

                      </svg>
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* Left Column: Transaction logger & logs list (7 Columns) */}
            <div className="lg:col-span-7 space-y-6" id="transactions-primary-panel">
              
              {/* Add Transaction Section */}
              <div className={`border rounded-2xl p-5 transition-colors duration-300 shadow-xs ${
                theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
              }`} id="quick-add-section">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-indigo-950/40 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                    <Plus size={16} />
                  </div>
                  <h3 className={`font-bold text-sm ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>{MESSAGES_DICT[language].addLogText}</h3>
                </div>

                <form onSubmit={handleAddTransaction} className="space-y-4">
                  
                  {/* Select Inflow/Outflow */}
                  <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl border ${
                    theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <button
                      type="button"
                      onClick={() => setTypeInput("expense")}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        typeInput === "expense" 
                          ? (theme === "dark" ? "bg-slate-800 text-rose-400 shadow-sm" : "bg-white text-slate-900 shadow-xs") 
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      💳 {MESSAGES_DICT[language].outflowSpent}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTypeInput("income")}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        typeInput === "income" 
                          ? (theme === "dark" ? "bg-slate-800 text-emerald-400 shadow-sm" : "bg-white text-emerald-600 shadow-xs") 
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      💰 {MESSAGES_DICT[language].inflowDeposit}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                        {language === "ar" ? `المبلغ (${activeCurrency.code})` :
                         language === "fr" ? `Montant (${activeCurrency.code})` :
                         language === "it" ? `Importo (${activeCurrency.code})` :
                         language === "de" ? `Betrag (${activeCurrency.code})` :
                         language === "es" ? `Monto total (${activeCurrency.code})` :
                         `Amount (${activeCurrency.code})`}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={amountInput}
                        required
                        onChange={(e) => setAmountInput(e.target.value)}
                        className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-100 focus:bg-slate-900" : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{MESSAGES_DICT[language].categoryType}</label>
                      <select
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value as Category)}
                        className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-100 focus:bg-slate-900" : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                        }`}
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat} className={theme === "dark" ? "bg-slate-800 border-none text-slate-100" : ""}>{CATEGORY_TRANSLATIONS[cat][language]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{MESSAGES_DICT[language].memoNotes}</label>
                      <input
                        type="text"
                        placeholder={language === "ar" ? "مثال: مأكولات عضوية البقالة" : "e.g. Whole Foods Organic Produce"}
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-100 focus:bg-slate-900" : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{MESSAGES_DICT[language].dateLocked}</label>
                      <input
                        type="date"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-100 focus:bg-slate-900" : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold text-xs text-white py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    {MESSAGES_DICT[language].logRecordButton}
                  </button>

                </form>
              </div>

              {/* Transactions list */}
              <div className={`border rounded-2xl p-5 transition-colors duration-300 shadow-xs ${
                theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
              }`} id="ledger-history-container">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-blue-950/40 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                      <ArrowRightLeft size={16} />
                    </div>
                    <h3 className={`font-bold text-sm ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>{MESSAGES_DICT[language].cashLedgerLogs} ({filteredTransactions.length}{accountingMode !== "all" ? ` / ${transactions.length}` : ""})</h3>
                  </div>
                  <span className="text-[11px] text-slate-400">{MESSAGES_DICT[language].trashToPurge}</span>
                </div>

                <div className={`divide-y max-h-[460px] overflow-y-auto pr-1 space-y-2 ${
                  theme === "dark" ? "divide-slate-800/60" : "divide-slate-100"
                }`}>
                  {filteredTransactions.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-sm text-slate-400 font-medium">{MESSAGES_DICT[language].noLogsPresent}</p>
                      <p className="text-xs text-slate-300 mt-1">{MESSAGES_DICT[language].populateUsingBuilder}</p>
                    </div>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const isIncome = tx.type === "income";
                      const color = CATEGORY_COLORS[tx.category] || "#6B7280";
                      
                      return (
                        <div key={tx.id} className={`flex items-center justify-between py-3.5 group px-2 rounded-xl transition-all ${
                          theme === "dark" ? "hover:bg-slate-800/40" : "hover:bg-slate-50"
                        }`}>
                          <div className="flex items-center gap-3 font-sans">
                            {/* Colorful category circle */}
                            <div 
                              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: color }}
                              title={CATEGORY_TRANSLATIONS[tx.category][language]}
                            />
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`font-bold text-sm leading-tight ${theme === "dark" ? "text-slate-200" : "text-slate-900"}`}>{tx.note}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                                  theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                                }`}>{CATEGORY_TRANSLATIONS[tx.category][language]}</span>
                              </div>
                              <span className="text-xs text-slate-400">{tx.date}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`font-extrabold text-sm ${isIncome ? "text-emerald-500" : (theme === "dark" ? "text-slate-300" : "text-slate-950")}`}>
                              {isIncome ? "+" : "-"}{formatAmount(tx.amount)}
                            </span>
                            <button
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Delete transaction record"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Category Budgets, warnings, interactive chart (5 Columns) */}
            <div className="lg:col-span-5 space-y-6" id="budgets-secondary-panel">
              
              {/* Category Budgets Slider Block with Warnings */}
              <div className={`border rounded-2xl p-5 shadow-xs transition-colors duration-300 ${
                theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
              }`} id="budget-progress-block">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-amber-950/40 text-amber-400" : "bg-amber-50 text-amber-600"}`}>
                      <Sliders size={16} />
                    </div>
                    <h3 className={`font-bold text-sm ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>{MESSAGES_DICT[language].categoryBudgets} ({budgets.length})</h3>
                  </div>
                  <span className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">{MESSAGES_DICT[language].dragSlider}</span>
                </div>

                <div className="space-y-4">
                  {budgets.map(b => {
                    const { progress, percentage, spent } = getCategoryProgress(b.category);
                    const color = CATEGORY_COLORS[b.category] || "#6B7280";
                    const isBreached = spent >= b.limit && b.limit > 0;
                    const isWarning = spent >= b.limit * 0.8 && spent < b.limit && b.limit > 0;

                    return (
                      <div key={b.category} className={`space-y-1.5 p-2 rounded-xl transition-all border ${
                        theme === "dark" ? "border-slate-800/20 hover:border-slate-800 hover:bg-slate-800/40" : "border-slate-50 hover:border-slate-100 hover:bg-slate-50"
                      }`}>
                        <div className="flex justify-between items-center text-xs">
                          <div className={`flex items-center gap-1.5 font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-850"}`}>
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                            {CATEGORY_TRANSLATIONS[b.category][language]}
                          </div>
                          <div className={`text-[11px] ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                            <span className={theme === "dark" ? "font-semibold text-slate-250" : "font-semibold text-slate-800"}>{formatAmount(spent, 0)}</span> {MESSAGES_DICT[language].ofText}
                            <span className={theme === "dark" ? "font-semibold text-slate-300" : "font-semibold text-slate-800"}> {formatAmount(b.limit, 0)}</span>
                          </div>
                        </div>

                        {/* Custom progress indicators */}
                        <div className={`w-full h-2 rounded-full overflow-hidden relative ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}>
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: isBreached ? "#EF4444" : isWarning ? "#F59E0B" : color
                            }}
                          />
                        </div>

                        {/* Interactive Budget Range Adjuster */}
                        <div className="flex items-center gap-2 pt-1 font-sans">
                          <input 
                            type="range"
                            min="0"
                            max="800"
                            step="10"
                            value={b.limit}
                            onChange={(e) => handleUpdateBudget(b.category, parseInt(e.target.value))}
                            className="flex-1 accent-indigo-600 h-1 cursor-pointer"
                          />
                          <span className="text-[10px] text-slate-400 font-mono w-14 text-right font-semibold">{formatAmount(b.limit, 0)} {MESSAGES_DICT[language].limitText}</span>
                        </div>

                        {/* Warning/Danger alerts */}
                        {isBreached && (
                          <div className={`mt-1 text-[10px] leading-tight px-2 py-1 rounded-md font-semibold flex items-center gap-1 ${
                            theme === "dark" ? "bg-red-950/40 text-red-400" : "bg-red-50 text-red-750"
                          }`}>
                            <AlertTriangle size={10} />
                            🚨 {MESSAGES_DICT[language].limitExceeded} ({MESSAGES_DICT[language].spendingAt} {percentage}%)
                          </div>
                        )}
                        {isWarning && (
                          <div className={`mt-1 text-[10px] leading-tight px-2 py-1 rounded-md font-semibold flex items-center gap-1 ${
                            theme === "dark" ? "bg-amber-950/40 text-amber-400" : "bg-amber-50 text-amber-750"
                          }`}>
                            <AlertTriangle size={10} />
                            ⚠️ {MESSAGES_DICT[language].warningOver80} ({MESSAGES_DICT[language].spendingAt} {percentage}%)
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic SVG Category Share Wheel chart */}
              <div className={`border rounded-2xl p-5 shadow-xs transition-colors duration-300 ${
                theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
              }`} id="interactive-analytics-diagram">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-pink-955/40 text-pink-400" : "bg-pink-50 text-pink-600"}`}>
                    <Bot size={16} />
                  </div>
                  <h3 className={`font-bold text-sm ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>{MESSAGES_DICT[language].distributionTitle}</h3>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-4">
                  
                  {/* Custom Donut Chart */}
                  <div className="relative w-36 h-36 flex-shrink-0">
                    {/* SVG calculation */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke={theme === "dark" ? "#1E293B" : "#E2E8F0"} strokeWidth="12" />
                      {(() => {
                        let totalVal = Object.values(categorySpends).reduce((s, v) => s + v, 0);
                        if (totalVal === 0) return null;
                        
                        let currentOffset = 0;
                        return CATEGORIES.map((cat) => {
                          const spent = categorySpends[cat] || 0;
                          if (spent === 0) return null;
                          const pct = spent / totalVal;
                          const dashArray = `${pct * 251.2} 251.2`;
                          const dashOffset = -((currentOffset / totalVal) * 251.2);
                          currentOffset += spent;
                          
                          return (
                            <circle 
                              key={cat}
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke={CATEGORY_COLORS[cat]}
                              strokeWidth="12"
                              strokeDasharray={dashArray}
                              strokeDashoffset={dashOffset}
                              className="transition-all hover:stroke-[15px] cursor-pointer"
                              title={`${CATEGORY_TRANSLATIONS[cat][language]}: ${formatAmount(spent, 2)}`}
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{MESSAGES_DICT[language].outflowLabel}</span>
                      <span className={`text-sm font-black ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>{formatAmount(totalExpense, 0)}</span>
                    </div>
                  </div>

                  {/* Bullet color key indices */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    {CATEGORIES.map(cat => {
                      const spent = categorySpends[cat] || 0;
                      if (spent === 0 && totalExpense > 0) return null;
                      return (
                        <div key={cat} className="flex items-center gap-1.5 font-sans">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                          <span className={`truncate max-w-[80px] ${theme === "dark" ? "text-slate-350" : "text-slate-600"}`}>{CATEGORY_TRANSLATIONS[cat][language]}</span>
                          <span className={`text-[10px] font-bold ${theme === "dark" ? "text-slate-400" : "text-slate-400"}`}>{formatAmount(spent, 0)}</span>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

            </div>

            {/* Bottom Panel: Conversational AI Financial assistant with server proxy calls (12 Columns) */}
            <div className="lg:col-span-12" id="gemini-ai-consultant-panel">
              
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-slate-800 pointer-events-none">
                  <Sparkles size={160} />
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* left block: explanation and analytics results */}
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 font-bold px-3 py-1.5 rounded-xl text-xs mb-3">
                        <Bot size={14} className="animate-pulse text-indigo-400" />
                        SmartFinance Advisor (Gemini 3.5 Flash Client)
                      </div>
                      <h2 className="text-xl font-bold tracking-tight text-white">AI Habit Advisor & Saving Forecast</h2>
                      <p className="text-xs text-slate-400 mt-1">Get precise forecast projections, outlier spending checks, and direct recommendations based on your custom targets.</p>
                    </div>

                    {/* Pre-cached/Computed Smart Analysis panel */}
                    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-4">
                      <div className="flex justify-between items-center text-xs border-b border-slate-700/50 pb-2">
                        <span className="font-bold text-slate-200">System ledger telemetry report</span>
                        <button
                          onClick={handleTriggerAnalysis}
                          disabled={aiAnalysisLoading}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                        >
                          <RefreshCw size={12} className={aiAnalysisLoading ? "animate-spin" : ""} />
                          {aiAnalysisLoading ? "Analyzing..." : "Trigger Model Scan"}
                        </button>
                      </div>

                      {aiAnalysis ? (
                        <div className="space-y-3.5 text-xs text-slate-300">
                          <div>
                            <span className="block font-bold text-rose-300 mb-0.5">⚠️ Outlier Anomaly Checker</span>
                            <p className="leading-relaxed text-[11px]">{aiAnalysis.unusualExpenses}</p>
                          </div>
                          <div>
                            <span className="block font-bold text-amber-300 mb-0.5">📈 Velocity Spend Prediction</span>
                            <p className="leading-relaxed text-[11px]">{aiAnalysis.predictions}</p>
                          </div>
                          <div>
                            <span className="block font-bold text-emerald-300 mb-0.5">🎯 Saving Recommendations</span>
                            <p className="leading-relaxed text-[11px]">{aiAnalysis.savingRecommendations}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 text-center text-slate-400 text-xs">
                          <p>Click "Trigger Model Scan" above to run our detailed categories analyzer.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* right block: conversational live chat */}
                  <div className="lg:col-span-7 bg-slate-800 border border-slate-700/60 rounded-2xl flex flex-col overflow-hidden h-[450px]">
                    
                    {/* Header bar */}
                    <div className="px-4 py-3 bg-slate-850/80 border-b border-slate-700/50 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" />
                        <span className="text-xs font-bold text-slate-200">Conversation thread with Advisor</span>
                      </div>
                      <button 
                        onClick={() => setMessages(prev => [prev[0]])} 
                        className="text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer"
                      >
                        Clear Thread
                      </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((m) => {
                        const isUser = m.role === "user";
                        return (
                          <div 
                            key={m.id} 
                            className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                          >
                            <div className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                              isUser 
                                ? "bg-indigo-600 text-white rounded-br-none" 
                                : "bg-slate-700/60 text-slate-200 rounded-bl-none border border-slate-600/35"
                            }`}>
                              <p className="font-semibold text-[10px] uppercase text-slate-400/80 mb-0.5">{isUser ? "You" : "Advisor"}</p>
                              {m.content}
                              <span className="block text-[8px] text-right text-slate-400/80 mt-1">{m.timestamp}</span>
                            </div>
                          </div>
                        );
                      })}
                      {aiLoading && (
                        <div className="flex items-center gap-2 mr-auto bg-slate-700/30 text-slate-300 p-2.5 rounded-xl border border-slate-700/30 text-xs">
                          <Bot size={13} className="animate-spin text-indigo-400" />
                          Advisor is reviewing ledger indexes...
                        </div>
                      )}
                    </div>

                    {/* Quick helper prompts */}
                    <div className="px-4 py-2 border-t border-slate-700/30 flex gap-2 overflow-x-auto bg-slate-850/30 text-[11px] text-indigo-300 font-semibold scrollbar-none">
                      <button 
                        onClick={() => handleSendMessage("Where did I spend the most money?")}
                        className="bg-slate-700/40 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-600/30 flex-shrink-0 cursor-pointer transition-colors"
                      >
                        🔍 Where did I spend the most?
                      </button>
                      <button 
                        onClick={() => handleSendMessage("Predict my end of month spending based on current transactions.")}
                        className="bg-slate-700/40 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-600/30 flex-shrink-0 cursor-pointer transition-colors"
                      >
                        🔮 Predict Month-End Outflow
                      </button>
                      <button 
                        onClick={() => handleSendMessage("What categories can I save money on this month?")}
                        className="bg-slate-700/40 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-600/30 flex-shrink-0 cursor-pointer transition-colors"
                      >
                        💡 Suggest detailed saving tactics
                      </button>
                    </div>

                    {/* Interactive chat form input */}
                    <div className="p-3 bg-slate-900 border-t border-slate-700/40 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ask: 'How can I save more than 20% on bills?'"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={aiLoading || !userInput.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-2.5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-55"
                      >
                        Submit
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>

        ) : (
          
          /* VIEW 2: FULL NATIVE FLUTTER CLEAN ARCHITECTURE SOURCE REPOSITORY */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="flutter-codebase-panel">
            
            {/* Folder list sidebar (4 columns) */}
            <div className={`lg:col-span-4 border rounded-2xl p-5 shadow-xs flex flex-col transition-all duration-300 ${
              theme === "dark" ? "bg-[#111827] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
            }`} id="folder-navigator-rail">
              <div>
                <h3 className={`font-extrabold text-sm mb-1 flex items-center gap-2 ${
                  theme === "dark" ? "text-slate-100" : "text-slate-800"
                }`}>
                  <Code2 size={16} className={theme === "dark" ? "text-indigo-400" : "text-blue-600"} />
                  Flutter Clean MVVM Repo
                </h3>
                <p className={`text-xs mb-4 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>Explore the absolute code structure, folder indices, and configuration variables of the production-ready app.</p>
              </div>

              {/* Tree node roots */}
              <div className={`flex-1 overflow-y-auto max-h-[600px] border p-2.5 rounded-xl space-y-1 transition-all ${
                theme === "dark" ? "bg-slate-900/60 border-slate-800/80" : "bg-slate-50 border-slate-100"
              }`}>
                {renderFileTreeNode(flutterCodebase)}
              </div>

              {/* Setup sheet download/view guide */}
              <div className={`mt-4 pt-4 border-t flex justify-between items-center transition-all ${
                theme === "dark" ? "border-slate-800 bg-transparent text-slate-300" : "border-slate-100 bg-white"
              }`}>
                <div className={`text-[10px] font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  <span className={`block font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>MVVM Architecture</span>
                  Clean presentation separators
                </div>
                <button
                  onClick={() => {
                    const readme = flutterCodebase.children?.find(c => c.name.endsWith(".md"));
                    if (readme) setSelectedFile(readme);
                  }}
                  className={`border text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    theme === "dark" 
                      ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200" 
                      : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                  }`}
                >
                  <BookOpen size={12} />
                  Open Setup Instructions
                </button>
              </div>

            </div>

            {/* Code browser pane (8 columns) */}
            <div className="lg:col-span-8 flex flex-col space-y-4" id="source-code-browser">
              
              {selectedFile ? (
                <div className={`border rounded-3xl overflow-hidden flex flex-col shadow-xs transition-all duration-300 ${
                  theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
                }`} id="active-terminal-viewer">
                  
                  {/* File Metadata Header bar */}
                  <div className="bg-slate-900 px-5 py-3.5 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      <div>
                        <span className="text-xs font-extrabold block text-indigo-300 leading-none">{selectedFile.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono italic block mt-0.5">smart_expense_tracker/{selectedFile.path}</span>
                      </div>
                    </div>
 
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-800 text-[9px] text-slate-300 font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                        {selectedFile.language || "dart"}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all text-white cursor-pointer flex items-center gap-1.5"
                        title="Copy to clipboard"
                      >
                        {copiedFile ? <Check size={12} /> : <Copy size={12} />}
                        {copiedFile ? "Copied" : "Copy Source"}
                      </button>
                    </div>
                  </div>
 
                  {/* Complete details viewer */}
                  <div className="bg-slate-950 p-5 overflow-x-auto max-h-[640px] font-mono leading-relaxed text-xs">
                    <pre className="text-slate-200">
                      <code>{selectedFile.fileContent || "Select a source file to analyze compiled details."}</code>
                    </pre>
                  </div>
 
                  {/* Highlights and annotations block */}
                  <div className={`p-4 border-t text-xs space-y-1.5 transition-all duration-300 ${
                    theme === "dark" ? "bg-[#0d131f] border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}>
                    <span className={`font-bold block text-[11px] uppercase tracking-wider ${
                      theme === "dark" ? "text-slate-100" : "text-slate-800"
                    }`}>File Technical Context Annotations</span>
                    <p className="leading-relaxed text-[11px]">
                      This complete, highly scalable Flutter file is patterned strictly after **MVVM with Clean Architecture principles**. 
                      It isolates presentation widgets from backend domain controllers, utilizing Provider streams to pipe data directly to state hooks.
                    </p>
                  </div>
 
                </div>
              ) : (
                <div className={`border rounded-3xl p-16 text-center shadow-xs transition-all duration-300 ${
                  theme === "dark" ? "bg-[#111827] border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500"
                }`}>
                  <Bot size={48} className={`mx-auto mb-4 animate-bounce ${theme === "dark" ? "text-indigo-400" : "text-slate-300"}`} />
                  <p className={`font-bold text-sm ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>Select a Flutter, Firebase, or yaml settings file to view details.</p>
                  <p className="text-xs text-slate-400 mt-1">Folders can be expanded dynamically on the left navigation browser.</p>
                </div>
              )}

              {/* Architecture diagram details box */}
              <div className={`border rounded-2xl p-5 transition-all duration-300 ${
                theme === "dark" ? "bg-blue-950/20 border-blue-900/40 text-blue-300" : "bg-[#EFF6FF] border-blue-200 text-blue-800"
              }`} id="architecture-diagram-block">
                <h4 className={`font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-900"
                }`}>
                  <Bot size={14} />
                  Clean Architecture Separation of Concerns Matrix
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed">
                  <div className={`p-3 rounded-lg border transition-all ${
                    theme === "dark" ? "bg-slate-900/60 border-blue-900/45 text-slate-300" : "bg-white/60 border-blue-100 text-blue-800"
                  }`}>
                    <span className={`block font-bold mb-1 ${theme === "dark" ? "text-blue-400" : "text-blue-900"}`}>1. PRESENTATION (Views)</span>
                    Renders adaptive widgets, binds user actions directly to state changes, completely decoupled from Firebase SDK endpoints.
                  </div>
                  <div className={`p-3 rounded-lg border transition-all ${
                    theme === "dark" ? "bg-slate-900/60 border-blue-900/45 text-slate-300" : "bg-white/60 border-blue-100 text-blue-800"
                  }`}>
                    <span className={`block font-bold mb-1 ${theme === "dark" ? "text-blue-400" : "text-blue-900"}`}>2. STATE (ViewModels)</span>
                    Maintains view records, processes calculations, triggers category metrics updates, alerts above 80% spending targets.
                  </div>
                  <div className={`p-3 rounded-lg border transition-all ${
                    theme === "dark" ? "bg-slate-900/60 border-blue-900/45 text-slate-300" : "bg-white/60 border-blue-100 text-blue-800"
                  }`}>
                    <span className={`block font-bold mb-1 ${theme === "dark" ? "text-blue-400" : "text-blue-900"}`}>3. SOURCE DATA (Repository)</span>
                    Establishes security locks, manages OAuth states and syncing logic through real cloud collections.
                  </div>
                </div>
              </div>

            </div>

          </div>

        )}
      </main>

      {/* Humble craft footnotes */}
      <footer className={`border-t py-3.5 text-[11px] px-4 transition-all duration-300 ${
        theme === "dark" ? "bg-[#0b0f19] border-slate-850 text-slate-400" : "bg-white border-slate-200 text-slate-500"
      }`} id="app-footer-rail">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>Smart Expense Tracker • Clean MVVM Architecture Model Preview</p>
          <div className={`flex gap-4 font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-550"}`}>
            <span>Authentication: Firebase Auth (Email/Google)</span>
            <span>Database: Firestore Blueprint Configured</span>
            <span>Model: Gemini 3.5 Flash</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
