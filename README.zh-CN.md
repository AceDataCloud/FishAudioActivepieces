# Fish Audio for Activepieces

通过 Ace Data Cloud 合成语音，并按**同一个任务 ID**查询 Fish Audio 异步任务。Piece 提供 **Synthesize Fish Audio speech** 和 **Get Fish Audio task** 两个动作。[English](README.md)

**分发方式：**在 Activepieces 实例中将 `@acedatacloud/piece-fish-audio@0.1.0` 作为自定义 Piece 安装。公开 npm 包不会自动进入 Activepieces 共享目录。

## 安装与连接

Activepieces 0.92.2+ 中进入 **Platform Admin → Catalogue → Pieces → Install Piece → NPM Registry**，填写 `@acedatacloud/piece-fish-audio` 和版本 `0.1.0`。在流程中搜索 **Fish Audio by Ace Data Cloud**，核对 Ace Data Cloud Logo 和两个动作。

创建连接时使用同时有 `/fish/tts` 与 `/fish/tasks` 权限的 Ace Data Cloud API Key。只填写 Key 本身，不加 `Bearer `；Key 留在连接中，不写入流程导出。合成前查看当前[价格](https://platform.acedata.cloud/models)与余额。

## 首次流程

1. 添加 **Synthesize Fish Audio speech**，填写文本，选择 `s2-pro`、`mp3`，可选填现有或公开声音的 **Reference voice ID**。Piece 把模型放在 `model` 请求头，而不是 JSON 请求体。
2. 动作请求异步合成，不重试付费请求。若返回 `task_id`，保存它；若 API 直接返回 `audio_url`，动作立即返回 `succeeded` 和最终链接。
3. 对异步任务添加 **Get Fish Audio task**，把 **Task ID** 映射为上一动作输出。只查询同一 ID，直到 `status=succeeded` 或 `failed`；轮询不重跑合成。直接得到最终音频时无需查询。
4. 仅当 `success=true` 时打开 `media_urls`。查询任务不会再次创建语音或计费。

[无密钥首跑流程](https://raw.githubusercontent.com/AceDataCloud/FishAudioActivepieces/main/examples/fish-audio-quickstart.json) 导入后两个连接均为空，任务 ID 映射保留。运行前请配置自己的连接。样例走异步任务路径，并已关闭合成动作的自动重试。

首版支持三个公开语音引擎、MP3/WAV 输出和可选的现有声音 ID；尚未涵盖创建声音、一次性参考音频、韵律控制或 Fish Audio 全部 API。合成费用取决于当前价格和文本长度。

隔离的 Activepieces CE 0.92.2 实例已接受构建归档，并通过 **Get Fish Audio task** 查询既有完成任务；流程返回 `succeeded` 和 1 个最终音频 URL。本轮未通过合成动作提交新的付费请求。

## 排障

| 现象 | 处理 |
| --- | --- |
| 401 / 403 | 核对 Key、Fish Audio 权限和两个路径的 Allowed APIs。 |
| 400 | 核对文本、格式和声音 ID。 |
| `pending` | 等待并查询同一任务 ID，不重跑合成。 |
| 429 | 降低并发，避免自动重试付费请求。 |
| 合成超时或 5xx | 先查请求历史，再考虑再次提交。 |
| `failed` 或任务不存在 | 检查任务 ID 和保留期限。 |

Piece 只向 `https://api.acedata.cloud` 发送所选输入和 API Key，仅在终态返回媒体 URL，并过滤内部路由字段。[源码](https://github.com/AceDataCloud/FishAudioActivepieces) · [支持](https://github.com/AceDataCloud/FishAudioActivepieces/issues) · dev@acedata.cloud。
