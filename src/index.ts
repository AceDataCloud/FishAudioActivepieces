import { createPiece } from '@activepieces/pieces-framework';

import { synthesizeSpeech } from './lib/actions/synthesize-speech';
import { getTask } from './lib/actions/get-task';
import { fishAudioAuth } from './lib/auth';

export const fishAudio = createPiece({
  displayName: 'Fish Audio',
  description: 'Synthesize Fish Audio speech and retrieve the same task through Ace Data Cloud.',
  logoUrl: 'https://raw.githubusercontent.com/AceDataCloud/FishAudioDify/4d11caa5b9a03d10758a219b6ab61826f5699722/_assets/icon.png',
  authors: ['Ace Data Cloud'],
  minimumSupportedRelease: '0.92.2',
  auth: fishAudioAuth,
  actions: [synthesizeSpeech, getTask],
  triggers: [],
});
