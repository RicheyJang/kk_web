<template>
  <base-container v-loading.fullscreen.lock="loading">
    <template #title>{{title}}</template>

    <!--新增按钮-->
    <el-row justify="end">
      <el-button @click="handleClickAddUser" :icon="Plus" plain size="large" class="add-button"/>
    </el-row>
    <!--中央表格-->
    <base-table class="user-table" :page="page" :table-data="userTable"
                :empty="t('empty.user')" @current-change="handleChangePage">
      <el-table-column prop="id" label="ID" fixed/>
      <el-table-column prop="name" :label="t('label.username')" />
      <el-table-column prop="level" :label="t('label.level')" />
      <el-table-column prop="status" :label="t('label.status')" />
      <el-table-column prop="lastLogin" :label="t('label.lastLogin')" />
      <el-table-column prop="lastIP" :label="t('label.lastIP')" />
      <el-table-column prop="createTime" :label="t('label.createTime')" />

      <!--指定用户操作-->
      <el-table-column align="center">
        <template #default="scope">
          <el-dropdown placement="right" trigger="click" v-if="store.state.username !== scope.row.name">
            <el-icon :size="20" color="#8c8c8c" class="more-button">
              <more-filled />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleFreeze(scope.row)">{{scope.row.isFrozen? t('enable') : t('disable')}}</el-dropdown-item>
                <el-dropdown-item @click="handleResetPasswd(scope.row)">{{t('user.resetPassword')}}</el-dropdown-item>
                <el-dropdown-item @click="handleSetLevel(scope.row)" v-if="store.state.level >= UserLevelRoot">{{t('user.setLevel')}}</el-dropdown-item>
                <el-dropdown-item @click="handleDelUser(scope.row)" divided v-if="store.state.level >= UserLevelRoot">{{t('delete')}}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>

    </base-table>
    
  </base-container>

  <!--新增用户表单-->
  <el-dialog v-model="setLevelFormVisiable" :title="t('user.setLevel')" width="20vmax">
    <el-form :model="newLevelForm" label-position="left" label-width="auto">
      <el-form-item :label="t('label.level')">
        <el-select v-model="newLevelForm.level" :placeholder="t('holder.level')">
          <el-option :label="t('user.general')" :value="UserLevelGeneral" />
          <el-option :label="t('user.admin')" :value="UserLevelAdmin" />
          <el-option :label="t('user.root')" :value="UserLevelRoot" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setLevelFormVisiable = false">{{t('cancel')}}</el-button>
        <el-button type="primary" @click="confirmUserLevel">{{t('confirm')}}</el-button>
      </span>
    </template>
  </el-dialog>
  <!--新增用户表单 over-->

  <!--新增用户表单-->
  <el-dialog v-model="newUserFormVisiable" :title="t('title.newUser')" width="30vmax">
    <el-form :model="newUserForm" :rules="newUserRules" ref="newUserFormRef"
     label-position="left" label-width="auto" style="width: 70%; margin: 0, auto">
      <el-form-item :label="t('label.username')" prop="name">
        <el-input v-model="newUserForm.name" autocomplete="off" :placeholder="t('holder.username')" />
      </el-form-item>
      <el-form-item :label="t('label.password')" prop="password">
        <el-input v-model="newUserForm.password" autocomplete="off" :placeholder="t('holder.password')" />
      </el-form-item>
      <el-form-item :label="t('label.level')" prop="level">
        <el-select v-model="newUserForm.level" :placeholder="t('holder.level')">
          <el-option :label="t('user.general')" :value="UserLevelGeneral" />
          <el-option :label="t('user.admin')" :value="UserLevelAdmin" />
          <el-option :label="t('user.root')" :value="UserLevelRoot" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="newUserFormVisiable = false">{{t('cancel')}}</el-button>
        <el-button type="primary" @click="handleConfirmAddUser">{{t('confirm')}}</el-button>
      </span>
    </template>
  </el-dialog>
  <!--新增用户表单 over-->
</template>

<script setup>
import { MoreFilled } from '@element-plus/icons-vue';
import { getUsers, addUser, freezeUser, resetPassword, deleteUser, setUserLevel, 
 UserLevelGeneral, UserLevelAdmin, UserLevelRoot } from '../api/user'
import { serverTimeToDisplay } from '../api/utils'
import BaseContainer from '../components/common/BaseContainer.vue'
import BaseTable from '../components/common/BaseTable.vue';
import { onMounted, ref, reactive } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const store = useStore()
const { t } = useI18n()

const loading = ref(false)
const title = computed(() => {
  return t('title.allUser')
})
const page = reactive({
  current: 1,
  size: 10,
  total: 0,
})
const userTable = ref([])

// 刷新所有用户
onMounted(flushUsers)
function handleChangePage(current) {
  page.current = +current
  flushUsers()
}
function flushUsers() {
  loading.value = true
  getUsers(page.current, page.size).then(response => {
    page.total = response.data['data'].total
    userTable.value = response.data['data'].users
    for(let user of userTable.value) {
      if(user.isFrozen)
        user.status = t('label.frozen')
      else
        user.status = t('label.normal')
      switch(user.level) {
        case UserLevelAdmin:
          user.level = t('user.admin')
          break
        case UserLevelRoot:
          user.level = t('user.root')
          break
        default:
          user.level = t('user.general')
          break
      }
      user.lastLogin = serverTimeToDisplay(user.lastLogin)
      user.createTime = serverTimeToDisplay(user.createTime)
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

// 新增用户
const newUserFormVisiable = ref(false)
function handleClickAddUser() {
  newUserFormVisiable.value = true
}
const newUserFormRef = ref(null)
const newUserRules = {
  name: [{required: true, message: t('holder.username'), trigger: 'blur'}],
  password: [{required: true, message: t('holder.password'), trigger: 'blur'}],
  level: [{required: true, message: t('holder.level'), trigger: 'blur'}]
}
const newUserForm = reactive({
  name: '',
  password: '',
  level: 0,
})
function handleConfirmAddUser() {
  newUserFormRef.value.validate((valid) => {
    if (valid) { // 验证成功，新增用户
      loading.value = true
      addUser(newUserForm).then(() => {
        newUserFormVisiable.value = false
        flushUsers()
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

// 启用\禁用用户
function handleFreeze(user) {
  ElMessageBox.confirm(
    user.isFrozen? t('tip.confirmEnableUser') : t('tip.confirmDisableUser'),
    t('title.warning'),
    {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      type: 'warning',
    }
  ).then(() => {
    loading.value = true
    freezeUser(user.id, !user.isFrozen).then(response=>{ // 冻结/解冻该用户
      ElMessage({
        message: t('tip.successChange'),
        type: 'success'
      })
      flushUsers()
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

// 重置密码
function handleResetPasswd(user) {
  ElMessageBox.prompt(t('holder.password'), t('user.resetPassword'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    inputPattern: /.+/,
    inputErrorMessage: t('holder.password'),
  }).then(({ value }) => {
    loading.value = true
    resetPassword(user.id, value).then(response=>{ // 冻结/解冻该用户
      ElMessage({
        message: t('tip.successChange'),
        type: 'success'
      })
      flushUsers()
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

// 设置权限
const newLevelForm = reactive({
  id: 0,
  level: 0,
})
const setLevelFormVisiable = ref(false)
function handleSetLevel(user) {
  newLevelForm.id = user.id
  newLevelForm.level = user.level
  setLevelFormVisiable.value = true
}
function confirmUserLevel() {
  loading.value = true
  setUserLevel(newLevelForm.id, newLevelForm.level).then(response=>{
    ElMessage({
      message: t('tip.successChange'),
      type: 'success'
    })
    setLevelFormVisiable.value = false
    flushUsers()
  }).catch(err => {
    ElMessage({
      message: err.data.msg,
      type: 'error'
    })
  }).finally(() => {
    loading.value = false
  })
}

// 删除用户
function handleDelUser(user) {
  ElMessageBox.confirm(t('tip.confirmDeleteUser'),
    t('title.warning'),
    {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      type: 'warning',
    }
  ).then(() => {
    loading.value = true
    deleteUser(user.id).then(response=>{ // 冻结/解冻该用户
      ElMessage({
        message: t('tip.successDelete'),
        type: 'success'
      })
      flushUsers()
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

.user-table {
  margin: 3vh auto 0;
}

.more-button {
  cursor: pointer;
  padding: 0 3px;
  border-radius: 5px;

  transition: all .2s ease-in;
}

.more-button:hover {
  background-color: #f0f0f0;
}
</style>