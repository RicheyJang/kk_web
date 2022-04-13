<template>
  <base-container>
    <template #left>
      <instance-select :current-instance="identifier" :instances="store.state.instances"></instance-select>
    </template>
    <template #title>{{title}}</template>

    <!--新增按钮-->
    <el-row justify="end">
      <el-button :icon="Plus" plain size="large" class="add-button"/>
    </el-row>
    <!--中央表格-->
    <base-table class="key-table" :page="page" :table-data="keyTable" :empty="t('empty.key')">
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
    </base-table>
    
  </base-container>
</template>

<script setup>
import BaseContainer from '../components/common/BaseContainer.vue'
import InstanceSelect from '../components/instance/InstanceSelect.vue';
import BaseTable from '../components/common/BaseTable.vue';
import { onMounted, ref, reactive, watch } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const route = useRoute()
const store = useStore()
const { t } = useI18n()

const title = computed(() => {
  return t('title.allKey')
})
const identifier = ref('')
const page = reactive({
  current: 1,
  total: 0,
  size: 10
})
const keyTable = reactive([])

// 初始化
onMounted(()=>{
  store.dispatch('flushInstances')
  flushKeys()
})
watch(()=>route.params, (toParams, previousParams) => {
  flushKeys()
})

// 获取所有密钥
function flushKeys() {
  identifier.value = route.params.instance
  // TODO 请求后端接口
}
</script>

<style scoped>
.add-button {
  margin-top: 2vh;
}

.key-table {
  margin: 3vh auto 0;
}
</style>