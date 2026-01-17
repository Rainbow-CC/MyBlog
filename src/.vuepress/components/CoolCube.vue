<template>
  <div ref="cubeRef" class="cube-container" v-show="isVisible">
    <div class="scene">
      <div class="cube">
        <div class="face front">Vue</div>
        <div class="face back">Hope</div>
        <div class="face right">Vite</div>
        <div class="face left">JS</div>
        <div class="face top">Spring</div>
        <div class="face bottom">Java</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';

const cubeRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  // 等待页面完全渲染
  setTimeout(() => {
    // 尝试寻找 Theme Hope 的项目卡片
    // 类名通常包含 vp-project 或 project
    const candidates = document.querySelectorAll('.vp-project-card, .project-card, .home-project-item, a.project');
    
    let targetCard: HTMLElement | null = null;

    // 遍历查找包含目标文本的卡片
    for (const card of Array.from(candidates)) {
      if (card.textContent && card.textContent.includes('文章列表')) {
        targetCard = card as HTMLElement;
        break;
      }
    }

    if (targetCard && cubeRef.value) {
      // 确保父元素有定位上下文
      const style = window.getComputedStyle(targetCard);
      if (style.position === 'static') {
        targetCard.style.position = 'relative';
        // 确保卡片溢出可见，否则正方体会被切掉
        targetCard.style.overflow = 'visible';
      }

      // 将正方体移动到目标卡片内
      targetCard.appendChild(cubeRef.value);
      isVisible.value = true;
    } else {
      // 如果没找到卡片，就显示在原地（页面底部），或者选择隐藏
      // 这里选择显示在原地作为兜底
      isVisible.value = true;
    }
  }, 300);
});
</script>

<style scoped>
.cube-container {
  position: absolute;
  top: -30px;    /* 稍微下调一点 */
  right: -150px;  /* 进一步向右移动，避免盖住文字 */
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  transform: scale(0.6); /* 稍微再缩小一点，更精致 */
}

/* 如果在卡片外（兜底情况），恢复默认流式布局 */
/* 注意：由于样式是 scoped 的，移动到父元素后 scoped 属性可能失效或需要深度选择器，
   但在 Vue 3 中，移动 DOM 节点保留了原本的 dataset 属性，scoped 样式通常依然有效。
   为了保险，我们可以加一个全局类或者依赖内联样式，这里先保持 scoped。 */

.scene {
  width: 120px;
  height: 120px;
  perspective: 600px;
  pointer-events: auto; /* 恢复正方体的交互 */
}

.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: rotateCube 12s infinite linear;
}

.cube:hover {
  animation-duration: 4s;
  cursor: pointer;
}

.face {
  position: absolute;
  width: 120px;
  height: 120px;
  border: 1px solid rgba(0, 176, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  background: rgba(0, 176, 255, 0.1);
  backdrop-filter: blur(2px);
  color: var(--theme-color, #096dd9);
  box-shadow: 0 0 20px rgba(0, 176, 255, 0.2);
}

/* 3D 定位 */
.front  { transform: rotateY(0deg) translateZ(60px); }
.back   { transform: rotateY(180deg) translateZ(60px); }
.right  { transform: rotateY(90deg) translateZ(60px); }
.left   { transform: rotateY(-90deg) translateZ(60px); }
.top    { transform: rotateX(90deg) translateZ(60px); }
.bottom { transform: rotateX(-90deg) translateZ(60px); }

@keyframes rotateCube {
  from { transform: rotateX(0deg) rotateY(0deg); }
  to { transform: rotateX(360deg) rotateY(360deg); }
}
</style>
