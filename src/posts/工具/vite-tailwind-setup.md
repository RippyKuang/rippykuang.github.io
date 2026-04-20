---
title: "使用 Vite 和 Tailwind 快速构建站点"
date: "2026-04-01"
excerpt: "记录前端工程化的最佳实践，展示 Vite + React + Tailwind 的极速开发流。"
tags: "架构, 算法"
---
# 使用 Vite 和 Tailwind 快速构建站点

在当今的前端开发中，构建速度和开发体验至关重要。Vite 利用 ES Modules 的特性，提供了极速的冷启动和热更新。

## 安装步骤

```bash
npm create vite@latest my-blog -- --template react-ts
cd my-blog
npm install
npm run dev
```

结合 `Tailwind CSS`，我们可以不离开 HTML/JSX 结构，仅通过 utility classes 即可完成样式编写。这符合我们“内容优先、朴素克制”的理念。

保持简单，这就是终极的成熟。
