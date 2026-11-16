import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {concepts, recap} from './data';
import timing from './timing.json';

const BG = '#0b1020', CARD = '#151c33', GREEN = '#22c55e', RED = '#ef4444', MUTED = '#8b93a7', ACCENT = '#f7931a';
const font = 'system-ui, -apple-system, Segoe UI, sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const prog = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

type SceneT = (typeof timing.scenes)[number];

/* ---------- Sovrimpressioni ---------- */
const ConceptCard: React.FC<{id: string; frames: number}> = ({id, frames}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = concepts[id];
  const s = spring({frame: f - 14, fps, config: {damping: 16}});
  const out = interpolate(f, [frames - 20, frames - 6], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1130, opacity: s * out, transform: `translateY(${(1 - s) * 60}px)`,
      background: CARD, borderLeft: `10px solid ${ACCENT}`, borderRadius: 28, padding: '32px 40px', boxShadow: '0 20px 60px rgba(0,0,0,.45)'}}>
      <div style={{fontSize: 26, letterSpacing: 4, color: ACCENT, fontWeight: 700}}>{c.label}</div>
      <div style={{fontSize: 56, fontWeight: 800, color: '#fff', margin: '8px 0 10px', lineHeight: 1.1}}>{c.title}</div>
      <div style={{fontSize: 34, color: '#c5cbe0', lineHeight: 1.3}}>{c.text}</div>
    </div>
  );
};

const Subtitles: React.FC<{sentences: SceneT['sentences']}> = ({sentences}) => {
  const f = useCurrentFrame();
  const t = (f - timing.lead) / timing.fps;
  const cur = sentences.find((s) => t >= s.start - 0.05 && t <= s.end + 0.2);
  if (!cur) return null;
  const o = interpolate(t, [cur.start - 0.05, cur.start + 0.15], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1500, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: o}}>
      <div style={{background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: 44, fontWeight: 600, lineHeight: 1.3, textAlign: 'center', padding: '24px 36px', borderRadius: 24}}>
        {cur.text}
      </div>
    </div>
  );
};

const Callout: React.FC<{x: number; y: number; text: string; at: number; align?: 'left' | 'right'; color?: string}> = ({x, y, text, at, align = 'left', color = '#fff'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 12}});
  return (
    <g opacity={s} transform={`translate(${x},${y}) scale(${0.6 + 0.4 * s})`}>
      <circle r={14} fill={color} /><circle r={26} fill="none" stroke={color} strokeWidth={4} opacity={0.5} />
      <text x={align === 'left' ? 40 : -40} y={10} textAnchor={align === 'left' ? 'start' : 'end'} fill="#fff" fontSize={36} fontWeight={700} fontFamily={font}
        style={{paintOrder: 'stroke', stroke: BG, strokeWidth: 8}}>{text}</text>
    </g>
  );
};

/* ---------- Scene ---------- */
const Header: React.FC<{title: string}> = ({title}) => (
  <div style={{position: 'absolute', top: 90, left: 70, right: 70, fontFamily: font, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
    <div style={{fontSize: 34, color: MUTED, letterSpacing: 3, fontWeight: 700}}>₿ CRYPTO WEEKLY RECAP</div>
    <div style={{fontSize: 34, color: '#fff', fontWeight: 700}}>{title}</div>
  </div>
);

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 14}});
  const rot = interpolate(f, [0, 60], [-180, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{fontFamily: font, alignItems: 'center', paddingTop: 280}}>
      <div style={{transform: `scale(${s}) rotate(${rot}deg)`, fontSize: 280, color: ACCENT, lineHeight: 1}}>₿</div>
      <div style={{opacity: s, fontSize: 96, fontWeight: 800, color: '#fff', textAlign: 'center', marginTop: 30, lineHeight: 1.05}}>{recap.title}</div>
      <div style={{opacity: prog(f, 20, 40), fontSize: 40, color: MUTED, marginTop: 24}}>{recap.subtitle}</div>
    </AbsoluteFill>
  );
};

const Bitcoin: React.FC = () => {
  const f = useCurrentFrame();
  const W = 940, H = 560, d = recap.btc;
  const min = Math.min(...d), max = Math.max(...d);
  const pts = d.map((v, i) => [(i / (d.length - 1)) * W, H - ((v - min) / (max - min)) * (H - 60) - 30] as const);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const p = prog(f, 14, 130);
  const price = Math.round(interpolate(p, [0, 1], [d[0], d[d.length - 1]]));
  const pct = ((d[d.length - 1] - d[0]) / d[0]) * 100;
  const lows = [0, 2, 5, 8].map((i) => pts[i]);
  const trend = prog(f, 150, 190);
  return (
    <AbsoluteFill style={{fontFamily: font, color: '#fff'}}>
      <Header title="Bitcoin · 7 giorni" />
      <div style={{position: 'absolute', top: 190, left: 70}}>
        <div style={{fontSize: 118, fontWeight: 800}}>${price.toLocaleString('en-US')}</div>
        <div style={{fontSize: 54, color: GREEN, opacity: p}}>▲ +{(pct * p).toFixed(1)}%</div>
      </div>
      <svg width={W} height={H} style={{position: 'absolute', top: 500, left: 70, overflow: 'visible'}}>
        <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={ACCENT} stopOpacity=".35" /><stop offset="1" stopColor={ACCENT} stopOpacity="0" /></linearGradient>
          <clipPath id="c"><rect x="0" y="-50" width={W * p} height={H + 100} /></clipPath></defs>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke="#ffffff14" strokeWidth={2} />)}
        <g clipPath="url(#c)">
          <path d={`${path} L${W},${H} L0,${H} Z`} fill="url(#g)" />
          <path d={path} fill="none" stroke={ACCENT} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <line x1={lows[0][0]} y1={lows[0][1]} x2={lows[0][0] + (lows[3][0] - lows[0][0]) * trend} y2={lows[0][1] + (lows[3][1] - lows[0][1]) * trend}
          stroke="#fff" strokeWidth={5} strokeDasharray="16 14" opacity={0.9} />
        <Callout x={pts[0][0]} y={pts[0][1]} text={`Minimo $${d[0].toLocaleString('en-US')}`} at={40} color={RED} />
        <Callout x={pts[9][0]} y={pts[9][1]} text={`Massimo $${d[9].toLocaleString('en-US')}`} at={135} align="right" color={GREEN} />
        <g opacity={trend}><text x={W / 2 - 40} y={H - 10} fill="#fff" fontSize={34} fontWeight={700} fontFamily={font} style={{paintOrder: 'stroke', stroke: BG, strokeWidth: 8}}>↗ minimi crescenti</text></g>
      </svg>
    </AbsoluteFill>
  );
};

const Dominance: React.FC = () => {
  const f = useCurrentFrame();
  const R = 250, SW = 110, C = 2 * Math.PI * R;
  const p = prog(f, 12, 110);
  let acc = 0;
  const btcShown = Math.round(recap.dominance[0].value * p);
  return (
    <AbsoluteFill style={{fontFamily: font, color: '#fff'}}>
      <Header title="Dominance di mercato" />
      <svg width={640} height={640} viewBox="-320 -320 640 640" style={{position: 'absolute', top: 230, left: 220}}>
        <g transform="rotate(-90)">
          {recap.dominance.map((s) => {
            const len = (s.value / 100) * C * p;
            const el = <circle key={s.name} r={R} fill="none" stroke={s.color} strokeWidth={SW} strokeDasharray={`${Math.max(0, len - 4)} ${C}`} strokeDashoffset={-acc * C * p} />;
            acc += s.value / 100;
            return el;
          })}
        </g>
        <text textAnchor="middle" y={30} fontSize={120} fontWeight={800} fill="#fff" fontFamily={font}>{btcShown}%</text>
        <text textAnchor="middle" y={85} fontSize={38} fill={MUTED} fontFamily={font}>Bitcoin</text>
      </svg>
      <div style={{position: 'absolute', top: 900, left: 130, right: 130, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 40px'}}>
        {recap.dominance.map((s, i) => {
          const o = prog(f, 40 + i * 10, 60 + i * 10);
          return <div key={s.name} style={{opacity: o, display: 'flex', alignItems: 'center', fontSize: 38}}>
            <span style={{width: 28, height: 28, borderRadius: 8, background: s.color, marginRight: 16}} />
            <span style={{flex: 1}}>{s.name}</span><b>{Math.round(s.value * p)}%</b></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Movers: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{fontFamily: font, color: '#fff'}}>
      <Header title="Top movers" />
      <div style={{position: 'absolute', top: 220, left: 70, right: 70}}>
        {recap.movers.map((m, i) => {
          const s = spring({frame: f - 10 - i * 14, fps, config: {damping: 15}});
          const up = m.change >= 0, val = interpolate(s, [0, 1], [0, m.change]);
          return (
            <div key={m.symbol} style={{opacity: s, transform: `translateX(${(1 - s) * 200}px)`, background: CARD, borderRadius: 32, padding: '34px 44px', marginBottom: 30, overflow: 'hidden', position: 'relative'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div><div style={{fontSize: 60, fontWeight: 800}}>{m.symbol}</div><div style={{fontSize: 32, color: MUTED}}>{m.name}</div></div>
                <div style={{fontSize: 72, fontWeight: 800, color: up ? GREEN : RED}}>{up ? '▲ +' : '▼ '}{val.toFixed(1)}%</div>
              </div>
              <div style={{height: 12, borderRadius: 6, background: '#ffffff14', marginTop: 24}}>
                <div style={{height: 12, borderRadius: 6, width: `${Math.min(100, Math.abs(m.change) * 6) * s}%`, background: up ? GREEN : RED}} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const arc = (cx: number, cy: number, r: number, v0: number, v1: number) => {
  const a = (v: number) => Math.PI * (1 - v / 100);
  const pt = (v: number) => `${cx + r * Math.cos(a(v))},${cy - r * Math.sin(a(v))}`;
  return `M${pt(v0)} A${r},${r} 0 0 1 ${pt(v1)}`;
};

const Fear: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 20, fps, config: {damping: 12, mass: 1.4}});
  const v = recap.fearGreed * Math.min(1.08, s);
  const zones = [{a: 0, b: 25, c: '#ef4444'}, {a: 25, b: 45, c: '#f97316'}, {a: 45, b: 55, c: '#eab308'}, {a: 55, b: 75, c: '#84cc16'}, {a: 75, b: 100, c: '#22c55e'}];
  const cx = 470, cy = 430, r = 350;
  return (
    <AbsoluteFill style={{fontFamily: font, color: '#fff'}}>
      <Header title="Sentiment di mercato" />
      <svg width={940} height={700} style={{position: 'absolute', top: 230, left: 70}}>
        {zones.map((z) => <path key={z.a} d={arc(cx, cy, r, z.a + 0.6, z.b - 0.6)} stroke={z.c} strokeWidth={70} fill="none" opacity={prog(f, 5, 30)} />)}
        <text x={cx - r} y={cy + 70} textAnchor="middle" fill={RED} fontSize={36} fontWeight={700} fontFamily={font}>Paura</text>
        <text x={cx + r} y={cy + 70} textAnchor="middle" fill={GREEN} fontSize={36} fontWeight={700} fontFamily={font}>Avidità</text>
        <g transform={`rotate(${v * 1.8} ${cx} ${cy})`}>
          <line x1={cx} y1={cy} x2={cx - r + 40} y2={cy} stroke="#fff" strokeWidth={14} strokeLinecap="round" />
        </g>
        <circle cx={cx} cy={cy} r={32} fill="#fff" />
        <text x={cx} y={cy + 190} textAnchor="middle" fill="#fff" fontSize={140} fontWeight={800} fontFamily={font}>{Math.round(v)}</text>
      </svg>
      <div style={{position: 'absolute', top: 940, left: 0, right: 0, textAlign: 'center', fontSize: 60, fontWeight: 800, color: '#84cc16', opacity: prog(f, 70, 95)}}>AVIDITÀ</div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = ['Dati reali via API (es. CoinGecko)', 'Aggiornamento automatico ogni giorno', 'Formati: verticale, quadrato, orizzontale', 'Voce, musica e sottotitoli inclusi'];
  return (
    <AbsoluteFill style={{fontFamily: font, color: '#fff', alignItems: 'center', paddingTop: 200}}>
      <div style={{fontSize: 200, color: ACCENT, lineHeight: 1, transform: `scale(${spring({frame: f, fps, config: {damping: 12}})})`}}>₿</div>
      <div style={{fontSize: 70, fontWeight: 800, marginTop: 20, opacity: prog(f, 8, 28)}}>Generato con Remotion</div>
      <div style={{marginTop: 50, width: 880}}>
        {items.map((t, i) => {
          const s = spring({frame: f - 24 - i * 14, fps, config: {damping: 15}});
          return <div key={t} style={{opacity: s, transform: `translateX(${(1 - s) * 80}px)`, fontSize: 38, marginBottom: 20, display: 'flex'}}>
            <span style={{color: GREEN, marginRight: 20}}>✓</span>{t}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const views: Record<string, React.FC> = {intro: Intro, bitcoin: Bitcoin, dominance: Dominance, movers: Movers, fear: Fear, outro: Outro};

const SceneWrap: React.FC<{scene: SceneT}> = ({scene}) => {
  const f = useCurrentFrame();
  const View = views[scene.id];
  const o = interpolate(f, [0, 10, scene.frames - 10, scene.frames], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <View />
      <ConceptCard id={scene.id} frames={scene.frames} />
      <Subtitles sentences={scene.sentences} />
      <Sequence from={timing.lead}><Audio src={staticFile(scene.audio)} /></Sequence>
    </AbsoluteFill>
  );
};

export const CryptoRecap: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{fontFamily: font, background: `radial-gradient(circle at 50% 20%, #17203f 0%, ${BG} 70%)`}}>
      <Audio src={staticFile('audio/music.mp3')} volume={(f) => 0.22 * interpolate(f, [0, 45], [0, 1], clamp)} />
      {timing.scenes.map((s) => {
        const el = <Sequence key={s.id} from={from} durationInFrames={s.frames}><SceneWrap scene={s} /></Sequence>;
        from += s.frames;
        return el;
      })}
      <div style={{position: 'absolute', bottom: 60, left: 0, right: 0, textAlign: 'center', fontFamily: font, fontSize: 26, color: MUTED}}>Dati dimostrativi · Non è consulenza finanziaria</div>
    </AbsoluteFill>
  );
};
