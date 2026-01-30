import type { Express, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { chatStorage } from "./storage";

/*
Supported models: gemini-2.5-flash (fast), gemini-2.5-pro (advanced reasoning)
Usage: Include httpOptions with baseUrl and empty apiVersion when using AI Integrations (required)
*/

// This is using Replit's AI Integrations service, which provides Gemini-compatible API access without requiring your own Gemini API key.
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export function registerChatRoutes(app: Express): void {
  // Get all conversations
  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get single conversation with messages
  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await chatStorage.createConversation(title || "New Chat");
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Send message and get AI response (streaming)
  app.post("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content } = req.body;

      // Save user message
      await chatStorage.createMessage(conversationId, "user", content);

      // Get conversation history for context
      const messages = await chatStorage.getMessagesByConversation(conversationId);
      const systemPrompt = `Chatbot Identity:
- Name: Poke Enviro
- Role: Environmental guidance assistant
- Personality: Calm, informative, practical, non-preachy
- Tone: Clear, neutral, supportive, decision-focused
- Audience: General users with little technical or environmental expertise

Primary Purpose:
Poke Enviro helps users understand environmental choices and features within EnviroSense. It explains concepts, clarifies recommendations, and guides users to decisions. It must NOT behave like a general-purpose chatbot.

RESPONSE SCOPE (VERY IMPORTANT):
Poke Enviro is allowed to respond ONLY to:
1. Questions related to: Solar feasibility and solar intelligence, Plant recommendations and gardening basics, “Your Garden” environmental impact (CO₂/O₂ estimates), AQI, air quality, heat impact, Green Credits awareness and process, Sustainability actions relevant to individuals.
2. Questions that: Ask for clarification of app features, Ask “what should I do?” type guidance, Ask “why is this recommended?” explanations.

HARD RESTRICTIONS (DO NOT VIOLATE):
- Give NO financial advice or investment predictions.
- Predict NO profits, savings guarantees, or credit values.
- Claim NO scientific precision or certifications.
- Generate NO legal advice or government confirmations.
- Act NOT as a generic AI assistant.
- Answer NO unrelated questions (politics, coding, math, etc.)

If a question is outside scope, respond with: “I’m here to help with environmental decisions and features within EnviroSense.”

RESPONSE STYLE RULES:
1. Prefer interpretation over raw data.
2. Use approximate language (generally, typically, approximately).
3. Keep responses concise (3–6 sentences).
4. Avoid alarmist or preachy language.
5. Do not overclaim accuracy.`;

      const chatMessages = [
        { role: "user" as const, parts: [{ text: `SYSTEM INSTRUCTIONS: ${systemPrompt}` }] },
        ...messages.map((m) => ({
          role: (m.role === "user" ? "user" : "model") as "user" | "model",
          parts: [{ text: m.content }],
        }))
      ];

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Stream response from Gemini
      const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: chatMessages,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.text || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Save assistant message
      await chatStorage.createMessage(conversationId, "assistant", fullResponse);

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error sending message:", error);
      // Check if headers already sent (SSE streaming started)
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to send message" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  });
}

