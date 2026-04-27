# P3R Chrome Wallpaper / New Tab

A Persona 3 Reload inspired Chrome New Tab extension. It replaces the default new tab page with a blue and black poster-style desktop: animated background, character placeholder area, search bar, shortcuts, a compact three-week calendar, Bayern match card, and a copy-ready developer Command Vault.

一个 Persona 3 Reload 风格的 Chrome New Tab 扩展。它把默认新标签页替换成蓝黑海报感桌面：动态背景、角色占位区、搜索栏、快捷入口、三周日历、Bayern 赛事卡片，以及可一键复制开发命令的 Command Vault。

## Demo

https://github.com/user-attachments/assets/891d4e04-7abb-45f1-b603-cc08c73056ff

## Public Branch Notice

This public repository does not include Live2D character assets. Character models, textures, motion files, and related runtime files may be copyright-protected or license-restricted, so they are intentionally excluded from the public build.

这个公开仓库不包含 Live2D character 资源。角色模型、贴图、动作文件和相关运行时代码可能受到版权或授权限制，因此不会放进公开版本。

GitHub visibility is repository-level, not branch-level. A single repository cannot have one public branch and one private branch. Use two repositories for real separation:

GitHub 的可见性是 repository 级别，不是 branch 级别。一个仓库不能做到某个分支公开、另一个分支私有。真正隔离应使用两个仓库：

- Public repo / 公开仓库：no-character build, with placeholder area.
- Private repo / 私有仓库：complete build with `character/` assets.

## Features / 功能

- P3R-style new tab / P3R 风格新标签页
  - Blue, black, and white poster-like layout.
  - 点阵背景、蓝黑主视觉、简化卡片布局。
  - Responsive scaling for laptop and large desktop screens.
  - 根据屏幕尺寸自动缩放，适配笔记本和大屏。

- Search / 搜索
  - Google search by default.
  - 默认 Google 搜索。
  - Quick engines for Bilibili, GitHub, and YouTube.
  - 支持 Bilibili、GitHub、YouTube 快捷切换。
  - Google search suggestions.
  - 支持 Google 搜索建议。

- Character placeholder / 角色占位区
  - Public build shows a character placeholder.
  - 公开版本显示 character placeholder。
  - The complete Live2D build is kept private.
  - 完整 Live2D 版本保存在私有仓库。

- Command Vault
  - Horizontal category tabs with mouse wheel and drag support.
  - 外层分类支持横向滚动、鼠标滚轮横滑和拖拽。
  - Scrollable command list.
  - 内层命令列表可滚动。
  - Click any command to copy it.
  - 点击任意命令即可复制。
  - Includes C / C++, CMake, Python, Conda, PowerShell, WSL, CUDA, Ollama, npm, Git, Linux, SSH, VS Code, and macOS.
  - 包含 C / C++、CMake、Python、Conda、PowerShell、WSL、CUDA、Ollama、npm、Git、Linux、SSH、VS Code、macOS 等分类。

- Three-week calendar / 三周日历
  - Shows previous week, current week, and next week.
  - 只显示上周、本周、下周。
  - Current week is emphasized for readability.
  - 当前周更醒目，避免数字挤在一起。

- Shortcuts / 快捷入口
  - Local shortcut launcher.
  - 本地快捷入口。
  - Tool panel for Gmail, Docs, Drive, Calendar, Notion, ChatGPT, GitHub, YouTube, Maps, and Keep.
  - 右侧工具区提供 Gmail、Docs、Drive、Calendar、Notion、ChatGPT、GitHub、YouTube、Maps、Keep 等入口。

- Bayern match card / Bayern 赛事卡片
  - Fetches Bayern match info from ESPN APIs.
  - 从 ESPN API 获取 Bayern 赛事信息。
  - Uses local fallback data when requests fail.
  - 请求失败时使用本地降级数据。

## Installation / 安装

1. Open Chrome.
2. Go to `chrome://extensions/`.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select this project folder.
6. Open a new tab.

中文：

1. 打开 Chrome。
2. 进入 `chrome://extensions/`。
3. 打开右上角 `Developer mode`。
4. 点击 `Load unpacked`。
5. 选择本项目文件夹。
6. 打开新标签页。

## File Structure / 文件结构

```text
manifest.json        Chrome extension manifest / Chrome 扩展配置
newtab.html          New tab markup / 新标签页结构
style.css            Layout, visuals, responsive scaling / 视觉、布局、响应式缩放
script.js            Search, calendar, Command Vault, shortcuts, match card logic / 页面逻辑
loop.mp4             Background video / 背景视频
logo.svg             P3R-style logo / P3R 风格 logo
README.md            Project documentation / 项目说明
```

## Permissions / 权限说明

The extension only uses host permissions for search suggestions and Bayern match data:

扩展只使用搜索建议和 Bayern 赛事数据所需的网络权限：

```text
https://suggestqueries.google.com/*
https://site.web.api.espn.com/*
https://site.api.espn.com/*
```

It does not request `chrome.system.cpu`, `chrome.system.memory`, or other system performance permissions.

本扩展不请求 `chrome.system.cpu`、`chrome.system.memory` 等系统性能权限，也不读取真实 CPU/GPU/RAM/VRAM 数据。

## Command Vault Data / Command Vault 数据

Command data is stored in the `COMMAND_VAULT` constant inside `script.js`.

命令数据集中在 `script.js` 的 `COMMAND_VAULT` 常量中。

```js
{
  category: 'Python',
  commands: [
    ['Run file', 'python main.py', 'Run a Python script.']
  ]
}
```

Each command uses this format:

每条命令格式：

```text
[title, command, short explanation]
```

Add commands by appending entries to a category's `commands` array. Add categories by appending a new object to `COMMAND_VAULT`.

添加新命令时，往对应分类的 `commands` 数组追加一项即可。添加新分类时，往 `COMMAND_VAULT` 追加一个新的分类对象即可。

## Local Preview / 本地预览

This project has no build step. Load it directly as an unpacked Chrome extension.

这个项目没有构建步骤，直接作为 unpacked Chrome extension 加载即可。

For static preview:

如果只是预览静态页面：

```bash
python -m http.server 8000
```

Then open:

然后访问：

```text
http://localhost:8000/newtab.html
```

Some Chrome extension behavior may differ when opened as a normal webpage.

作为普通网页打开时，部分 Chrome extension 场景和新标签页行为可能与真正加载扩展后不同。

## Design Direction / 设计方向

The visual goal is not a full game UI clone. It borrows a few P3R title-screen ideas while keeping the new tab readable and useful:

当前视觉目标不是完整复刻游戏 UI，而是在保证可读性和实用性的前提下借用 P3R 标题画面的几个元素：

- large blue fields / 大面积蓝色背景
- black diagonal blocks / 黑色斜向块
- dotted texture / 点阵纹理
- readable light panels / 高可读性的浅色面板
- simplified tool surfaces / 简化工具区
