import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  // "/demo/",
  {
    text: "博文",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "技术",
        icon: "pen-to-square",
        prefix: "tech/",
        children: [
          { text: "SQL调优记录", icon: "pen-to-square", link: "sql-optimization-1" },
          { text: "信托系统介绍", icon: "pen-to-square", link: "family-trust-system" },
        ],
      },
    ],
  },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
