<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from '@vuepress/client'

const props = defineProps<{
  src: string
  alt?: string
  // 容器宽度，支持百分比或 px。如果不传，默认 100% 占满容器
  width?: string
}>()

// 处理 base url
const resolvedSrc = computed(() => {
  if (props.src.startsWith('/') && !props.src.startsWith('http')) {
    return withBase(props.src)
  }
  return props.src
})
</script>

<template>
  <div class="frame-image-wrapper" :style="{ width: width || '100%' }">
    <div class="frame-card">
      <div class="image-box">
        <img :src="resolvedSrc" :alt="alt" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.frame-image-wrapper {
  display: block; /* 块级元素，默认占满一行 */
  margin: 20px 0;
}

.frame-card {
  background: #fff;
  padding: 12px; /* 白色边框厚度 */
  border-radius: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
}

/* 悬停效果：上浮 + 阴影加深 + 轻微放大 */
.frame-card:hover {
  transform: translateY(-5px) scale(1.02); /* 放大倍数稍微调小一点，大图太夸张不好看 */
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.image-box {
  overflow: hidden;
  border-radius: 2px;
}

.image-box img {
  display: block;
  width: 100%;
  height: auto;
  margin: 0; 
}
</style>