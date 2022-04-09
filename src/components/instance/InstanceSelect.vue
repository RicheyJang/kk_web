<template>
  <el-dropdown>
    <span class="el-dropdown-link" style="cursor: pointer;">
      当前实例<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>实例 1</el-dropdown-item>
        <el-dropdown-item>实例 2</el-dropdown-item>
        <el-dropdown-item divided>t('instance.control')</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import {ArrowDown} from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// TODO 从后端获取所有实例

</script>