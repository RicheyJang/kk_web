<template>
<div>
  <base-container v-loading.fullscreen.lock="loading">
    <template #left>
      <instance-select :current-instance="identifier" :instances="store.state.instances"></instance-select>
    </template>
    <template #title>{{title}}</template>

    <!--新增按钮-->
    <el-row justify="end">
      <el-button :icon="Plus" plain size="large" class="add-button" @click="handleAddKey"/>
    </el-row>
    <!--中央表格-->
    <base-table class="key-table" :page="page" :table-data="keyTable" :empty="t('empty.key')">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="version" :label="t('label.version')" />
      <el-table-column prop="length" :label="t('label.keyLength')" />
      <el-table-column prop="algorithm" :label="t('label.algorithm')" />
      <el-table-column prop="timeout" :label="t('label.rotateTime')" />

      <!--指定实例操作-->
      <el-table-column align="center" :label="t('label.operation')">
        <template #default="scope">
          <el-button size="small" type="danger" plain @click="handleDestroy(scope.row)">{{t('keys.destroy')}}</el-button>
        </template>
      </el-table-column>

    </base-table>
    
  </base-container>

  <!--新增密钥表单-->
  <el-dialog v-model="newKeyFormVisitable" :title="t('title.newKey')" width="30vmax">
    <el-form :model="newKeyForm" :rules="newKeyRules" ref="newKeyFormRef"
     label-position="left" label-width="100px" style="width: 70%; margin: 0, auto">
      <el-form-item label="ID" prop="id">
        <el-input-number v-model="newKeyForm.id" :min="1" :max="4294967295" size="large"/>
      </el-form-item>
      <el-form-item :label="t('label.keyLength')" prop="length">
        <el-select v-model="newKeyForm.length" :placeholder="t('holder.keyLength')">
          <el-option label="16" :value="16" />
          <el-option label="24" :value="24" />
          <el-option label="32" :value="32" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('label.algorithm')" prop="algorithm">
        <el-select v-model="newKeyForm.algorithm" :placeholder="t('holder.algorithm')">
          <el-option label="AES CBC" value="aes-cbc" />
          <el-option label="AES ECB" value="aes-ecb" />
          <el-option label="AES CTR" value="aes-ctr" />
          <el-option label="AES GCM" value="aes-gcm" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('label.isRotational')">
        <el-select v-model="newKeyForm.isRotational" :placeholder="t('holder.isRotational')">
          <el-option :label="t('keys.unRotational')" :value="false" />
          <el-option :label="t('keys.rotational')" :value="true" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="newKeyForm.isRotational" :label="t('label.rotateInterval')" prop="rotationTime">
        <el-input v-model.number="newKeyForm.rotationTime" :placeholder="t('holder.rotationTime')" >
          <template #append>{{t('seconds')}}</template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="newKeyFormVisitable = false">{{t('cancel')}}</el-button>
        <el-button type="primary" @click="handleConfirmAddKey">{{t('confirm')}}</el-button>
      </span>
    </template>
  </el-dialog>
  <!--新增密钥表单 over-->
</div>
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
import { getKeys, addKey, destroyKey } from '../api/keys';
import { serverTimeToDisplay } from '../api/utils';

const route = useRoute()
const store = useStore()
const { t } = useI18n()

const loading = ref(false)
const title = computed(() => {
  if(route.params.hasOwnProperty('instance') && route.params.instance.length != 0)
    return route.params.instance + t('ps') + t('title.allKey')
  return t('title.allKey')
})
const identifier = ref('')
const page = reactive({
  current: 1,
  total: 0,
  size: 10
})
const keyTable = ref([])

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
  if (!route.params.hasOwnProperty('instance') || route.params.instance === '') {
    return
  }
  identifier.value = route.params.instance
  loading.value = true
  getKeys(identifier.value, page.current, page.size).then(response => {
    page.total = response.data['data'].total
    keyTable.value = response.data['data'].keys
    for(let key of keyTable.value) {
      key.timeout = serverTimeToDisplay(key.timeout * 1000)
    }
  }).catch(err => {
    ElMessage({
      message: err.data.msg,
      type: 'error'
    })
  }).finally(() => {
    loading.value = false
  })
}

// 新建密钥
const newKeyFormVisitable = ref(false)
function handleAddKey() {
  newKeyForm.id = page.total + 1
  newKeyFormVisitable.value = true
}
const newKeyFormRef = ref(null)
const newKeyRules = {
  id: [ {required: true, message: t('holder.id'), trigger: 'blur'}],
  length: [{required: true, message: t('holder.keyLength'), trigger: 'blur'}],
  algorithm: [{required: true, message: t('holder.algorithm'), trigger: 'blur'}],
  rotationTime: [
    {validator: (rule, value, callback) => {
      if (newKeyForm.isRotational && (value == null || +value <= 0)) {
        callback(new Error(t('holder.rotationRightTime')))
      } else {
        callback()
      }
    }, trigger: 'blur'}]
}
const newKeyForm = reactive({
  id: null,
  length: 32,
  algorithm: '',
  isRotational: false,
  rotationTime: 3600,
})
function handleConfirmAddKey() {
  newKeyFormRef.value.validate((valid) => {
    if (valid) { // 验证成功，新增密钥
      loading.value = true
      if(!newKeyForm.isRotational) { // 不轮替
        newKeyForm.rotationTime = 0
      }
      addKey(identifier.value, newKeyForm).then(() => {
        newKeyFormVisitable.value = false
        flushKeys()
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


// 销毁密钥
function handleDestroy(key) {
  ElMessageBox.confirm(t('tip.confirmDestroyKey'),
    t('title.warning'),
    {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      type: 'warning',
    }
  ).then(() => {
    loading.value = true
    destroyKey(identifier.value, key.id).then(response=>{
      ElMessage({
        message: t('tip.successDestroy'),
        type: 'success'
      })
      flushKeys()
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

.key-table {
  margin: 3vh auto 0;
}
</style>