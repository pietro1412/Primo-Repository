import type { SpeechParams } from "@/domain/mantra/styles";

/**
 * Interfaccia di sintesi vocale. Oggi: voce del browser. In futuro: TTS cloud (B-014)
 * senza toccare player e dominio.
 */
export interface SpeechEngine {
  /** Pronuncia il testo. Risolve `true` se completata, `false` se interrotta/non riuscita. */
  speak(text: string, params: SpeechParams): Promise<boolean>;
  cancel(): void;
}

/** Engine silenzioso per test e2e e per ambienti senza sintesi vocale (`?engine=fake`). */
export class FakeSpeechEngine implements SpeechEngine {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private resolveCurrent: ((ok: boolean) => void) | null = null;

  speak(): Promise<boolean> {
    return new Promise((resolve) => {
      this.resolveCurrent = resolve;
      this.timer = setTimeout(() => {
        this.resolveCurrent = null;
        resolve(true);
      }, 20);
    });
  }

  cancel() {
    if (this.timer) clearTimeout(this.timer);
    this.resolveCurrent?.(false);
    this.resolveCurrent = null;
  }
}

export class BrowserSpeechEngine implements SpeechEngine {
  private lang: string;
  constructor(lang = "it-IT") {
    this.lang = lang;
  }

  static isSupported() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  speak(text: string, params: SpeechParams): Promise<boolean> {
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = this.lang;
      u.rate = params.rate;
      u.pitch = params.pitch;
      u.volume = params.volume;
      u.onend = () => resolve(true);
      u.onerror = () => resolve(false);
      window.speechSynthesis.speak(u);
    });
  }

  cancel() {
    window.speechSynthesis.cancel();
  }
}
