<template>
  <base-container v-loading.fullscreen.lock="loading">
    <template #left><span> </span></template>
    <template #title>{{title}}</template>

    <!--新增按钮-->
    <el-row justify="end">
      <el-button :icon="Plus" plain size="large" class="add-button"/>
    </el-row>
    <!--中央表格-->
    <base-table class="instance-table" :page="page" :table-data="instanceTable" :empty="t('empty.instance')"  @current-change="handleChangePage">

      <el-table-column prop="id" label="ID" fixed/>
      <el-table-column prop="identifier" :label="t('label.identifier')" />
      <el-table-column prop="status" :label="t('label.status')" />
      <el-table-column prop="keeper" :label="t('label.keeper')" />
      <el-table-column prop="users" :label="t('label.ownerID')" v-if="store.state.level === UserLevelRoot"/>
      <el-table-column prop="level" :label="t('label.safeLevel')" />
      <!--<el-table-column prop="ips" :label="t('label.IPs')" />-->
      <el-table-column prop="createTime" :label="t('label.createTime')" />

      <!--指定实例操作-->
      <el-table-column align="center">
        <template #default="scope">
          <el-button size="small" @click="handleManageKeys(scope.row)">{{t('instance.manageKeys')}}</el-button>
          <el-dropdown placement="right" trigger="click">
            <el-icon :size="20" color="#8c8c8c" class="more-button">
              <more-filled />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleFreeze(scope.row)">{{scope.row.isFrozen? t('enable') : t('freeze')}}</el-dropdown-item>
                <!--<el-dropdown-item @click="handleChange(scope.row)">{{t('change')}}</el-dropdown-item>-->
                <el-dropdown-item @click="handleDestroy(scope.row)" divided>{{t('destroy')}}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>

    </base-table>
    
  </base-container>
</template>

<script setup>
import { MoreFilled } from '@element-plus/icons-vue';
import { getInstances } from '../api/instance';
import { UserLevelRoot } from '../api/user';
import { serverTimeToDisplay } from '../api/utils';
import BaseContainer from '../components/common/BaseContainer.vue';
import BaseTable from '../components/common/BaseTable.vue';
import { onMounted, ref, reactive } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const router = useRouter()
const store = useStore()
const { t } = useI18n()

const loading = ref(false)
const title = computed(() => {
  return t('title.allIncetance')
})
const page = reactive({
  current: 1,
  total: 0,
  size: 10
})
const instanceTable = ref([])

// 刷新所有实例
onMounted(flushInstances)
function handleChangePage(current) {
  page.current = +current
  flushInstances()
}
function flushInstances() {
  loading.value = true
  getInstances(page.current, page.size).then(response => {
    page.total = response.data['data'].total
    instanceTable.value = response.data['data'].instances
    for(let instance of instanceTable.value) {
      if(instance.isFrozen)
        instance.status = t('label.frozen')
      else
        instance.status = t('label.normal')
      instance.createTime = serverTimeToDisplay(instance.createTime)
    }
    store.commit('setInstances', instanceTable.value.map(v => v.identifier))
  }).catch(err => {
    ElMessage({
      message: err.data.msg,
      type: 'error'
    })
  }).finally(() => {
    loading.value = false
  })
}

// 管理密钥
function handleManageKeys(instance) {
  router.push({
    name: 'Keys',
    params: {
      instance: instance.identifier
    }
  })
}

// TODO 冻结/解冻 销毁实例
</script>

<style scoped>
.add-button {
  margin-top: 2vh;
}

.instance-table {
  margin: 3vh auto 0;
}

.more-button {
  cursor: pointer;
  padding: 0 3px;
  margin-left: 12px;
  border-radius: 5px;

  transition: all .2s ease-in;
}

.more-button:hover {
  background-color: #f0f0f0;
}
</style>