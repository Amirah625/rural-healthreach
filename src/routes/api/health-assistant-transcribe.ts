import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health-assistant-transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData();
          const file = formData.get("file");

          if (!(file instanceof File)) {
            return Response.json(
              { error: "No audio file was provided." },
              { status: 400 },
            );
          }

          const apiKey = process.env["GROQ_API_KEY"];

          if (!apiKey) {
            console.error("GROQ_API_KEY is missing.");

            return Response.json(
              { error: "Speech-to-text is not configured." },
              { status: 500 },
            );
          }

          console.log("========== VOICE DEBUG ==========");
          console.log("File name:", file.name);
          console.log("File type:", file.type);
          console.log("File size:", file.size);

          if (file.size < 1000) {
            console.error("Audio file is suspiciously small.");

            return Response.json(
              {
                error:
                  "The microphone recording was too short or contained no usable audio.",
              },
              { status: 400 },
            );
          }

          const groqFormData = new FormData();

          groqFormData.append("file", file);
          groqFormData.append("model", "whisper-large-v3");
          groqFormData.append("response_format", "verbose_json");
          groqFormData.append("temperature", "0");

          const response = await fetch(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
              body: groqFormData,
            },
          );

          if (!response.ok) {
            const errorText = await response.text();

            console.error("GROQ TRANSCRIPTION ERROR:", errorText);

            return Response.json(
              { error: "Speech transcription failed." },
              { status: 502 },
            );
          }

          const data = await response.json();

          console.log("WHISPER RESULT:", data);

          const text = String(data?.text || "").trim();

          const segments = Array.isArray(data?.segments)
            ? data.segments
            : [];

          const noSpeechProbabilities = segments
            .map((segment: { no_speech_prob?: number }) =>
              Number(segment?.no_speech_prob ?? 0),
            )
            .filter((value: number) => Number.isFinite(value));

          const maxNoSpeechProbability =
            noSpeechProbabilities.length > 0
              ? Math.max(...noSpeechProbabilities)
              : 0;

          const averageLogProbabilities = segments
            .map((segment: { avg_logprob?: number }) =>
              Number(segment?.avg_logprob ?? 0),
            )
            .filter((value: number) => Number.isFinite(value));

          const averageLogProbability =
            averageLogProbabilities.length > 0
              ? averageLogProbabilities.reduce(
                  (total: number, value: number) => total + value,
                  0,
                ) / averageLogProbabilities.length
              : 0;

          console.log(
            "MAX NO-SPEECH PROBABILITY:",
            maxNoSpeechProbability,
          );

          console.log(
            "AVERAGE LOG PROBABILITY:",
            averageLogProbability,
          );

          console.log("TRANSCRIBED TEXT:", text);
          console.log("========== END VOICE DEBUG ==========");

          if (!text) {
            return Response.json({
              text: "",
              message:
                "I couldn't hear clear speech in that recording. Please try again.",
            });
          }

          return Response.json({
            text,
          });
        } catch (error) {
          console.error("Transcription error:", error);

          return Response.json(
            {
              error:
                "Speech-to-text is currently unavailable. Please try again.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});