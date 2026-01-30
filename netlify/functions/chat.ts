import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!GEMINI_API_KEY) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        error: "Gemini API key not configured",
        available: false,
      }),
    };
  }

  try {
    const { content, history = [] } = JSON.parse(event.body || "{}");

    if (!content) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Content is required" }),
      };
    }

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
1. Questions related to: Solar feasibility and solar intelligence, Plant recommendations and gardening basics, "Your Garden" environmental impact (CO2/O2 estimates), AQI, air quality, heat impact, Green Credits awareness and process, Sustainability actions relevant to individuals.
2. Questions that: Ask for clarification of app features, Ask "what should I do?" type guidance, Ask "why is this recommended?" explanations.

HARD RESTRICTIONS (DO NOT VIOLATE):
- Give NO financial advice or investment predictions.
- Predict NO profits, savings guarantees, or credit values.
- Claim NO scientific precision or certifications.
- Generate NO legal advice or government confirmations.
- Act NOT as a generic AI assistant.
- Answer NO unrelated questions (politics, coding, math, etc.)

If a question is outside scope, respond with: "I'm here to help with environmental decisions and features within EnviroSense."

RESPONSE STYLE RULES:
1. Prefer interpretation over raw data.
2. Use approximate language (generally, typically, approximately).
3. Keep responses concise (3-6 sentences).
4. Avoid alarmist or preachy language.
5. Do not overclaim accuracy.`;

    const chatMessages: ChatMessage[] = [
      { role: "user", parts: [{ text: `SYSTEM INSTRUCTIONS: ${systemPrompt}` }] },
      ...history.map((m: { role: string; content: string }) => ({
        role: (m.role === "user" ? "user" : "model") as "user" | "model",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: content }] },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: chatMessages,
          generationConfig: {
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: "Failed to get response from Gemini" }),
      };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ content: text, available: true }),
    };
  } catch (error) {
    console.error("Chat function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

export { handler };
