import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {recap} from './data';

const BG = '#0b1020', GREEN = '#22c55e', RED = '#ef4444', MUTED = '#8b93a7', ACCENT = '#f7931a';
const font = 'system-ui, -apple-system, Segoe UI, sans-serif';

const Title: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: font}}>
      <div style={{transform: `scale(${s})`, opacity: s, textAlign: 'center'}}>
        <div style={{fontSize: 140}}>₿</div>
        <div style={{fontSize: 92, fontWeight: 800, color: '#fff'}}>{recap.title}</div>
        <div style={{fontSize: 40, color: MUTED, marginTop: 20}}>{recap.subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};

const Chart: React.FC = () => {
  const f = useCurrentFrame();
  const W = 920, H = 700;
  const d = recap.btc;
  const min = Math.min(...d), max = Math.max(...d);
  const pts = d.map((v, i) => [(i / (d.length - 1)) * W, H - ((v - min) / (max - min)) * (H - 40) - 20]);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const progress = interpolate(f, [10, 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const price = Math.round(interpolate(progress, [0, 1], [d[0], d[d.length - 1]]));
  const pct = ((d[d.length - 1] - d[0]) / d[0]) * 100;
  const LEN = 3000;
  return (
    <AbsoluteFill style={{padding: 80, fontFamily: font, color: '#fff'}}>
      <div style={{fontSize: 44, color: MUTED, marginTop: 120}}>Bitcoin · 7 giorni</div>
      <div style={{fontSize: 130, fontWeight: 800}}>${price.toLocaleString('en-US')}</div>
      <div style={{fontSize: 56, color: GREEN, opacity: progress}}>▲ +{(pct * progress).toFixed(1)}%</div>
      <svg width={W} height={H} style={{marginTop: 80}}>
        <path d={path} fill="none" stroke={ACCENT} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={LEN} strokeDashoffset={LEN * (1 - progress)} pathLength={LEN} />
      </svg>
    </AbsoluteFill>
  );
};

const Movers: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{padding: 80, fontFamily: font, color: '#fff'}}>
      <div style={{fontSize: 70, fontWeight: 800, marginTop: 160, marginBottom: 60}}>Top movers</div>
      {recap.movers.map((m, i) => {
        const s = spring({frame: f - i * 12, fps, config: {damping: 15}});
        const up = m.change >= 0;
        const val = interpolate(s, [0, 1], [0, m.change]);
        return (
          <div key={m.symbol} style={{opacity: s, transform: `translateX(${(1 - s) * 200}px)`, background: '#151c33', borderRadius: 36, padding: '48px 56px', marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div style={{fontSize: 64, fontWeight: 800}}>{m.symbol}</div>
              <div style={{fontSize: 34, color: MUTED}}>{m.name}</div>
            </div>
            <div style={{fontSize: 80, fontWeight: 800, color: up ? GREEN : RED}}>{up ? '▲' : '▼'} {val.toFixed(1)}%</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', bottom: 90, left: 80, right: 80, fontSize: 28, color: MUTED}}>Dati dimostrativi. Non è consulenza finanziaria.</div>
    </AbsoluteFill>
  );
};

export const CryptoRecap: React.FC = () => (
  <AbsoluteFill style={{background: BG}}>
    <Sequence from={0} durationInFrames={75}><Title /></Sequence>
    <Sequence from={75} durationInFrames={105}><Chart /></Sequence>
    <Sequence from={180} durationInFrames={120}><Movers /></Sequence>
  </AbsoluteFill>
);
