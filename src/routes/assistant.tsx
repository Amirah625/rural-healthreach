import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Copy,
  Loader2,
  Mic,
  Send,
  Square,
  Volume2,
} from "lucide-react";
import { useRef, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";

type AssistantLanguage =
  | "English"
  | "Yoruba"
  | "Hausa"
  | "Igbo";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  language?: AssistantLanguage;
};

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Health Assistant | RuralReach Health" },
      {
        name: "description",
        content:
          "RuralReach Health Assistant helps users understand their health needs and find appropriate care.",
      },
    ],
  }),
  component: Assistant,
});

function Assistant() {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(
    null,
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(
    null,
  );

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const audioChunksRef = useRef<Blob[]>([]);

  const mediaStreamRef =
    useRef<MediaStream | null>(null);

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const audioUrlRef =
    useRef<string | null>(null);

  const [messages, setMessages] =
    useState<ChatMessage[]>([
      {
        role: "assistant",
        content:
          "Hello! I'm the RuralReach Health Assistant. Tell me what you're experiencing, and I'll help you understand what to do next.",
        language: "English",
      },
    ]);

  const stopAssistantPlayback = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    audioRef.current = null;
    setPlayingIndex(null);
  };

  const playAssistantMessage = async (
    text: string,
    language: AssistantLanguage,
    index: number,
  ) => {
    try {
      stopAssistantPlayback();

      setPlayingIndex(index);

      console.log("TTS LANGUAGE:", language);

      const response = await fetch(
        "/api/health-assistant-tts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            language,
          }),
        },
      );

      if (!response.ok) {
        const data =
          await response.json().catch(() => null);

        throw new Error(
          data?.error ||
            "Voice generation failed.",
        );
      }

      const audioBlob =
        await response.blob();

      if (!audioBlob.size) {
        throw new Error(
          "No audio was returned.",
        );
      }

      const audioUrl =
        URL.createObjectURL(audioBlob);

      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);

      audioRef.current = audio;

      audio.onended = () => {
        if (audioUrlRef.current === audioUrl) {
          URL.revokeObjectURL(audioUrl);
          audioUrlRef.current = null;
        }

        if (audioRef.current === audio) {
          audioRef.current = null;
          setPlayingIndex(null);
        }
      };

      audio.onerror = () => {
        if (audioUrlRef.current === audioUrl) {
          URL.revokeObjectURL(audioUrl);
          audioUrlRef.current = null;
        }

        if (audioRef.current === audio) {
          audioRef.current = null;
          setPlayingIndex(null);
        }
      };

      await audio.play();
    } catch (error) {
      console.error(
        "TTS playback error:",
        error,
      );

      setPlayingIndex(null);

      if (audioUrlRef.current) {
        URL.revokeObjectURL(
          audioUrlRef.current,
        );
        audioUrlRef.current = null;
      }

      audioRef.current = null;

      alert(
        "I couldn't play the assistant's voice response. Please try again.",
      );
    }
  };

  const copyAssistantMessage = async (
    text: string,
    index: number,
  ) => {
    try {
      await navigator.clipboard.writeText(
        text,
      );

      setCopiedIndex(index);

      window.setTimeout(() => {
        setCopiedIndex((current) =>
          current === index
            ? null
            : current,
        );
      }, 1500);
    } catch (error) {
      console.error(
        "Copy failed:",
        error,
      );

      alert(
        "I couldn't copy the response. Please try again.",
      );
    }
  };

  const handleSend = async (
    textOverride?: string,
  ) => {
    const trimmedMessage = (
      textOverride ?? message
    ).trim();

    if (!trimmedMessage) return;

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: trimmedMessage,
      },
    ]);

    setMessage("");

    try {
      const response = await fetch(
        "/api/health-assistant",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: trimmedMessage,
          }),
        },
      );

      const data =
        await response.json();

      const supportedLanguages: AssistantLanguage[] =
        [
          "English",
          "Yoruba",
          "Hausa",
          "Igbo",
        ];

      const language: AssistantLanguage =
        supportedLanguages.includes(
          data?.language,
        )
          ? data.language
          : "English";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data?.reply ||
            "Sorry, I couldn't respond right now. Please try again.",
          language,
        },
      ]);
    } catch (error) {
      console.error(
        "Health Assistant request failed:",
        error,
      );

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to the Health Assistant right now.",
          language: "English",
        },
      ]);
    }
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices) {
        alert(
          "Chrome cannot access microphone recording on this page. Please check that you are using a secure connection.",
        );
        return;
      }

      if (!navigator.mediaDevices.getUserMedia) {
        alert(
          "Chrome cannot access the microphone here. Please check your browser microphone permission.",
        );
        return;
      }

      if (typeof MediaRecorder === "undefined") {
        alert(
          "This browser does not support voice recording. Please use the latest version of Google Chrome.",
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      mediaStreamRef.current = stream;

      let mimeType = "";

      const supportedTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ];

      for (const type of supportedTypes) {
        if (
          MediaRecorder.isTypeSupported(type)
        ) {
          mimeType = type;
          break;
        }
      }

      console.log(
        "BROWSER:",
        navigator.userAgent,
      );

      console.log(
        "MEDIA RECORDER SUPPORTED:",
        typeof MediaRecorder !==
          "undefined",
      );

      console.log(
        "SELECTED AUDIO MIME TYPE:",
        mimeType || "browser default",
      );

      const recorder = mimeType
        ? new MediaRecorder(stream, {
            mimeType,
          })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (
        event,
      ) => {
        console.log(
          "AUDIO CHUNK:",
          event.data.size,
        );

        if (event.data.size > 0) {
          audioChunksRef.current.push(
            event.data,
          );
        }
      };

      recorder.onerror = (event) => {
        console.error(
          "MEDIA RECORDER ERROR:",
          event,
        );
      };

      recorder.onstop = async () => {
        stream
          .getTracks()
          .forEach((track) =>
            track.stop(),
          );

        mediaStreamRef.current = null;

        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type:
              recorder.mimeType ||
              "audio/webm",
          },
        );

        console.log(
          "FINAL AUDIO TYPE:",
          audioBlob.type,
        );

        console.log(
          "FINAL AUDIO SIZE:",
          audioBlob.size,
        );

        console.log(
          "TOTAL AUDIO CHUNKS:",
          audioChunksRef.current
            .length,
        );

        if (!audioBlob.size) {
          setIsTranscribing(false);

          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content:
                "No microphone audio was captured. Please check your microphone and try again.",
              language: "English",
            },
          ]);

          return;
        }

        try {
          setIsTranscribing(true);

          const formData =
            new FormData();

          const extension =
            audioBlob.type.includes(
              "mp4",
            )
              ? "m4a"
              : audioBlob.type.includes(
                    "ogg",
                  )
                ? "ogg"
                : "webm";

          formData.append(
            "file",
            new File(
              [audioBlob],
              `voice-note.${extension}`,
              {
                type: audioBlob.type,
              },
            ),
          );

          const response = await fetch(
            "/api/health-assistant-transcribe",
            {
              method: "POST",
              body: formData,
            },
          );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data?.error ||
                "Speech transcription failed.",
            );
          }

          const transcribedText =
            String(
              data?.text || "",
            ).trim();

          console.log(
            "FINAL TRANSCRIPTION:",
            transcribedText,
          );

          if (!transcribedText) {
            setMessages((current) => [
              ...current,
              {
                role: "assistant",
                content:
                  data?.message ||
                  "I couldn't understand the recording. Please try again.",
                language: "English",
              },
            ]);

            return;
          }

          setMessage(
            transcribedText,
          );

          await handleSend(
            transcribedText,
          );
        } catch (error) {
          console.error(
            "Speech-to-text error:",
            error,
          );

          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content:
                "I couldn't transcribe that voice note. Please try again.",
              language: "English",
            },
          ]);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current =
        recorder;

      recorder.start(500);

      console.log(
        "RECORDING STARTED",
      );

      setIsRecording(true);
    } catch (error) {
      console.error(
        "MICROPHONE ERROR:",
        error,
      );

      if (
        error instanceof DOMException &&
        error.name === "NotAllowedError"
      ) {
        alert(
          "Chrome blocked microphone access. Please allow microphone permission for this site and try again.",
        );
      } else if (
        error instanceof DOMException &&
        error.name === "NotFoundError"
      ) {
        alert(
          "Chrome could not find a microphone on this device.",
        );
      } else {
        alert(
          "The microphone could not be started. Please check Chrome's microphone permission.",
        );
      }

      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    const recorder =
      mediaRecorderRef.current;

    if (
      !recorder ||
      recorder.state === "inactive"
    ) {
      setIsRecording(false);
      return;
    }

    console.log(
      "STOPPING RECORDING...",
    );

    recorder.stop();
    setIsRecording(false);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      void handleSend();
    }
  };

  return (
    <AppShell title="Health Assistant">
      <section className="card-surface rise flex min-h-[70vh] flex-col overflow-hidden">
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-primary">
              <Bot
                className="h-6 w-6"
                aria-hidden="true"
              />
            </span>

            <div>
              <h2 className="text-base font-extrabold">
                RuralReach Health Assistant
              </h2>

              <p className="text-xs text-muted-foreground">
                Simple health guidance for your next step
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map(
            (item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    item.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <div>
                    {item.content}
                  </div>

                  {item.role ===
                    "assistant" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {playingIndex ===
                      index ? (
                        <button
                          type="button"
                          onClick={
                            stopAssistantPlayback
                          }
                          aria-label="Stop assistant voice"
                          className="tap inline-flex min-h-10 items-center gap-2 rounded-xl bg-destructive px-3 py-2 text-xs font-extrabold text-destructive-foreground"
                        >
                          <Square
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                          Stop
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            void playAssistantMessage(
                              item.content,
                              item.language ||
                                "English",
                              index,
                            )
                          }
                          disabled={
                            playingIndex !==
                            null
                          }
                          aria-label="Listen to assistant response"
                          className="tap inline-flex min-h-10 items-center gap-2 rounded-xl bg-background px-3 py-2 text-xs font-extrabold text-foreground hover:bg-card disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Volume2
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                          Listen
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          void copyAssistantMessage(
                            item.content,
                            index,
                          )
                        }
                        aria-label="Copy assistant response"
                        className="tap inline-flex min-h-10 items-center gap-2 rounded-xl bg-background px-3 py-2 text-xs font-extrabold text-foreground hover:bg-card"
                      >
                        <Copy
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                        {copiedIndex ===
                        index
                          ? "Copied!"
                          : "Copy"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ),
          )}

          {isTranscribing && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
                Transcribing your voice note...
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="rounded-2xl border border-border bg-background p-2">
            <textarea
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value,
                )
              }
              onKeyDown={handleKeyDown}
              placeholder="Describe what you're experiencing..."
              rows={2}
              className="w-full resize-none border-0 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={
                  isRecording
                    ? stopRecording
                    : () =>
                        void startRecording()
                }
                disabled={isTranscribing}
                aria-label={
                  isRecording
                    ? "Stop recording"
                    : "Record voice note"
                }
                className={`tap inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold ${
                  isRecording
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-secondary text-secondary-foreground"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isRecording ? (
                  <>
                    <Square
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    Voice
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleSend()
                }
                disabled={
                  !message.trim() ||
                  isTranscribing
                }
                className="tap inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-extrabold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                Send
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            This assistant provides general health information
            and does not replace a healthcare professional.
          </p>
        </div>
      </section>
    </AppShell>
  );
}