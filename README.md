# Fish Audio for Activepieces

Synthesize speech through Ace Data Cloud and retrieve an asynchronous Fish Audio task by the **same task ID**. The Piece has **Synthesize Fish Audio speech** and **Get Fish Audio task** actions. [中文指南](README.zh-CN.md)

**Distribution:** Install `@acedatacloud/piece-fish-audio@0.1.0` as a custom Piece in your Activepieces instance. A public npm package does not automatically enter the shared Activepieces catalog.

## Install and connect

In Activepieces 0.92.2+, open **Platform Admin → Catalogue → Pieces → Install Piece → NPM Registry**. Enter `@acedatacloud/piece-fish-audio` and version `0.1.0`. Search for **Fish Audio by Ace Data Cloud** when adding a flow action, then check the Ace Data Cloud logo and both actions.

Create a connection using an Ace Data Cloud API key with access to `/fish/tts` and `/fish/tasks`. Enter only the key, without `Bearer `. Keep it in the connection, never in a flow export. Check current [pricing](https://platform.acedata.cloud/models) and balance before synthesis.

## First flow

1. Add **Synthesize Fish Audio speech**. Enter the text, select `s2-pro` and `mp3`, and optionally enter a saved or public **Reference voice ID**. The Piece sends the model in the `model` request header, not the JSON body.
2. The action requests asynchronous synthesis and does not retry the paid request. If it returns `task_id`, save that ID; if the API returns a direct `audio_url`, the action returns `succeeded` and the final URL immediately.
3. For an asynchronous task, add **Get Fish Audio task** and map **Task ID** from the first action. Query the same ID until `status=succeeded` or `failed`. Do not rerun synthesis while polling. A direct final audio response needs no lookup.
4. Open a URL in `media_urls` only when `success=true`. Task lookup does not create or bill another speech request.

The [credential-free quickstart flow](https://raw.githubusercontent.com/AceDataCloud/FishAudioActivepieces/main/examples/fish-audio-quickstart.json) imports with both connections empty and the task-ID mapping intact. Configure your own connection before running. The sample follows the asynchronous task path and has synthesis retries disabled.

This first Piece supports text-to-speech with three published engines, MP3/WAV output and an optional existing voice ID. It does not yet expose voice creation, one-shot references, prosody controls, or the full Fish Audio API. Synthesis cost depends on the current price and text length.

An isolated Activepieces CE 0.92.2 instance accepted the build archive and ran **Get Fish Audio task** against an existing completed task. The flow returned `succeeded` and one final audio URL. The synthesis action has not submitted a new paid request in this validation.

## Troubleshoot

| Result | Action |
| --- | --- |
| 401 / 403 | Check the API key, Fish Audio access, and Allowed APIs for both paths. |
| 400 | Check text, format, and reference voice ID. |
| `pending` | Wait and query the same task ID; do not rerun synthesis. |
| 429 | Reduce concurrency and wait; avoid automatic paid retries. |
| Synthesis timeout or 5xx | Inspect request history before another submission. |
| `failed` or missing task | Check the task ID and retention window. |

The Piece sends selected inputs and the API key only to `https://api.acedata.cloud`. It exposes final media URLs and removes internal routing fields from task output. [Source](https://github.com/AceDataCloud/FishAudioActivepieces) · [Support](https://github.com/AceDataCloud/FishAudioActivepieces/issues) · dev@acedata.cloud.
