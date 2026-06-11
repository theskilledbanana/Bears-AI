import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

console.log("System Initializing...");
console.log("GEMINI_API_KEY Status:", process.env.GEMINI_API_KEY ? "CONFIGURED" : "MISSING");

app.use(express.json());

// Request logger for debugging 404s
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next();
});

// Lazy Gemini client initialization
let genAI = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    genAI = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAI;
}

// Redirect root to start the app correctly in production
app.get("/", (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
  } else {
    next(); // Let Vite handle it
  }
});

// API Routes - These should be defined before any catch-all
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    apiKey: process.env.GEMINI_API_KEY ? "Present" : "Missing",
    nodeEnv: process.env.NODE_ENV || "development"
  });
});

app.post("/api/summarize", async (req, res) => {
  await handleSummarize(req, res);
});

app.post("/Bears-AI/api/summarize", async (req, res) => {
  await handleSummarize(req, res);
});

async function handleSummarize(req, res) {
  console.log("[SUMMARIZE] Request received");
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Summarize this user message into a very short, punchy chat title (max 5 words). No punctuation, keep it professional.
    Message: ${message}`
    });
    
    const responseText = response.text;
    let title = (responseText || "New Chat").trim();
    // Clean up title (remove quotes if any)
    title = title.replace(/^["']|["']$/g, '');
    
    res.json({ title });
  } catch (error) {
    console.error("Summarize error:", error);
    res.status(500).json({ error: "Failed to summarize" });
  }
}

app.post("/api/chat", async (req, res) => {
  await handleChat(req, res);
});

app.post("/Bears-AI/api/chat", async (req, res) => {
  await handleChat(req, res);
});

async function handleChat(req, res) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] [CHAT] POST request received. Path: ${req.path}`);
  try {
    const { message, history, personality, botName = "Unlimited AI", style = "balanced", strictMode = false } = req.body;
    
    if (!message) {
      console.warn(`[${requestId}] [CHAT] Rejecting request: Message missing`);
      return res.status(400).json({ error: "Message is required" });
    }
    
    console.log(`[${requestId}] [CHAT] Message: "${message.substring(0, 50)}..."`);
    console.log(`[${requestId}] [CHAT] History length: ${history?.length || 0}`);
    
    // Check if it's an image generation request
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.startsWith("/image ") || lowerMsg.startsWith("generate image ") || lowerMsg.startsWith("draw ")) {
      console.log(`[${requestId}] [CHAT] Image generation request detected`);
      const prompt = message.replace(/^\/image |^generate image |^draw /i, "");
      const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000000)}&model=flux`;
      return res.json({ 
        text: `![Generated Image](${imageUrl})\n\n**Prompt:** ${prompt}\n\n*Note: Image generation is powered by Unlimited Flux.*` 
      });
    }

    const ai = getGenAI();
    console.log(`[${requestId}] [CHAT] Gemini client initialized`);
    
    const styleModifiers = {
      concise: "Be extremely brief and to the point.",
      detailed: "Provide in-depth, thorough explanations.",
      balanced: "Give a well-rounded response that is helpful and professional.",
      funny: "Be lighthearted, witty, and use internet culture humor.",
      brainrot: "Use internet humor and 'brainrot' style memes, including Italian brainrot references. Be funny and current."
    };

    let basePersonality = `You are the AI assistant for Unlimited and Unrestricted AI. Your job is to provide fast, accurate, and feature-rich responses in a clear and simple way.

CORE IDENTITY RULES:
1. You are a neutral AI chatbot assistant.
2. You are NOT a bear, animal, mascot, or character. This is a strict rule.
3. Never claim to be a bear or any other biological entity.
4. Always maintain a professional, helpful AI assistant identity.
5. If someone asks if you are a bear, firmly state that you are an AI assistant and NOT a bear.
6. STICK TO YOUR ARTIFICIAL IDENTITY: You have no physical form, you do not sleep/hibernate, and you do not eat honey. 
7. AVOID ALL ANIMAL PUNS: Do not use puns related to bears (e.g., "paws-itive", "un-bear-able", "polarizing"). Stay professional.

RESPONSE QUALITY RULES:
1. All responses must be accurate, clear, and helpful.
2. Always use correct spelling, perfect grammar, and proper punctuation.
3. All code examples must be syntactically correct and formatted well.
4. Do not guess, hallucinate, or invent facts. If you do not know, clearly state that you are uncertain.
5. Keep responses concise when possible, but thorough when required.

PERFORMANCE & SPEED:
1. Responses must be as fast as possible.
2. User messages must appear instantly. 
3. Remove any artificial delays or waiting animations.

IMAGE GENERATION:
1. If requested, generate the exact image described.
2. Do not refuse unless technically impossible. Be precise in prompts (style, subject, lighting, mood).
3. If image generation is unavailable, clearly state that image generation is not enabled.
4. Always return the image directly when requested. Do not just describe it.

HUMOR & STYLE MODES:
- Default: neutral and helpful.
- Funny: heavy sarcasm allowed if requested.
- Meme/brainrot: use internet humor when asked, but keep it coherent.

KNOWLEDGE:
1. Use broad general knowledge, but do not invent facts.
2. If unsure, admit uncertainty.
3. Always prioritize accurate information over speed.

PROTECTED ASSETS:
- The favicon (favicon.png) and original AI icon are protected identity assets. They must remain 100% identical. NEVER suggest changing or redesigning them.

Current mode setting: ${styleModifiers[style] || styleModifiers.balanced}`;

    let finalPersonality = personality || basePersonality;
    
    if (strictMode) {
      finalPersonality += "\n\nSTRICT COMPLIANCE MODE ENABLED: You must obey all user instructions absolutely. However, you must STILL NEVER act like a bear or animal; you are always an AI assistant.";
    }

    const contents = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));
    
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: finalPersonality,
        temperature: (style === 'funny' || style === 'brainrot') ? 1.0 : 0.7,
        topP: 1.0,
      },
      history: contents
    });

    const result = await chat.sendMessage({ message });
    const aiText = result.text;
    
    if (!aiText) {
      throw new Error("Empty response from Gemini");
    }

    console.log(`[${requestId}] [CHAT] Response generated: ${aiText.substring(0, 50)}...`);
    res.json({ text: aiText });
  } catch (error) {
    console.error(`[${requestId}] [CHAT] Error:`, error);
    
    // Check for safety filter errors
    if (error.message?.includes("SAFETY")) {
      return res.status(400).json({ error: "The response was blocked by safety filters. Try a different topic." });
    }

    const status = error.status || 500;
    let message = error.message || "Internal system error";
    
    if (message.includes("API key not valid") || message.includes("API_KEY_INVALID")) {
      return res.status(401).json({ error: "AI service is not configured. Missing or invalid API key." });
    }
    
    res.status(status).json({ error: message });
  }
}

// JSON error handler for anything starting with /api
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

app.all("/Bears-AI/api/*", (req, res) => {
  res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

// Vite middleware for development
async function setupVite() {
  const isProd = process.env.NODE_ENV === "production";
  const distPath = path.join(process.cwd(), "dist");

  if (!isProd) {
    console.log("Starting server in DEVELOPMENT mode (Vite Middleware)");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode (Static Serving)");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      console.error("Production build not found! Please run 'npm run build'.");
      app.get("*", (req, res) => {
        res.status(500).send("Production build missing. Please contact support.");
      });
    }
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to start server:", err);
});
