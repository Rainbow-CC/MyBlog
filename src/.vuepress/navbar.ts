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
          { text: "SQL调优记录1", icon: "pen-to-square", link: "sql-optimization-1" },
          // { text: "苹果2", icon: "pen-to-square", link: "2" },
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
