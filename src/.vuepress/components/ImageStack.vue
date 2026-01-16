<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from '@vuepress/client'

interface ImageItem {
  src: string
  alt?: string
}

const props = defineProps<{
  images: string[] | ImageItem[]
  width?: string
}>()

const normalizedImages = computed(() => {
  return props.images.map(img => {
    let item = typeof img === 'string' ? { src: img, alt: '' } : { ...img }
    if (item.src.startsWith('/') && !item.src.startsWith('http')) {
      item.src = withBase(item.src)
    }
    return item
  })
})

function getImageStyle(index: number) {
  const isEven = index % 2 === 0
  const zIndex = (index + 1) * 10
  
  // 恢复您喜欢的旋转逻辑
  const rotate = isEven ? -5 : 5
  // 轻微的垂直偏移，形成层叠感
  const topOffset = index * 20 

  return {
    zIndex,
    transform: `rotate(${rotate}deg)`,
    top: `${topOffset}px`,
    // 左右交错放置
    left: isEven ? '5%' : 'auto',
    right: isEven ? 'auto' : '5%',
  }
}
</script>

<template>
  <div class="image-stack-container">
    <!-- 关键：占位图片。它是第一张图片的副本，但不显示，仅用于撑开容器高度 -->
    <div class="placeholder-item" v-if="normalizedImages.length > 0">
      <img :src="normalizedImages[0].src" class="stack-image" style="opacity: 0; pointer-events: none;" />
    </div>

    <!-- 实际显示的图片堆栈 -->
    <div 
      v-for="(img, index) in normalizedImages" 
      :key="img.src"
      class="stack-item"
      :style="getImageStyle(index)"
    >
      <img :src="img.src" :alt="img.alt" class="stack-image" />
    </div>
  </div>
</template>

<style scoped>
.image-stack-container {
  position: relative;
  width: 100%;
  /* 彻底删除写死的 min-height */
  display: block;
  margin: 20px 0;
  /* 留出一点底部 padding，防止绝对定位的偏移量导致图片下沿被切断 */
  padding-bottom: 60px; 
}

/* 占位符样式 */
.placeholder-item {
  width: 75%;
  max-width: 800px;
  margin: 0 auto;
  padding: 8px; /* 匹配 stack-item 的 padding */
}

.stack-item {
  position: absolute; /* 恢复绝对定位，找回最初的效果 */
  width: 75%; 
  max-width: 800px;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  background: #fff;
  padding: 8px;
}

.stack-item:hover {
  z-index: 100 !important;
  transform: rotate(0deg) scale(1.05) !important;
  box-shadow: 0 20px 30px -5px rgba(0, 0, 0, 0.3);
}

.stack-image {
  width: 100%;
  height: auto; /* 保持原图比例 */
  display: block;
  border-radius: 4px;
}
</style>