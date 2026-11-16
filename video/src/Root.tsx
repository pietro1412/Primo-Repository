import {Composition} from 'remotion';
import {CryptoRecap} from './CryptoRecap';
import timing from './timing.json';

export const Root = () => (
  <Composition id="CryptoRecap" component={CryptoRecap} durationInFrames={timing.totalFrames} fps={timing.fps} width={1080} height={1920} />
);
