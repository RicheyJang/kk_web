<template>
<div>
  <base-container v-loading.fullscreen.lock="loading">
    <template #title>{{title}}</template>

    <!--新增按钮-->
    <el-row justify="end">
      <el-button :icon="Plus" plain size="large" class="add-button" @click="handleAddInstance"/>
    </el-row>
    <!--中央表格-->
    <base-table class="instance-table" :page="page" :table-data="instanceTable" :empty="t('empty.instance')"  @current-change="handleChangePage">

      <el-table-column prop="id" label="ID" fixed/>
      <el-table-column prop="identifier" :label="t('label.identifier')" />
      <el-table-column prop="status" :label="t('label.status')" />
      <el-table-column prop="keeper" :label="t('label.keeper')" />
      <el-table-column prop="users" :label="t('label.ownerID')" v-if="store.state.level == UserLevelRoot"/>
      <el-table-column prop="levelText" :label="t('label.safeLevel')" />
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

  <!--新增实例表单-->
  <el-dialog v-model="newInstanceVisiable" :title="t('title.newInstance')" width="30vmax">
    <el-form :model="newInstanceForm" :rules="newInstanceRules" ref="newInstanceFormRef"
     label-position="left" label-width="auto" style="width: 70%; margin: 0, auto">
      <el-form-item :label="t('label.identifier')" prop="identifier">
        <el-input v-model="newInstanceForm.identifier" autocomplete="off" :placeholder="t('holder.identifier')" />
      </el-form-item>
      <el-form-item :label="t('label.safeLevel')" prop="level">
        <el-select v-model="newInstanceForm.level" :placeholder="t('holder.defaultSafe')">
          <el-option :label="t('instance.lowSafe')" :value="0" />
          <el-option :label="t('instance.highSafe')" :value="1" />
        </el-select>
      </el-form-item>
      <!--
      <el-form-item :label="t('label.ips')">
        <el-input v-model="newInstanceForm.ips" autocomplete="off" :placeholder="t('holder.ips')" />
      </el-form-item>-->
      <el-form-item :label="t('label.keeper')" prop="keeper">
        <el-select v-model="newInstanceForm.keeper" :placeholder="t('holder.keeper')">
          <el-option v-for="keeper in allKeepers" :label="keeper" :value="keeper" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="newInstanceVisiable = false">{{t('cancel')}}</el-button>
        <el-button type="primary" @click="handleConfirmAddInstance">{{t('confirm')}}</el-button>
      </span>
    </template>
  </el-dialog>
  <!--新增实例表单 over-->

</div>
</template>

<script setup>
import { MoreFilled } from '@element-plus/icons-vue';
import { getInstances, addInstance, freezeInstance, destroyInstance } from '../api/instance';
import { UserLevelRoot } from '../api/user';
import { serverTimeToDisplay, getMetaInfo } from '../api/utils';
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
      if(instance.level > 0)
        instance.levelText = t('instance.highSafe')
      else
        instance.levelText = t('instance.lowSafe')
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

// 初始化所有keeper
const allKeepers = ref([])
function getAllKeepers() {
  getMetaInfo().then(response=>{
    allKeepers.value = response.data['data'].keepers
  }).catch(()=>{})
}
onMounted(getAllKeepers)

// 新增实例
const newInstanceVisiable = ref(false)
function handleAddInstance() {
  newInstanceVisiable.value = true
}
const newInstanceFormRef = ref(null)
const newInstanceRules = {
  identifier: [
    {required: true, message: t('holder.identifier'), trigger: 'blur'},
    {pattern: /^[\w.+-]+$/, message: t('holder.identifierCheck'), trigger: 'blur'}],
  level: [{required: true, message: t('holder.defaultSafe'), trigger: 'blur'}],
  keeper: [{required: true, message: t('holder.keeper'), trigger: 'blur'}]
}
const newInstanceForm = reactive({
  identifier: '',
  level: null,
  keeper: null,
  ips: ''
})
function handleConfirmAddInstance() {
  newInstanceFormRef.value.validate((valid) => {
    if (valid) { // 验证成功，新增实例
      loading.value = true
      addInstance(newInstanceForm).then(() => {
        newInstanceVisiable.value = false
        flushInstances()
      }).catch(err => {
        ElMessage({
          message: err.data.msg,
          type: 'error'
        })
      }).finally(() => {
        loading.value = false
      })
    } else {
      return false;
    }
  })
}

// 启用\禁用实例
function handleFreeze(instance) {
  ElMessageBox.confirm(
    instance.isFrozen? t('tip.confirmEnableInstance') : t('tip.confirmDisableInstance'),
    t('title.warning'),
    {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      type: 'warning',
    }
  ).then(() => {
    loading.value = true
    freezeInstance(instance.identifier, !instance.isFrozen).then(response=>{ // 冻结/解冻
      ElMessage({
        message: t('tip.successChange'),
        type: 'success'
      })
      flushInstances()
    }).catch(err => {
      ElMessage({
        message: err.data.msg,
        type: 'error'
      })
    }).finally(() => {
      loading.value = false
    })
  }).catch(() => {})
}

// 销毁实例
function handleDestroy(instance) {
  ElMessageBox.confirm(t('tip.confirmDestroyInstance'),
    t('title.warning'),
    {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      type: 'warning',
    }
  ).then(() => {
    loading.value = true
    destroyInstance(instance.identifier).then(response=>{
      ElMessage({
        message: t('tip.successDestroy'),
        type: 'success'
      })
      flushInstances()
    }).catch(err => {
      ElMessage({
        message: err.data.msg,
        type: 'error'
      })
    }).finally(() => {
      loading.value = false
    })
  }).catch(() => {})
}
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