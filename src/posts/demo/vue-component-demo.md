---
title: Vue 组件使用演示
date: 2026-01-16
category:
  - Demo
tag:
  - Vue
  - Component
---

# Vue 组件使用演示

本文演示如何在 Markdown 文件中直接嵌入自定义 Vue 组件。

## 效果展示

下方是我们刚刚添加的计数器组件 `<CounterDemo />`：

<CounterDemo />

## 实现步骤讲解

要在 VuePress (Theme Hope) 中实现上述效果，主要分为三步：

### 1. 创建组件 (`.vue` 文件)

在 `src/.vuepress/components/` 目录下创建一个标准的 Vue 组件。例如 `CounterDemo.vue`。

### 2. 全局注册 (关键)

修改 `src/.vuepress/client.ts` 文件，引入并注册该组件：

```typescript
import { defineClientConfig } from "vuepress/client";
import CounterDemo from "./components/CounterDemo.vue"; // 1. 引入

export default defineClientConfig({
  enhance({ app }) {
    // ... 其他配置
    app.component("CounterDemo", CounterDemo); // 2. 注册
  },
});
```

### 3. 在 Markdown 中调用

注册完成后，就像使用 HTML 标签一样，在 `.md` 文件中直接写组件标签即可：

```html
<CounterDemo />
```

这样，VuePress 编译时就会自动将其渲染为交互式组件。

## ImageStack 组件演示

这是一个用于层叠展示多张图片的组件。

<ImageStack :images="[
  '/assets/other/scene1.jpg',
  '/assets/other/scene2.jpg',
  '/assets/other/scene3.jpg',
]" />

## FrameImage 组件演示

这是一个带有白色边框和悬停效果的单图组件。默认宽度为 100%。

<FrameImage src="/assets/images/cover4.jpg" />

也可以手动指定宽度：

<div style="display: flex; gap: 20px;">
  <FrameImage src="/assets/images/cover2.jpg" width="48%" />
  <FrameImage src="/assets/images/cover3.jpg" width="48%" />
</div>

