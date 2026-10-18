# Fish Audio for Activepieces

通过 Ace Data Cloud 合成语音，并按**同一个任务 ID**查询 Fish Audio 异步任务。Piece 提供 **Synthesize Fish Audio speech** 和 **Get Fish Audio task** 两个动作。[English](README.md)

**分发方式：**在 Activepieces 实例中将 `@acedatacloud/piece-fish-audio@0.1.1` 作为自定义 Piece 安装。公开 npm 包不会自动进入 Activepieces 共享目录。

## 安装与连接

Activepieces 0.92.2+ 中进入 **Platform Admin → Catalogue → Pieces → Install Piece → NPM Registry**，填写 `@acedatacloud/piece-fish-audio` 和版本 `0.1.1`。在流程中搜索 **Fish Audio by Ace Data Cloud**，核对 Ace Data Cloud Logo 和两个动作。

1. 在 [Ace Data Cloud Applications](https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=fish_audio_activepieces_readme_api_key) 注册或登录。若没有通用应用，点击 **Initialize General Application**。
2. 打开通用应用或具备 **Fish Audio** 权限的应用。通用 Key 可访问账号已获授权的服务；专用 Key 仅限对应服务。
3. 使用应用卡片的复制按钮，或通过 **Manage Keys → Create** 创建名为 `Activepieces Fish Audio` 的独立 Key，按需设置有效期与用量限制。若启用 **Allowed APIs**，应同时包含 `/fish/tts` 与 `/fish/tasks`，创建后复制 Key。
4. 创建 Activepieces 连接，只填写 API Key 本身，不加 `Bearer `。`platform-...` 管理 Token 不是生成 API Key。Key 留在连接中，不写入流程导出。合成前查看当前[价格](https://platform.acedata.cloud/models?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=fish_audio_activepieces_readme_pricing)与余额。

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
| 合成超时或 5xx | 先查[请求历史](https://platform.acedata.cloud/console/usages?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=fish_audio_activepieces_readme_request_history)，再考虑再次提交。 |
| `failed` 或任务不存在 | 检查任务 ID 和保留期限。 |

Piece 只向 `https://api.acedata.cloud` 发送所选输入和 API Key，仅在终态返回媒体 URL，并过滤内部路由字段。[源码](https://github.com/AceDataCloud/FishAudioActivepieces) · [支持](https://github.com/AceDataCloud/FishAudioActivepieces/issues) · dev@acedata.cloud。

API 请求验证 HTTPS 证书，且仅访问 `api.acedata.cloud`。网络失败与 HTTP 错误不自动重试；重新创建前先查请求历史。此传输方式不支持 HTTPS 代理配置。

## 图文配置参考

![复制 Key 或管理密钥：真实脱敏 Ace 控制台](docs/screenshots/get-api-key-en.png)
![创建独立 Key：真实脱敏 Ace 控制台](docs/screenshots/create-api-key-en.png)
![官方 Activepieces 通用安装弹窗](docs/screenshots/install-piece.png)

2026-10-18 复用的真实/官方参考图，[固定来源与边界](docs/screenshots/onboarding-source.json)保留。安装图不是本 Piece 已被官方共享目录收录的证明。管理员安装后按服务名搜索并核对 **by Ace Data Cloud**；Key 只放动作连接。源码 PR、npm 发版、官方目录收录与真实首用分别验收。
