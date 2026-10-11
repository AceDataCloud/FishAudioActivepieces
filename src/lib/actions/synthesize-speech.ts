import { createAction, Property } from '@activepieces/pieces-framework';

import { fishAudioAuth } from '../auth';
import { fishAudioClient } from '../common/client';

export const synthesizeSpeech = createAction({
  name: 'synthesize_speech',
  displayName: 'Synthesize Fish Audio speech',
  description: 'Submit one text-to-speech request. Async responses return a task ID; a direct audio response is already final.',
  auth: fishAudioAuth,
  props: {
    text: Property.LongText({
      displayName: 'Text to speak',
      description: 'Words to synthesize. Billing depends on the text length.',
      required: true,
    }),
    model: Property.StaticDropdown({
      displayName: 'Engine',
      description: 'Sent in the model request header, not the JSON body.',
      required: true,
      defaultValue: 's2-pro',
      options: { options: [
        { label: 'S2 Pro', value: 's2-pro' },
        { label: 'S2.1 Pro', value: 's2.1-pro' },
        { label: 'S1', value: 's1' },
      ] },
    }),
    format: Property.StaticDropdown({
      displayName: 'Audio format',
      required: true,
      defaultValue: 'mp3',
      options: { options: [
        { label: 'MP3', value: 'mp3' },
        { label: 'WAV', value: 'wav' },
      ] },
    }),
    referenceId: Property.ShortText({
      displayName: 'Reference voice ID',
      description: 'Optional public or saved Fish voice model ID.',
      required: false,
    }),
  },
  async run(context) {
    const { text, model, format, referenceId } = context.propsValue;
    if (!text.trim()) {
      throw new Error('Text to speak is required.');
    }
    const response = await fishAudioClient.post({
      token: context.auth.secret_text,
      path: '/fish/tts',
      model,
      body: {
        text,
        format,
        ...(referenceId?.trim() ? { reference_id: referenceId.trim() } : {}),
        async: true,
        callback_url: 'https://api.acedata.cloud/health',
      },
    });
    const taskId = fishAudioClient.taskIdFromSubmission(response);
    if (taskId) {
      return { task_id: taskId, status: 'pending', success: false, media_urls: [] };
    }
    const direct = response !== null && typeof response === 'object' && !Array.isArray(response)
      ? (response as Record<string, unknown>).audio_url : undefined;
    if (typeof direct === 'string' && direct.startsWith('https://')) {
      return { task_id: '', status: 'succeeded', success: true, media_urls: [direct] };
    }
    throw new Error('No task ID or final audio URL was returned. Inspect request history before submitting again.');
  },
});
