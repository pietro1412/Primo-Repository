/** Stili vocali → parametri di sintesi (approssimazioni valide per la voce del browser). */
export const VOICE_STYLES = ["CALM", "ENERGETIC", "SHOUT", "WHISPER"] as const;
export type VoiceStyleName = (typeof VOICE_STYLES)[number];

export interface SpeechParams {
  rate: number; // 0.1–10 (1 = normale)
  pitch: number; // 0–2
  volume: number; // 0–1
}

export const STYLE_PARAMS: Record<VoiceStyleName, SpeechParams> = {
  CALM: { rate: 0.85, pitch: 0.9, volume: 0.7 },
  ENERGETIC: { rate: 1.1, pitch: 1.15, volume: 1 },
  SHOUT: { rate: 1, pitch: 1.3, volume: 1 },
  WHISPER: { rate: 0.8, pitch: 0.8, volume: 0.25 },
};

export const STYLE_LABELS: Record<VoiceStyleName, string> = {
  CALM: "Calma",
  ENERGETIC: "Carica",
  SHOUT: "Urla",
  WHISPER: "Sussurro",
};

export function isVoiceStyle(value: string): value is VoiceStyleName {
  return (VOICE_STYLES as readonly string[]).includes(value);
}
