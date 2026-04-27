# P3R Chrome Wallpaper / New Tab

一个 Persona 3 Reload 风格的 Chrome New Tab 扩展。它把默认新标签页替换成一个蓝黑海报感桌面：背景视频、角色占位区、搜索栏、快捷入口、三周日历，以及一个可复制常用开发命令的 Command Vault。

本项目是纯前端 Chrome 扩展，不依赖后端服务，不请求系统性能权限。

## Demo




https://github.com/user-attachments/assets/891d4e04-7abb-45f1-b603-cc08c73056ff





## Public Branch Notice

这个公开分支不包含 Live2D character 资源。角色模型、贴图、动作文件和相关运行时代码可能受到版权或授权限制，因此没有放进公开仓库。

完整 character 版本应保存在私有仓库或私有分支工作副本中。注意：GitHub 的可见性是 repository 级别，不能把同一个 repository 的某个 branch 设为 private、另一个 branch 设为 public。如果需要真正的 public/private 隔离，应使用两个 repository：

- private repo：保留完整 `character/` 资源。
- public repo：使用当前公开分支，不包含 `character/` 资源。

## 当前功能

- P3R 风格新标签页
  - 蓝黑主视觉、点阵背景、简化卡片布局。
  - 内置 `loop.mp4` 作为动态背景。
  - 页面会根据屏幕尺寸自动缩放，适配笔记本和大屏。

- 搜索栏
  - 默认 Google 搜索。
  - 支持 Bilibili、GitHub、YouTube 快捷切换。
  - 支持 Google 搜索建议。

- 角色占位区
  - 公开分支显示 character placeholder。
  - 完整 Live2D 资源不随公开分支发布。

- Command Vault
  - 替代原来的 Daily Command。
  - 外层分类横向滚动，可鼠标滚轮横滑，也可拖拽。
  - 内层命令列表可滚动。
  - 点击任意命令即可复制到剪贴板。
  - 当前分类包括：
    - C / C++
    - CMake
    - Python
    - Conda
    - PowerShell
    - WSL
    - CUDA
    - Ollama
    - npm
    - Git
    - Linux
    - SSH
    - VS Code
    - macOS

- 三周日历
  - 只显示上周、本周、下周。
  - 当前周日期更大、更明显。
  - 左右按钮按周切换。

- 快捷入口
  - 中部快捷按钮支持本地添加和删除。
  - 右侧工具区提供 Gmail、Docs、Drive、Calendar、Notion、ChatGPT、GitHub、YouTube、Maps、Keep 等入口。

- Bayern 赛事卡片
  - 从 ESPN API 获取 Bayern 最近/下一场比赛信息。
  - 使用本地缓存作为请求失败时的降级。

## 安装

1. 打开 Chrome。
2. 进入 `chrome://extensions/`。
3. 打开右上角 `Developer mode`。
4. 点击 `Load unpacked`。
5. 选择本项目文件夹。
6. 打开新标签页。

## 文件结构

```text
manifest.json        Chrome 扩展配置
newtab.html          新标签页结构
style.css            视觉、布局、响应式缩放
script.js            搜索、日历、Command Vault、快捷方式、赛事卡片逻辑
loop.mp4             背景视频
logo.svg             P3R logo
README.md            项目说明
```

## 权限说明

`manifest.json` 当前只包含网络 host 权限：

```text
https://suggestqueries.google.com/*
https://site.web.api.espn.com/*
https://site.api.espn.com/*
```

用途：

- Google suggestion API：搜索建议。
- ESPN API：Bayern 赛事信息。

本扩展不请求 `chrome.system.cpu`、`chrome.system.memory` 等系统性能权限，也不读取真实 CPU/GPU/RAM/VRAM 数据。

## Command Vault 数据维护

命令数据集中在 `script.js` 的 `COMMAND_VAULT` 常量里。每个分类结构如下：

```js
{
  category: 'Python',
  commands: [
    ['Run file', 'python main.py', 'Run a Python script.']
  ]
}
```

每条命令格式：

```text
[标题, 可复制命令, 简短解释]
```

添加新命令时只需要往对应分类的 `commands` 数组里追加一项。添加新分类时追加一个新的对象即可。

## 本地开发

这个项目没有构建步骤，直接作为 unpacked Chrome extension 加载即可。

如果只是本地预览静态页面，可以在项目目录启动一个简单服务器：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000/newtab.html
```

注意：作为普通网页打开时，部分 Chrome extension 场景和新标签页行为可能和真正加载扩展后略有差异。

## 设计方向

当前视觉目标不是完整复刻游戏 UI，而是借用 P3R 标题画面的几个元素：

- 大面积蓝色背景
- 黑色斜向块
- 点阵纹理
- 高对比但可读的冷白/淡蓝卡片
- 简化的工具面板

后续如果继续迭代，优先保持信息可读性，再添加装饰。

## English Summary

P3R Chrome Wallpaper is a Persona 3 Reload inspired Chrome New Tab extension. It includes a dynamic video background, character placeholder area, search bar, shortcut launcher, three-week calendar, Bayern match card, and a copy-ready developer Command Vault.

This public branch intentionally omits Live2D character assets because those files may be copyright-protected or license-restricted. Keep the complete character build in a private repository.

Load it through `chrome://extensions/` with Developer Mode enabled, then choose this folder via `Load unpacked`.
