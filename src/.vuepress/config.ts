import { defineUserConfig } from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";

import theme from "./theme.js";
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import {searchPlugin} from "@vuepress/plugin-search";

export default defineUserConfig({
  base: "/MyBlog/",

  lang: "zh-CN",
  title: "我的博客",
  description: "",

  theme,

  plugins:[
  ]

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
