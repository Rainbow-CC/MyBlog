import { defineClientConfig } from "vuepress/client";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

export default defineClientConfig({
  enhance({ app }) {
    app.use(ElementPlus);
    app.use(Antd);
  },
});
