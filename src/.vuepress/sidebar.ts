import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    // 这里表示主页
    "",
    {
      text: "文章",
      icon: "book",
      prefix: "posts/",
      children: "structure",
    },
    "intro",
  ],
});
