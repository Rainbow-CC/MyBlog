import { defineClientConfig } from "vuepress/client";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

export default defineClientConfig({
  enhance({ app }) {
    app.use(Antd);
  },
});
