<template>
  <div class="counter-demo">
    <h3>🔢 自定义计数器组件</h3>
    <p>当前数值: <strong>{{ count }}</strong></p>
    <div class="button-group">
      <button class="btn primary" @click="increment">增加 (+)</button>
      <button class="btn danger" @click="reset">重置 (↺)</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};

const reset = () => {
  count.value = 0;
};
</script>

<style scoped>
.counter-demo {
  border: 2px solid var(--theme-color, #3eaf7c);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  background-color: var(--bg-color-secondary, #f8f9fa);
  text-align: center;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.8;
}

.primary {
  background-color: #3eaf7c;
  color: white;
}

.danger {
  background-color: #ff4d4f;
  color: white;
}
</style>
