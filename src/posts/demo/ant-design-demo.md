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
import { ref, onMounted } from 'vue'
import { Pie, Column, Line, Bar, G2 } from '@antv/g2plot'

const pieContainer = ref(null);
const columnContainer = ref(null);
const lineContainer = ref(null);
const ganttContainer = ref(null);

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

onMounted(() => {
  // 注册一个背景透明的暗色主题
  const darkTheme = G2.getTheme('dark');
  G2.registerTheme('transparent-dark', {
    ...darkTheme,
    background: 'transparent',
  });

  // 获取当前主题
  const getTheme = () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'transparent-dark' : 'default';
  
  const charts = [];

  // 饼图渲染
  if(pieContainer.value) {
    const data = [
      { type: '前端', value: 40 },
      { type: '后端', value: 30 },
      { type: 'DevOps', value: 20 },
      { type: '设计', value: 10 },
    ];

    const piePlot = new Pie(pieContainer.value, {
      appendPadding: 10,
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
      theme: getTheme(),
      label: {
        type: 'outer',
        content: '{name} {percentage}',
      },
      interactions: [{ type: 'element-active' }],
    });

    piePlot.render();
    charts.push(piePlot);
  }

  // 柱状图渲染
  if(columnContainer.value) {
    const columnData = [
      { type: '1月', sales: 38 },
      { type: '2月', sales: 52 },
      { type: '3月', sales: 61 },
      { type: '4月', sales: 145 },
      { type: '5月', sales: 48 },
      { type: '6月', sales: 38 },
      { type: '7月', sales: 38 },
      { type: '8月', sales: 38 },
    ];

    const columnPlot = new Column(columnContainer.value, {
      data: columnData,
      xField: 'type',
      yField: 'sales',
      theme: getTheme(),
      label: {
        position: 'middle',
        style: {
          fill: '#FFFFFF',
          opacity: 0.6,
        },
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
    });

    columnPlot.render();
    charts.push(columnPlot);
  }

  // 折线图渲染
  if(lineContainer.value) {
    const lineData = [
      { year: '1991', value: 3 },
      { year: '1992', value: 4 },
      { year: '1993', value: 3.5 },
      { year: '1994', value: 5 },
      { year: '1995', value: 4.9 },
      { year: '1996', value: 6 },
      { year: '1997', value: 7 },
      { year: '1998', value: 9 },
      { year: '1999', value: 13 },
    ];

    const linePlot = new Line(lineContainer.value, {
      data: lineData,
      xField: 'year',
      yField: 'value',
      theme: getTheme(),
      label: {},
      point: {
        size: 5,
        shape: 'diamond',
        style: {
          fill: 'white',
          stroke: '#5B8FF9',
          lineWidth: 2,
        },
      },
    });

    linePlot.render();
    charts.push(linePlot);
  }

  // 甘特图 (使用 Bar 实现)
  if(ganttContainer.value) {
    const data = [
      { task: '任务一', startTime: '08:00', endTime: '10:00', status: '已完成' },
      { task: '任务二', startTime: '10:00', endTime: '12:00', status: '进行中' },
      { task: '任务三', startTime: '13:00', endTime: '15:00', status: '未开始' },
    ];
    
    const processData = data.map(d => ({
      task: d.task,
      range: [parseInt(d.startTime.split(':')[0]), parseInt(d.endTime.split(':')[0])],
      status: d.status
    }));

    const barPlot = new Bar(ganttContainer.value, {
      data: processData,
      xField: 'range',
      yField: 'task',
      seriesField: 'status',
      isRange: true,
      theme: getTheme(),
      label: {
        position: 'middle',
        content: (item) => {
             const original = data.find(d => d.task === item.task);
             return `${original.startTime} - ${original.endTime}`;
        },
        style: {
            fill: '#fff',
        }
      },
      xAxis: {
        min: 6,
        max: 18,
        tickInterval: 2,
        title: {
            text: '时间 (小时)'
        }
      }
    });

    barPlot.render();
    charts.push(barPlot);
  }

  // 监听主题变化
  const observer = new MutationObserver(() => {
    const currentTheme = getTheme();
    charts.forEach(chart => {
      chart.update({ theme: currentTheme });
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
});

// 组件化演示数据
const componentPieData = [
  { type: '组件化', value: 50 },
  { type: '复用性', value: 30 },
  { type: '维护性', value: 20 },
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

## 6. G2Plot 柱状图示例

<div ref="columnContainer" style="height: 400px;"></div>

## 7. G2Plot 折线图示例

<div ref="lineContainer" style="height: 400px;"></div>

## 8. G2Plot 甘特图示例 (使用区间条形图)

<div ref="ganttContainer" style="height: 300px;"></div>

## 9. G2Plot 饼图示例

<div ref="pieContainer" style="height: 400px;"></div>

## 10. 组件化复用示例 (New)

这里直接使用全局注册的 `<G2PieChart />` 组件，代码极其简洁，且自动支持暗色模式。

<G2PieChart :data="componentPieData" />

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

