#!/usr/bin/env python3
"""Genera voce narrante (Kokoro TTS neurale, voce it "if_sara"), musica di sottofondo e src/timing.json.
Requisiti: ffmpeg ; pip install numpy kokoro-onnx soundfile
Modelli (non nel repo, ~350MB) in $KOKORO_DIR (default /tmp/claude-0/kokoro):
  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin"""
import json, subprocess, os, wave, tempfile
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

KDIR = os.environ.get('KOKORO_DIR', '/tmp/claude-0/kokoro')
TTS = Kokoro(f'{KDIR}/kokoro-v1.0.onnx', f'{KDIR}/voices-v1.0.bin')
VOICE = os.environ.get('VOICE', 'if_sara')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'audio')
os.makedirs(OUT, exist_ok=True)
FPS, GAP, LEAD, TAIL = 30, 0.35, 12, 24  # gap tra frasi (s), frame prima/dopo la voce

SCENES = [
 ('intro', ["Benvenuti al recap settimanale delle criptovalute.",
            "In pochi istanti vediamo cosa è successo al mercato."]),
 ('bitcoin', ["Bitcoin ha chiuso la settimana a settantaduemila e quattrocento dollari, in rialzo di quasi tredici per cento.",
              "Il grafico mostra un trend rialzista: i minimi e i massimi sono sempre più alti."]),
 ('dominance', ["La dominance misura il peso di ogni moneta sul valore totale del mercato.",
                "Bitcoin ne vale più della metà, ed Ethereum è la seconda."]),
 ('movers', ["Tra le principali, Solana guida con quasi più quattordici per cento, seguita da Ethereum.",
             "Ripple è l'unica in calo.",
             "La variazione percentuale indica quanto un prezzo è cambiato in un periodo."]),
 ('fear', ["L'indice di paura e avidità riassume il sentimento degli investitori.",
           "Oggi segna sessantacinque: avidità.",
           "Valori alti possono precedere correzioni, quindi serve cautela."]),
 ('outro', ["Questo è solo un esempio: con Remotion lo stesso video si genera in automatico, con dati reali.",
            "Non è consulenza finanziaria."]),
]

def dur(p):
    return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',p]).decode())

timing = {'fps': FPS, 'lead': LEAD, 'scenes': []}
tmp = tempfile.mkdtemp()
for sid, sentences in SCENES:
    parts, sents, t = [], [], 0.0
    for i, s in enumerate(sentences):
        raw = f'{tmp}/{sid}{i}.wav'
        a, sr = TTS.create(s, voice=VOICE, speed=1.05, lang='it'); sf.write(raw, a, sr)
        norm = f'{tmp}/{sid}{i}n.wav'
        subprocess.run(['ffmpeg','-y','-v','error','-i',raw,'-ar','44100','-ac','2','-af','loudnorm=I=-16:TP=-1.5','-t','60',norm], check=True)
        d = dur(norm)
        sents.append({'text': s, 'start': round(t,3), 'end': round(t+d,3)})
        parts.append(norm); t += d + GAP
    # concat con silenzi
    lst = f'{tmp}/{sid}.txt'
    sil = f'{tmp}/sil.wav'
    subprocess.run(['ffmpeg','-y','-v','error','-f','lavfi','-i',f'anullsrc=r=44100:cl=stereo','-t',str(GAP),sil], check=True)
    with open(lst,'w') as f:
        for i,p in enumerate(parts):
            f.write(f"file '{p}'\n")
            if i < len(parts)-1: f.write(f"file '{sil}'\n")
    out = f'{OUT}/{sid}.mp3'
    subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',lst,'-c:a','libmp3lame','-b:a','128k',out], check=True)
    total = sents[-1]['end']
    frames = LEAD + int(np.ceil(total*FPS)) + TAIL
    timing['scenes'].append({'id': sid, 'frames': frames, 'audio': f'audio/{sid}.mp3', 'sentences': sents})

total_frames = sum(s['frames'] for s in timing['scenes'])
timing['totalFrames'] = total_frames
json.dump(timing, open(f'{ROOT}/src/timing.json','w'), ensure_ascii=False, indent=1)

# --- musica: pad + arpeggio, progressione Am-F-C-G, loop sull'intera durata ---
SR = 44100
secs = total_frames / FPS + 1
n = int(SR*secs); t = np.arange(n)/SR
def hz(m): return 440*2**((m-69)/12)
chords = [[57,60,64],[53,57,60],[48,52,55],[55,59,62]]  # Am F C G
bar = 4.0
mix = np.zeros(n)
for b in range(int(secs//bar)+1):
    ch = chords[b % 4]; s0 = int(b*bar*SR); L = int(bar*SR)
    seg_t = np.arange(min(L, n-s0))/SR
    if len(seg_t)==0: break
    env = np.minimum(1, seg_t/1.2) * np.minimum(1, (bar-seg_t)/1.0).clip(0,1)
    pad = sum(np.sin(2*np.pi*hz(m)*seg_t)+0.3*np.sin(2*np.pi*hz(m)*2*seg_t) for m in ch) * env * 0.12
    bass = np.sin(2*np.pi*hz(ch[0]-12)*seg_t) * env * 0.22
    arp = np.zeros_like(seg_t)
    for k in range(8):  # 8 note per battuta
        note = ch[k%3] + 12*(1 + (k%2))
        st = k*bar/8; m = seg_t >= st; x = seg_t[m]-st
        arp[m] += np.sin(2*np.pi*hz(note)*x) * np.exp(-x*5) * 0.10
    mix[s0:s0+len(seg_t)] += pad + bass + arp
mix *= np.minimum(1, t/2) * np.minimum(1, (secs-t)/2.5).clip(0,1)
mix = mix/np.max(np.abs(mix))*0.8
st = np.stack([mix, np.roll(mix, 300)], 1)  # leggero effetto stereo
wavp = f'{tmp}/music.wav'
with wave.open(wavp,'w') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st*32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg','-y','-v','error','-i',wavp,'-af','lowpass=f=5000','-c:a','libmp3lame','-b:a','128k',f'{OUT}/music.mp3'], check=True)
print('frames', total_frames, 'sec', total_frames/FPS)
