import { createPiece } from '@activepieces/pieces-framework';

import { synthesizeSpeech } from './lib/actions/synthesize-speech';
import { getTask } from './lib/actions/get-task';
import { fishAudioAuth } from './lib/auth';

export const fishAudio = createPiece({
  displayName: 'Fish Audio by Ace Data Cloud',
  description: 'Synthesize Fish Audio speech and retrieve the same task through Ace Data Cloud.',
  logoUrl: 'https://cdn.acedata.cloud/assets/logo.png',
  authors: ['Ace Data Cloud'],
  minimumSupportedRelease: '0.92.2',
  auth: fishAudioAuth,
  actions: [synthesizeSpeech, getTask],
  triggers: [],
});
