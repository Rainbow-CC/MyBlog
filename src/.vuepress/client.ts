import { defineClientConfig } from "vuepress/client";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import G2PieChart from "./components/G2PieChart.vue";
import CounterDemo from "./components/CounterDemo.vue";
import ImageStack from "./components/ImageStack.vue";
import FrameImage from "./components/FrameImage.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.use(Antd);
    app.component("G2PieChart", G2PieChart);
    app.component("CounterDemo", CounterDemo);
    app.component("ImageStack", ImageStack);
    app.component("FrameImage", FrameImage);
  },
});
