import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return a dummy client or throw error, but let's make it throw gracefully or fallback to direct client messages if key is missing during first launch.
    console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will be in fallback mode.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "MISSING_KEY",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getGeminiClient();

// Helper system prompt
const SYSTEM_INSTRUCTION = `You are "SmartFinance AI", a highly sophisticated, expert personal financial planner and advisor.
Your goal is to guide users to financial wellness based on their transactions, category budgets, and current saving targets.

Support multi-language interactions. If the language parameter is set to Arabic, French, Italian, German, or Spanish, or if the request asks for it, please formulate your reply in natural, clear, and highly professional financial manner in that specific language (Arabic: العربية, French: français, Italian: italiano, German: Deutsch, Spanish: español).

When analyzing transactions:
1. Detect unusual expenses: Look for a transaction description or category that stands out, has higher-than-average pricing, or doesn't fit standard weekly/monthly patterns (e.g. high bills or excessive entertainment spikes).
2. Predict end-of-month spending: Project the current daily run-rate forward to determine if they will breach their total budget.
3. Recommend specific categories where they could save (e.g. food delivery vs home cooking, entertainment costs).

Always return constructive, motivating, professional, and practical advice. Use clear bullet points if appropriate. Avoid high-risk speculative recommendations. Preserve privacy.`;

const FALLBACK_ANALYSIS: Record<string, { unusualExpenses: string; predictions: string; savingRecommendations: string }> = {
  en: {
    unusualExpenses: "Gemini API key is not configured yet. Complete this in Settings > Secrets. Here is a simulated tip: Your dining out expenses seem higher than your budget!",
    predictions: "Could not fetch custom trend. Configure your GEMINI_API_KEY to receive custom end-of-month transaction forecasting.",
    savingRecommendations: "Set conservative budgets in 'Entertainment' and 'Shopping' to save up to 15% more monthly."
  },
  ar: {
    unusualExpenses: "لم يتم تكوين مفتاح Gemini API بعد. قم بتهيئة المفتاح في الإعدادات > الأسرار. إليك نصيحة توضيحية: يبدو أن مصروفات تناول الطعام لديك أعلى من ميزانيتك المقررة!",
    predictions: "تعذر حساب الاتجاهات المخصصة. قم بتكوين مفتاح GEMINI_API_KEY لتفعيل التوقعات الذكية لحجم الاستهلاك المتوقع في نهاية الشهر الحالي.",
    savingRecommendations: "1. قلص ميزانية الترفيه والتسوق لتوفير ما يصل إلى 15% إضافية شهرياً. 2. تجنب الشراء الاندفاعي بدون خطة مسبقة."
  },
  fr: {
    unusualExpenses: "La clé API Gemini n'est pas encore configurée. Configurez-la dans Paramètres > Secrets. Voici un conseil simulé : vos dépenses de restauration semblent plus élevées que votre budget !",
    predictions: "Impossible de récupérer la tendance personnalisée. Configurez votre GEMINI_API_KEY pour recevoir des prévisions de fin de mois.",
    savingRecommendations: "Définissez des budgets plus stricts dans 'Divertissement' et 'Shopping' pour économiser jusqu'à 15% de plus par mois."
  },
  it: {
    unusualExpenses: "La chiave API Gemini non è ancora configurata. Configurala in Impostazioni > Segreti. Ecco un consiglio simulato: le tue spese per la ristorazione sembrano superiori al budget!",
    predictions: "Impossibile recuperare l'andamento personalizzato. Configura la tua GEMINI_API_KEY per ricevere previsioni di fine mese.",
    savingRecommendations: "Imposta budget più restrittivi in 'Intrattenimento' e 'Acquisti' per risparmiare fino al 15% in più al mese."
  },
  de: {
    unusualExpenses: "Der Gemini-API-Schlüssel ist noch nicht konfiguriert. Richten Sie ihn unter Einstellungen > Geheimnisse ein. Hier ist ein simulierter Tipp: Ihre Restaurant-Ausgaben scheinen höher zu sein als Ihr Budget!",
    predictions: "Benutzerdefinierter Trend konnte nicht geladen werden. Konfigurieren Sie Ihren GEMINI_API_KEY, um benutzerdefinierte Monatsend-Prognosen zu erhalten.",
    savingRecommendations: "Setzen Sie konservative Budgets in 'Unterhaltung' und 'Einkaufen', um monatlich bis zu 15% mehr zu sparen."
  },
  es: {
    unusualExpenses: "La clave API de Gemini aún no está configurada. Agrégala en Configuración > Secretos. Aquí tienes un consejo simulado: ¡tus gastos en restaurantes parecen superiores a tu presupuesto!",
    predictions: "No se pudo recuperar la tendencia personalizada. Configura tu GEMINI_API_KEY para recibir pronósticos de fin de mes.",
    savingRecommendations: "Establece presupuestos más ajustados en 'Entretenimiento' y 'Compras' para ahorrar hasta un 15% más al mes."
  }
};

const FALLBACK_CHAT: Record<string, string> = {
  en: "Hi! I'm your Smart Expense Advisor. I'd love to help you review your spending, but my GEMINI_API_KEY is not set yet! You can input your transactions locally. Please click Settings > Secrets in AI Studio and add a real key to enable my live responses. Default mock response: You have spent standard food/dining amounts today. Let me know if you want tips!",
  ar: "مرحباً! أنا مستشارك المالي الذكي. أود مساعدتك في مراجعة ميزانيتك ومصروفاتك، ولكن لم يتم تكوين مفتاح GEMINI_API_KEY الخاص بي بعد! يمكنك استخدام التطبيق محلياً بالكامل. يرجى الضغط على الإعدادات > الأسرار في AI Studio وإدخال مفتاح حقيقي للحصول على ردود مباشرة مني بالذكاء الاصطناعي.",
  fr: "Bonjour ! Je suis votre conseiller financier intelligent. J'aimerais vous aider à revoir vos dépenses, mais ma clé GEMINI_API_KEY n'est pas encore configurée ! Vous pouvez saisir vos transactions localement. Veuillez cliquer sur Paramètres > Secrets dans AI Studio et ajouter une clé réelle pour activer mes réponses en direct.",
  it: "Ciao! Sono il tuo consulente finanziario intelligente. Vorrei aiutarti a verificare le tue spese, ma la mia chiave GEMINI_API_KEY non è ancora configurata! Puoi inserire le tue transazioni localmente. Clicca su Impostazioni > Segreti in AI Studio e aggiungi una chiave reale per abilitare le mie risposte in tempo reale.",
  de: "Hallo! Ich bin Ihr intelligenter Ausgabenberater. Ich würde Ihnen gerne helfen, Ihre Ausgaben zu überprüfen, aber mein GEMINI_API_KEY ist noch nicht konfiguriert! Sie können Ihre Buchungen lokal eintragen. Bitte klicken Sie in AI Studio auf Einstellungen > Geheimnisse und fügen Sie einen echten Schlüssel hinzu, um meine Live-Antworten zu aktivieren.",
  es: "¡Hola! Soy tu asesor financiero inteligente. Me encantaría ayudarte a revisar tus gastos, pero mi clave GEMINI_API_KEY aún no está configurada. Puedes registrar tus transacciones localmente. Haz clic en Configuración > Secretos en AI Studio y agrega una clave real para activar mis respuestas en vivo."
};

// API: Analyze Spending
app.post("/api/ai/analyze-spending", async (req, res) => {
  try {
    const { transactions, budgets, language } = req.body;
    const clientLang = language || "en";
    
    if (!process.env.GEMINI_API_KEY) {
      const fb = FALLBACK_ANALYSIS[clientLang] || FALLBACK_ANALYSIS.en;
      return res.json({
        ...fb,
        isSimulated: true
      });
    }

    const payloadString = JSON.stringify({ transactions, budgets }, null, 2);
    const langMap: Record<string, string> = {
      en: "ENGLISH",
      ar: "ARABIC",
      fr: "FRENCH",
      it: "ITALIAN",
      de: "GERMAN",
      es: "SPANISH"
    };
    const langName = langMap[clientLang] || "ENGLISH";
    const languageInstruction = `WRITE YOUR RESPONSE IN PERFECT ${langName}.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Please analyze the following private user transaction ledger and category budgets. Detect any outlier/unusual expenses, project their end-of-month total spending based on the current run-rate, and outline 3 specific actionable saving recommendations based on their actual categories.
      
      CRITICAL REQUIREMENT: ${languageInstruction}
      
Ledger context:
${payloadString}

Format your JSON response strictly with the following fields:
{
  "unusualExpenses": "Detailed analysis of flagged outliers",
  "predictions": "Run-rate projection and budget breach probability",
  "savingRecommendations": "Three core recommendations for saving"
}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini Analyze Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze spending pattern." });
  }
});

// API: Conversational Chat Assistant
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, transactions, budgets, language } = req.body;
    const clientLang = language || "en";

    if (!process.env.GEMINI_API_KEY) {
      const fbReply = FALLBACK_CHAT[clientLang] || FALLBACK_CHAT.en;
      return res.json({
        reply: fbReply
      });
    }

    const recentHistoryPrompt = history?.map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join("\n") || "";
    const contextPrompt = `User's Transactions: ${JSON.stringify(transactions)}\nUser's Budgets: ${JSON.stringify(budgets)}`;
    
    const langMap: Record<string, string> = {
      en: "ENGLISH ONLY",
      ar: "NATURAL ARABIC ONLY",
      fr: "NATURAL FRENCH ONLY",
      it: "NATURAL ITALIAN ONLY",
      de: "NATURAL GERMAN ONLY",
      es: "NATURAL SPANISH ONLY"
    };
    const langName = langMap[clientLang] || "ENGLISH ONLY";
    const languageRequest = `PLEASE ANSWER IN ${langName}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Context about user's finances:\n${contextPrompt}\n\nRecent Conversation History:\n${recentHistoryPrompt}\n\nUser Question: ${message}\n\n${languageRequest}\n\nPlease reply as their professional expense assistant. Answer their specific question accurately based on the transaction data if possible. Keep things clear, elegant, and under 150 words. Do not make up facts.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to yield assistant response." });
  }
});

// Serve frontend assets
async function serveApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Expense Tracker server listening on http://0.0.0.0:${PORT}`);
  });
}

serveApp();
