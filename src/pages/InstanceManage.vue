<template>
  <base-container>
    <template #title>{{title}}</template>

    <!--新增按钮-->
    <el-row justify="end">
      <el-button :icon="Plus" plain size="large" class="add-button"/>
    </el-row>
    <!--中央表格-->
    <base-table class="instance-table" :page="page" :table-data="instanceTable" :empty="t('empty.instance')">
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
    </base-table>
    
  </base-container>
</template>

<script setup>
import BaseContainer from '../components/common/BaseContainer.vue'
import BaseTable from '../components/common/BaseTable.vue';
import { reactive } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

const title = computed(() => {
  return t('title.allIncetance')
})
const page = reactive({
  current: 1,
  total: 0,
  size: 10
})
const instanceTable = reactive([])

// TODO 请求后端接口
</script>

<style scoped>
.add-button {
  margin-top: 2vh;
}

.instance-table {
  margin: 3vh auto 0;
}
</style>