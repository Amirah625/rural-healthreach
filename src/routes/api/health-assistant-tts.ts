import { createFileRoute } from "@tanstack/react-router";

const YARNGPT_API = "https://api.yarngpt.ai/api/v1";
const MAX_POLL_ATTEMPTS = 30;
const POLL_INTERVAL_MS = 800;

type YarnJobStatus = {
  status?: string;
  audio_url?: string;
  user_message?: string;
};

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export const Route = createFileRoute("/api/health-assistant-tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body: unknown = await request.json();
          const text =
            body !== null && typeof body === "object" && "text" in body
              ? String(body.text ?? "").trim()
              : "";

          if (!text) {
            return Response.json(
              {
                error: "No text was provided.",
              },
              { status: 400 },
            );
          }

          if (text.length > 2000) {
            return Response.json(
              {
                error: "The response is too long for voice playback.",
              },
              { status: 400 },
            );
          }

          const apiKey = process.env["YARNGPT_API_KEY"];

          if (!apiKey) {
            console.error("YARNGPT_API_KEY is missing from the server environment.");

            return Response.json(
              {
                error:
                  "Voice service is not configured. Add the YARNGPT_API_KEY deployment secret.",
              },
              { status: 500 },
            );
          }

          const headers = {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          };
          const yarnResponse = await fetch(`${YARNGPT_API}/tts`, {
            method: "POST",
            headers: {
              ...headers,
              "Idempotency-Key": crypto.randomUUID(),
            },
            body: JSON.stringify({ text, output_format: "mp3" }),
          });

          if (!yarnResponse.ok) {
            console.error(`YarnGPT job creation failed with status ${yarnResponse.status}.`);
            const error =
              yarnResponse.status === 401
                ? "YarnGPT rejected YARNGPT_API_KEY. Update the YARNGPT_API_KEY deployment secret with a current API key."
                : "Voice generation failed. Please try again shortly.";

            return Response.json(
              { error },
              { status: 502 },
            );
          }

          const job = (await yarnResponse.json()) as { job_id?: string };
          if (!job.job_id || !/^[a-zA-Z0-9_-]+$/.test(job.job_id)) {
            console.error("YarnGPT returned an invalid TTS job identifier.");
            return Response.json(
              { error: "Voice generation failed. Please try again shortly." },
              { status: 502 },
            );
          }

          let completed: YarnJobStatus | null = null;
          for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
            if (attempt > 0) await delay(POLL_INTERVAL_MS);
            const statusResponse = await fetch(
              `${YARNGPT_API}/status/${encodeURIComponent(job.job_id)}`,
              { headers: { Authorization: `Bearer ${apiKey}` } },
            );
            if (!statusResponse.ok) {
              console.error(`YarnGPT status check failed with status ${statusResponse.status}.`);
              return Response.json(
                {
                  error:
                    statusResponse.status === 401
                      ? "YarnGPT rejected YARNGPT_API_KEY. Update the YARNGPT_API_KEY deployment secret with a current API key."
                      : "Voice generation failed. Please try again shortly.",
                },
                { status: 502 },
              );
            }

            const status = (await statusResponse.json()) as YarnJobStatus;
            if (status.status === "completed") {
              completed = status;
              break;
            }
            if (status.status === "failed") {
              console.error("YarnGPT reported that the TTS job failed.");
              return Response.json(
                {
                  error:
                    status.user_message ||
                    "Voice generation failed. Please try again shortly.",
                },
                { status: 502 },
              );
            }
          }

          if (!completed?.audio_url) {
            return Response.json(
              { error: "Voice generation is taking longer than expected. Please try again." },
              { status: 504 },
            );
          }

          const audioUrl = new URL(completed.audio_url);
          if (audioUrl.protocol !== "https:" || audioUrl.username || audioUrl.password) {
            console.error("YarnGPT returned an invalid audio URL.");
            return Response.json(
              { error: "Voice generation failed. Please try again shortly." },
              { status: 502 },
            );
          }

          const audioResponse = await fetch(audioUrl);
          if (!audioResponse.ok || !audioResponse.body) {
            console.error(`YarnGPT audio download failed with status ${audioResponse.status}.`);
            return Response.json(
              { error: "Voice generation failed. Please try again shortly." },
              { status: 502 },
            );
          }

          return new Response(audioResponse.body, {
            status: 200,
            headers: {
              "Content-Type": audioResponse.headers.get("content-type") ?? "audio/mpeg",
              "Cache-Control": "no-store",
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