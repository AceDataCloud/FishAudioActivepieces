import { createAction, Property } from '@activepieces/pieces-framework';

import { fishAudioAuth } from '../auth';
import { fishAudioClient } from '../common/client';

export const getTask = createAction({
  name: 'get_task',
  displayName: 'Get Fish Audio task',
  description: 'Retrieve one existing task ID. Pending previews are not final audio.',
  auth: fishAudioAuth,
  props: {
    taskId: Property.ShortText({
      displayName: 'Task ID',
      description: 'Map the task_id output from Synthesize Fish Audio speech. Query this same ID until it succeeds or fails.',
      required: true,
    }),
  },
  async run(context) {
    const taskId = context.propsValue.taskId.trim();
    if (!taskId) {
      throw new Error('A task ID is required.');
    }
    const response = await fishAudioClient.post({
      token: context.auth.secret_text,
      path: '/fish/tasks',
      body: { id: taskId },
    });
    return fishAudioClient.normalizeTask({ body: response, taskId });
  },
});
