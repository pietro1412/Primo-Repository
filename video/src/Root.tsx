import {Composition} from 'remotion';
import {CryptoRecap} from './CryptoRecap';

export const Root = () => (
  <Composition id="CryptoRecap" component={CryptoRecap} durationInFrames={300} fps={30} width={1080} height={1920} />
);
