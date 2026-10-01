import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health-assistant-tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const text = String(body?.text ?? "").trim();

          if (!text) {
            return Response.json(
              {
                error: "No text was provided.",
              },
              { status: 400 },
            );
          }

          if (text.length > 5000) {
            return Response.json(
              {
                error: "The response is too long for voice playback.",
              },
              { status: 400 },
            );
          }

          const apiKey = process.env["YARNGPT_API_KEY"];

          console.log(
            "YARNGPT KEY LOADED:",
            Boolean(apiKey),
            "LENGTH:",
            apiKey?.length ?? 0,
          );

          if (!apiKey) {
            console.error("YARNGPT_API_KEY is missing.");

            return Response.json(
              {
                error: "Voice service is not configured yet.",
              },
              { status: 500 },
            );
          }

          const yarnResponse = await fetch(
            "https://api.yarngpt.ai/api/v1/streaming/conversation",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text,
                voice: "umar",
                output_format: "mp3",
              }),
            },
          );

          if (!yarnResponse.ok) {
            const errorText = await yarnResponse.text();

            console.error(
              "YarnGPT TTS error:",
              errorText,
            );

            return Response.json(
              {
                error: "Voice generation failed.",
                details: errorText,
              },
              { status: 502 },
            );
          }

          const audioBuffer = await yarnResponse.arrayBuffer();

          console.log(
            "YARNGPT AUDIO SIZE:",
            audioBuffer.byteLength,
          );

          if (audioBuffer.byteLength === 0) {
            console.error("YarnGPT returned empty audio.");

            return Response.json(
              {
                error: "Voice generation returned empty audio.",
              },
              { status: 502 },
            );
          }

          return new Response(audioBuffer, {
            status: 200,
            headers: {
              "Content-Type":
                yarnResponse.headers.get("Content-Type") ??
                "audio/mpeg",
              "Cache-Control": "no-cache",
            },
          });
        } catch (error) {
          console.error(
            "Health Assistant TTS error:",
            error,
          );

          return Response.json(
            {
              error:
                "Voice playback is currently unavailable.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});