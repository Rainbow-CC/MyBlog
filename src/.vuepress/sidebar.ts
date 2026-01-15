import {sidebar} from "vuepress-theme-hope";

export default sidebar({
    "/": [
        // 这里表示主页
        "intro",
        {
            text: "技术",
            icon: "book",
            prefix: "posts/tech/",
            children: "structure",
        },
        {
            text: "英语学习",
            icon: "language",
            prefix: "posts/English/",
            children: "structure",
        },
        {
            text: "Demo",
            icon: "sitemap",
            prefix: "posts/demo/",
            children: "structure",
        },
        {
            text: "Chat",
            icon: "sitemap",
            prefix: "posts/chat/",
            children: "structure",
        },
        // {
        //   text: "Mermaid 示例",
        //   icon: "sitemap",
        //   link: "demo/mermaid-demo",
        // },

    ],
});
