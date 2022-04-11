<template>
  <el-dropdown>
    <span class="el-dropdown-link in-select-title">
      当前实例<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu @command="handleSelectInstance">
        <el-dropdown-item>实例 1</el-dropdown-item>
        <el-dropdown-item>实例 2</el-dropdown-item>
        <el-dropdown-item divided @click="handleClickManage">{{t('instance.control')}}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import {ArrowDown} from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

// TODO 从后端获取所有实例

function handleSelectInstance(val) {
  console.log(val)
}

function handleClickManage() {
  router.push({
    name: 'Instance'
  })
}

</script>

<style scoped>
.in-select-title {
  cursor: pointer;
  font-size: 17px;
}
</style>