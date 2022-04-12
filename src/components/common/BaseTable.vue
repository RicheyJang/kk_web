<template>
  <div>
    <!--中央表格-->
    <el-row justify="center">
      <el-empty v-if="tableData.length === 0" :description="empty.length !== 0? empty : t('empty.default')"/>
      <el-table v-else :data="tableData" stripe class="base-table">
        <slot></slot>
      </el-table>
    </el-row>
    <!--分页器-->
    <el-row justify="center">
      <el-pagination
        :currentPage="page.current"
        @update:currentPage="handleCurrentChange"
        :page-size="page.size"
        :background="false"
        layout="total, prev, pager, next, jumper"
        :total="page.total"
        hide-on-single-page
        style="justify-content: center; margin-top: 10px;"
      />
    </el-row>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

const props = defineProps({
  tableData: {
    default: [],
    type: Array,
    required: true
  },
  page: {
    default: {
      current: 1,
      total: 0,
      size: 10
    },
    type: Object,
    required: true
  },
  empty: {
    default: '',
    type: String
  }
})
const emit = defineEmits(['current-change'])

function handleCurrentChange(val) {
  emit('current-change', val)
}
</script>

<style scoped>
.base-table {
  margin: 0 auto 0;
}
</style>