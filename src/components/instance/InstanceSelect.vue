<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link in-select-title">
      {{ currentInstance.length > 0? currentInstance : t('label.instance') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="instance in instances" @click="handleSelectInstance(instance)"
                          :class="{'current-instance': instance === currentInstance}">{{instance}}</el-dropdown-item>
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

const props = defineProps({
  currentInstance: {
    type: String,
    default: ''
  },
  instances: {
    type: Array,
    default: []
  }
})

function handleSelectInstance(val) {
  router.push({
    name: 'Keys',
    params: {
      instance: val
    }
  })
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

:deep(.current-instance) {
  color: #5db799 !important;
}
</style>