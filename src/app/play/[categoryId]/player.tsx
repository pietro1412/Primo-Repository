"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserSpeechEngine, FakeSpeechEngine, type SpeechEngine } from "@/lib/speech/engine";
import { nextIndex } from "@/domain/mantra/playlist";
import { canStartPhrase } from "@/domain/mantra/session";
import {
  STYLE_LABELS,
  STYLE_PARAMS,
  VOICE_STYLES,
  type VoiceStyleName,
} from "@/domain/mantra/styles";
import { endSessionAction, recordPlaysAction, startSessionAction } from "../actions";

interface Props {
  categoryId: string;
  categoryName: string;
  mantras: { id: string; text: string }[];
  totals: { total: number; today: number };
}

const FLUSH_EVERY = 5;
const ERRORS: Record<string, string> = {
  NO_MANTRAS: "Questa categoria non ha mantra.",
  INVALID_MINUTES: "Durata non valida (1–120 minuti).",
  INVALID_PAUSE: "Pausa non valida (0–60 secondi).",
};

const localDay = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export function Player({ categoryId, categoryName, mantras, totals }: Props) {
  const [style, setStyle] = useState<VoiceStyleName>("CALM");
  const [minutes, setMinutes] = useState(5);
  const [pauseSeconds, setPauseSeconds] = useState(3);
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState<string>("");
  const [sessionPlays, setSessionPlays] = useState(0);
  const [saved, setSaved] = useState(totals);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(0);

  const stopRef = useRef(false);
  const engineRef = useRef<SpeechEngine | null>(null);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);

  useEffect(
    () => () => {
      stopRef.current = true;
      engineRef.current?.cancel();
    },
    [],
  );

  function createEngine(): SpeechEngine | null {
    const fake = new URLSearchParams(window.location.search).get("engine") === "fake";
    if (fake) return new FakeSpeechEngine();
    return BrowserSpeechEngine.isSupported() ? new BrowserSpeechEngine() : null;
  }

  async function start() {
    setError(null);
    const engine = createEngine();
    if (!engine) {
      setError("Il tuo browser non supporta la sintesi vocale.");
      return;
    }
    engineRef.current = engine;
    const res = await startSessionAction({ categoryId, style, minutes, pauseSeconds });
    if (!res.ok) {
      setError(ERRORS[res.error] ?? "Impossibile avviare la sessione.");
      return;
    }
    const sessionId = res.value;
    stopRef.current = false;
    setRunning(true);
    setSessionPlays(0);

    try {
      const nav = navigator as Navigator & {
        wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> };
      };
      wakeLockRef.current = (await nav.wakeLock?.request("screen")) ?? null;
    } catch {
      /* il wake lock è facoltativo */
    }
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: categoryName,
        artist: "Mantra",
      });
      navigator.mediaSession.setActionHandler("pause", () => stop());
      navigator.mediaSession.setActionHandler("stop", () => stop());
    }

    const params = STYLE_PARAMS[style];
    const counts = new Map<string, number>();
    let pending = 0;
    const flush = async () => {
      if (pending === 0) return;
      const plays = [...counts].map(([mantraId, count]) => ({ mantraId, count }));
      counts.clear();
      const n = pending;
      pending = 0;
      const r = await recordPlaysAction(sessionId, localDay(), plays);
      if (r.ok) setSaved((s) => ({ total: s.total + n, today: s.today + n }));
    };

    const startedAt = Date.now();
    let prev: number | null = null;
    while (!stopRef.current && canStartPhrase(Date.now() - startedAt, minutes)) {
      prev = nextIndex(prev, mantras.length);
      const m = mantras[prev]!;
      setCurrent(m.text);
      const completed = await engine.speak(m.text, params);
      if (completed) {
        // R5: si conta solo la frase pronunciata fino in fondo
        counts.set(m.id, (counts.get(m.id) ?? 0) + 1);
        pending++;
        setSessionPlays((n) => n + 1);
        if (pending >= FLUSH_EVERY) await flush();
      }
      setRemaining(Math.max(0, Math.ceil((minutes * 60_000 - (Date.now() - startedAt)) / 1000)));
      const pauseEnd = Date.now() + pauseSeconds * 1000;
      while (!stopRef.current && Date.now() < pauseEnd) {
        await new Promise((r) => setTimeout(r, Math.min(200, pauseEnd - Date.now())));
      }
    }

    await flush();
    await endSessionAction(sessionId);
    await wakeLockRef.current?.release().catch(() => {});
    wakeLockRef.current = null;
    setCurrent("");
    setRunning(false);
  }

  function stop() {
    stopRef.current = true;
    engineRef.current?.cancel();
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600" data-testid="totals">
        Riproduzioni: oggi {saved.today} · totali {saved.total}
      </p>

      {!running ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void start();
          }}
          className="max-w-sm space-y-3"
        >
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Stile</span>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as VoiceStyleName)}
              className="w-full rounded border px-3 py-2"
            >
              {VOICE_STYLES.map((s) => (
                <option key={s} value={s}>
                  {STYLE_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Durata (minuti)</span>
            <input
              type="number"
              min={1}
              max={120}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full rounded border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Pausa tra le frasi (secondi)</span>
            <input
              type="number"
              min={0}
              max={60}
              value={pauseSeconds}
              onChange={(e) => setPauseSeconds(Number(e.target.value))}
              className="w-full rounded border px-3 py-2"
            />
          </label>
          <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            Avvia
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <p className="text-2xl font-semibold" aria-live="polite" data-testid="current">
            {current}
          </p>
          <p className="text-sm text-gray-600" data-testid="session-plays">
            In questa sessione: {sessionPlays} · restano {remaining}s
          </p>
          <button onClick={stop} className="rounded border px-4 py-2">
            Ferma
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
