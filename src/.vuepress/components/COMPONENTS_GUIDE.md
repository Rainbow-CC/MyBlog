# 自定义组件说明文档

本项目在 VuePress Theme Hope 基础上扩展了一些自定义 Vue 组件。

## 1. 组件存放与注册规范

- **存放位置**: `src/.vuepress/components/`
- **注册位置**: `src/.vuepress/client.ts`
- **使用方式**: 在 Markdown 文件中直接使用标签名，如 `<ComponentName />`。

---

## 2. 组件列表

### ImageStack (图片层叠组件)
用于以拍立得/相册错落风格展示一组图片，支持悬停扶正。

#### 改造记录
- **原版依赖**: 依赖 Tailwind CSS 和自定义 `ImageModal` 组件。
- **现版优化**: 
    - 移除了 Tailwind 依赖，改用 Scoped CSS，提高组件独立性。
    - 移除了 `ImageModal` 依赖，改用原生 `img`，利用主题自带的图片预览机制。
    - 引入了 `@vuepress/client` 的 `withBase` 自动处理图片路径，解决 `base: '/MyBlog/'` 下的图片 404 问题。

#### 参数 (Props)
| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `images` | `string[] \| ImageItem[]` | 必填 | 图片路径数组或包含 src/alt 的对象数组 |
| `width` | `string` | `75%` | 图片占据容器的宽度百分比 |

#### 通用性说明
如需在非 VuePress 项目中使用，请删除 `withBase` 相关逻辑。

---

### FrameImage (相框图片)
单张图片展示组件，带有白色边框、阴影和悬停上浮效果，类似实体照片。

#### 参数 (Props)
| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `src` | `string` | 必填 | 图片路径 |
| `alt` | `string` | - | 图片替代文本 |
| `width` | `string` | `100%` | 容器宽度 (如 `300px`, `50%`) |

---

### CounterDemo (计数器示例)
一个简单的交互式组件，用于演示 VuePress 嵌入 Vue 组件的基本原理。

---

## 3. 常见问题 (FAQ)

### 3.1 图片显示 404？
- **原因**: VuePress 部署在非根目录下（如 `/MyBlog/`）时，绝对路径 `/assets/xxx.png` 会失效。
- **对策**: 
    - 在组件中使用 `import { withBase } from '@vuepress/client'` 处理路径。
    - 确保图片放在 `src/.vuepress/public/` 目录下。

### 3.2 样式不生效？
- **原因**: 项目未全局配置 Tailwind CSS。
- **对策**: 编写组件时尽量使用标准的 `<style scoped>` CSS，不依赖原子类框架。

### 3.3 交互在 Markdown 中无效？
- **原因**: 检查 `client.ts` 是否已经正确执行了 `app.component()` 注册，且组件名没有拼写错误。
