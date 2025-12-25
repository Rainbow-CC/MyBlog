<template>
  <div ref="chartContainer" class="g2-chart-container" :style="{ height: height }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Pie, G2 } from '@antv/g2plot';

const props = defineProps({
  // 图表数据
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  // 容器高度
  height: {
    type: String,
    default: '400px'
  },
  // 额外的 G2Plot 配置项
  config: {
    type: Object,
    default: () => ({})
  }
});

const chartContainer = ref(null);
let chartInstance = null;
let observer = null;

// 获取当前主题的逻辑
const getTheme = () => {
  if (typeof document === 'undefined') return 'default';
  return document.documentElement.getAttribute('data-theme') === 'dark' 
    ? 'transparent-dark' 
    : 'default';
};

// 注册透明暗色主题 (如果尚未注册)
const registerTheme = () => {
  try {
    // 检查是否已存在，G2 内部没有公开 api 查，但重复注册覆盖也无妨
    const darkTheme = G2.getTheme('dark');
    G2.registerTheme('transparent-dark', {
      ...darkTheme,
      background: 'transparent',
    });
  } catch (e) {
    console.error('Theme registration failed', e);
  }
};

onMounted(() => {
  if (!chartContainer.value) return;

  registerTheme();

  // 默认配置
  const defaultConfig = {
    appendPadding: 10,
    data: props.data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    theme: getTheme(),
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  // 合并用户配置
  const finalConfig = { ...defaultConfig, ...props.config };

  chartInstance = new Pie(chartContainer.value, finalConfig);
  chartInstance.render();

  // 监听主题变化
  observer = new MutationObserver(() => {
    if (chartInstance) {
      chartInstance.update({ theme: getTheme() });
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
});

// 监听数据变化，实现响应式更新
watch(() => props.data, (newData) => {
  if (chartInstance) {
    chartInstance.changeData(newData);
  }
}, { deep: true });

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  if (observer) {
    observer.disconnect();
  }
});
</script>
