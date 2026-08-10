import {sidebar} from "vuepress-theme-hope";

export default sidebar({
    "/": [
        // 这里表示主页
        "intro",
        {
            text: "Portfolio",
            icon: "briefcase",
            prefix: "portfolio/",
            children: "structure",
        },
        {
            text: "Technology",
            icon: "book",
            prefix: "posts/tech/",
            children: "structure",
        },
        {
            text: "English Learning",
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
        {
            text: "Travel",
            icon: "route",
            prefix: "posts/travel/",
            children: "structure",
        },
        {
            text: "Interviews",
            icon: "briefcase",
            prefix: "posts/interview/",
            children: "structure",
        },
        // {
        //   text: "Mermaid 示例",
        //   icon: "sitemap",
        //   link: "demo/mermaid-demo",
        // },

    ],
});
