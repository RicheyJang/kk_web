<template>
  <base-container>
    <template #left>
      <instance-select></instance-select>
    </template>
    <template #title>{{title}}</template>

    <!--新增按钮-->
    <el-row justify="end">
      <el-button :icon="Plus" plain size="large" class="add-button"/>
    </el-row>
    <!--中央表格-->
    <el-row justify="center">
      <el-empty v-if="keyTable.length === 0" :description="t('key.empty')"/>
      <el-table v-else :data="keyTable" stripe class="key-table">
        <el-table-column prop="date" label="Date" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </el-row>
    <!--分页器-->
    <el-row justify="center">
      <el-pagination
        v-model:currentPage="page.current"
        v-model:page-size="page.size"
        :background="false"
        layout="total, prev, pager, next, jumper"
        :total="page.total"
        hide-on-single-page
        style="justify-content: center; margin-top: 10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
    
  </base-container>
</template>

<script setup>
import BaseContainer from '../components/common/BaseContainer.vue'
import InstanceSelect from '../components/instance/InstanceSelect.vue';
import { reactive } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

const title = computed(() => {
  return t('title.allKey')
})
const page = reactive({
  current: 1,
  total: 0,
  size: 10
})
const keyTable = reactive([])

// TODO 请求后端接口
</script>

<style scoped>
.add-button {
  margin-top: 2vh;
  margin-right: 120px;
}

.key-table {
  margin: 3vh auto 0;
}
</style>