import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  const available = !!process.env.GEMINI_API_KEY;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ available }),
  };
};

export { handler };
