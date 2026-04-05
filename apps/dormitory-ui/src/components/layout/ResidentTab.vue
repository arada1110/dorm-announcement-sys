<template>
  <a-tabs v-model:activeKey="activeKey" centered>
    <a-tab-pane key="1" tab="ข่าวทั้งหมด">Content of Tab Pane 1</a-tab-pane>
    <a-tab-pane key="2" tab="ข้อมูลผู้ใช้" force-render>Content of Tab Pane 2</a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const activeKey = ref("1");
</script>
