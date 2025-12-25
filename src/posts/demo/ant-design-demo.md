---
title: Ant Design Vue 组件演示
date: 2025-12-25
category:
  - Demo
tag:
  - Ant Design Vue
---

# 在 Markdown 中使用 Ant Design Vue

已全局注册 Ant Design Vue，可以直接使用组件。

<script setup>
import { ref } from 'vue'

const columns = [
  { title: '技术栈', dataIndex: 'name', key: 'name' },
  { title: '熟练度', dataIndex: 'level', key: 'level' },
  { title: '分类', dataIndex: 'category', key: 'category' },
];

const dataSource = [
  { key: '1', name: 'Vue 3', level: '精通', category: 'Frontend' },
  { key: '2', name: 'TypeScript', level: '熟练', category: 'Language' },
  { key: '3', name: 'Ant Design', level: '熟练', category: 'UI Library' },
];
</script>

## 1. 基础按钮

<a-space>
  <a-button type="primary">Primary Button</a-button>
  <a-button>Default Button</a-button>
  <a-button type="dashed">Dashed Button</a-button>
  <a-button type="text">Text Button</a-button>
  <a-button type="link">Link Button</a-button>
</a-space>

## 2. 提示信息

<br/>
<a-alert message="Success Text" type="success" show-icon />
<br/>
<a-alert message="Warning Text" type="warning" show-icon closable />

## 3. Ant 饼图示例 (环形进度条)

Ant Design Vue 核心库主要提供 UI 组件。对于简单的环形比例展示，可以使用 Progress 组件。

<br/>
<a-row :gutter="16">
  <a-col :span="8">
    <div style="text-align: center">
      <a-progress type="circle" :percent="75" />
      <div style="margin-top: 10px">前端进度</div>
    </div>
  </a-col>
  <a-col :span="8">
    <div style="text-align: center">
      <a-progress type="circle" :percent="100" status="success" />
      <div style="margin-top: 10px">后端进度</div>
    </div>
  </a-col>
  <a-col :span="8">
    <div style="text-align: center">
      <a-progress type="circle" :percent="30" status="exception" />
      <div style="margin-top: 10px">测试进度</div>
    </div>
  </a-col>
</a-row>

## 4. 柱状图示例 (线性进度条)

使用线性进度条展示各项指标对比（横向柱状图）。

<div style="width: 100%; max-width: 600px">
  <div style="margin-bottom: 5px">Vue.js</div>
  <a-progress :percent="90" stroke-color="#42b883" />
  
  <div style="margin-bottom: 5px; margin-top: 15px">React</div>
  <a-progress :percent="80" stroke-color="#61dafb" />
  
  <div style="margin-bottom: 5px; margin-top: 15px">Angular</div>
  <a-progress :percent="60" stroke-color="#dd0031" />
  
  <div style="margin-bottom: 5px; margin-top: 15px">Svelte</div>
  <a-progress :percent="70" stroke-color="#ff3e00" />
</div>

## 5. 表格示例 (论文三线表样式)

通过 CSS 自定义，实现类似学术论文的“三线表”风格，并自动适配深色模式。

<div class="academic-table">
  <a-table 
    :dataSource="dataSource" 
    :columns="columns" 
    :pagination="false" 
    size="middle" 
    :bordered="false"
  />
</div>

<style>
/* 局部样式：学术三线表 (严格三线版) */
.academic-table {
  font-family: "Times New Roman", Times, serif;
  margin: 20px 0;
}

/* 1. 整体容器：透明背景，顶线与底线 (2px 粗线) */
.academic-table .ant-table {
  background: transparent !important;
  border-top: 2px solid currentColor !important;
  border-bottom: 2px solid currentColor !important;
  border-radius: 0 !important;
  color: inherit !important;
}
.academic-table .ant-table-container {
  border: none !important;
}

/* 2. 表头：去背景，加栏目线 (1px 细线)，去分割线 */
.academic-table .ant-table-thead > tr > th {
  background: transparent !important;
  border-bottom: 1px solid currentColor !important;
  color: inherit !important;
  font-weight: bold;
  border-radius: 0 !important;
  padding: 12px 16px !important;
}
.academic-table .ant-table-thead > tr > th::before {
  display: none !important; /* 去掉垂直分割线 */
}

/* 3. 表体：彻底移除所有行间横线，增加内边距以保持易读性 */
.academic-table .ant-table-tbody > tr > td {
  background: transparent !important;
  border-bottom: none !important; /* 移除行间线 */
  color: inherit !important;
  padding: 12px 16px !important; /* 增加呼吸感 */
}

/* 4. 悬停效果：仅保留极其微弱的背景提示 */
.academic-table .ant-table-tbody > tr:hover > td {
  background: rgba(127, 127, 127, 0.05) !important;
}
</style>

