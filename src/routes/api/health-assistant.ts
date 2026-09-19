import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health-assistant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const message = String(body?.message ?? "").trim();

          if (!message) {
            return Response.json(
              {
                reply: "Please tell me what health problem you need help with.",
                language: "English",
                intent: "general",
                service: "health_assistant",
              },
              { status: 400 },
            );
          }

          const apiKey = process.env["GROQ_API_KEY"];

          if (!apiKey) {
            console.error("GROQ_API_KEY is missing.");

            return Response.json(
              {
                reply: "Health Assistant is not configured yet.",
                language: "English",
                intent: "error",
                service: "health_assistant",
              },
              { status: 500 },
            );
          }

          const lower = message.toLowerCase();

          let intent = "general";
          let service = "health_assistant";

          if (
            lower.includes("emergency") ||
            lower.includes("unconscious") ||
            lower.includes("can't breathe") ||
            lower.includes("cannot breathe") ||
            lower.includes("severe bleeding") ||
            lower.includes("seizure") ||
            lower.includes("severe chest pain")
          ) {
            intent = "emergency";
            service = "emergency_help";
          } else if (
            lower.includes("fever") ||
            lower.includes("temperature") ||
            lower.includes("hot")
          ) {
            intent = "fever";
            service = "clinic";
          } else if (
            lower.includes("cough") ||
            lower.includes("coughing") ||
            lower.includes("phlegm") ||
            lower.includes("mucus")
          ) {
            intent = "cough";
            service = "clinic";
          } else if (
            lower.includes("stomach") ||
            lower.includes("belly") ||
            lower.includes("abdominal") ||
            lower.includes("vomit") ||
            lower.includes("diarrhea")
          ) {
            intent = "stomach_pain";
            service = "clinic";
          } else if (
            lower.includes("pharmacy") ||
            lower.includes("medicine") ||
            lower.includes("drug")
          ) {
            intent = "medicine";
            service = "pharmacy";
          }

          const groqResponse = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                temperature: 0.3,
                max_completion_tokens: 500,

                response_format: {
                  type: "json_object",
                },

                messages: [
                  {
                    role: "system",
                    content: `
You are the RuralReach Health Assistant for rural communities in Nigeria.

Your job is to:
- Understand what the user is asking about their health.
- Give clear, simple and helpful health information.
- Help the user decide what type of healthcare service may be appropriate.
- Use simple language that is easy to understand.
- Never claim to diagnose a disease.
- Never prescribe prescription medicines.
- Never tell the user to ignore serious symptoms.
- For emergencies, tell the user to seek urgent medical care immediately and mention Nigeria's emergency number 112.
- If the user describes severe difficulty breathing, unconsciousness, severe bleeding, seizures, severe chest pain, or another potentially life-threatening situation, prioritize urgent medical help.
- When appropriate, suggest visiting a clinic, hospital, pharmacist, or other healthcare professional.
- Do not pretend to know the user's exact location unless they provide it.

LANGUAGE RULE:
- Detect the language used by the user.
- Supported languages are English, Yoruba, Hausa, and Igbo.
- If the user writes in Yoruba, reply in Yoruba.
- If the user writes in Hausa, reply in Hausa.
- If the user writes in Igbo, reply in Igbo.
- If the user writes in English, reply in English.
- Do not translate the user's message into English before answering.
- Keep the answer in the same language as the user's message.
- If the message mixes languages, use the language that is most prominent.
- The language field must contain exactly one of:
  "English", "Yoruba", "Hausa", "Igbo"

Return ONLY valid JSON in this exact structure:

{
  "language": "English",
  "reply": "Your response here"
}

Keep responses concise and practical.
                    `.trim(),
                  },
                  {
                    role: "user",
                    content: message,
                  },
                ],
              }),
            },
          );

          if (!groqResponse.ok) {
            const errorText = await groqResponse.text();

            console.error("GROQ ERROR:", errorText);

            return Response.json(
              {
                reply: `Groq error: ${errorText}`,
                language: "English",
                intent,
                service,
              },
              { status: 502 },
            );
          }

          const data = await groqResponse.json();

          const rawContent =
            data?.choices?.[0]?.message?.content?.trim() || "";

          let parsedResponse: {
            language?: string;
            reply?: string;
          } = {};

          try {
            parsedResponse = JSON.parse(rawContent);
          } catch (parseError) {
            console.error(
              "Could not parse Groq JSON response:",
              parseError,
              rawContent,
            );

            return Response.json(
              {
                reply:
                  "I couldn't understand the assistant response. Please try again.",
                language: "English",
                intent,
                service,
              },
              { status: 502 },
            );
          }

          const supportedLanguages = [
            "English",
            "Yoruba",
            "Hausa",
            "Igbo",
          ] as const;

          const detectedLanguage = supportedLanguages.includes(
            parsedResponse.language as (typeof supportedLanguages)[number],
          )
            ? parsedResponse.language
            : "English";

          const reply =
            typeof parsedResponse.reply === "string" &&
            parsedResponse.reply.trim()
              ? parsedResponse.reply.trim()
              : "I couldn't generate a response. Please try again.";

          return Response.json({
            reply,
            language: detectedLanguage,
            intent,
            service,
          });
        } catch (error) {
          console.error("Health Assistant error:", error);

          return Response.json(
            {
              reply:
                "Health Assistant is currently unavailable. Please try again shortly.",
              language: "English",
              intent: "error",
              service: "health_assistant",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});