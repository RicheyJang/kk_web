<template>
  <base-container>
    <template #title>{{t('title.changePasswd')}}</template>

    <div id="password">
      <div class="password-page" >
        <h3 class="title" style="margin-bottom: 35px">{{t('title.changePasswd')}}</h3>
        <div class="password-tip" v-if="passwordTip.length > 0">{{ passwordTip }}</div>
        <el-form :model="FormDatas" :rules="rules"
          status-icon
          ref="passwordForm"
          label-position="left"
          label-width="90px">
            <el-form-item :label="t('label.oldPassword')" prop="oldPassword">
              <el-input type="password"
                  v-model="FormDatas.oldPassword"
                  :placeholder="t('holder.password')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="t('label.newPassword')" prop="password">
              <el-input type="password"
                  v-model="FormDatas.password"
                  :placeholder="t('holder.password')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="t('label.again')" prop="passwordAgain">
              <el-input type="password"
                  v-model="FormDatas.passwordAgain"
                  :placeholder="t('holder.passwordAgain')"
              ></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" class="password-button" @click="onSubmit()">{{t('change')}}</el-button>
      </div>
    </div>
  </base-container>
</template>

<script setup>
import { changePassword } from '../api/user';
import BaseContainer from '../components/common/BaseContainer.vue';
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const store = useStore();
const router = useRouter();

const passwordForm = ref(null)
const passwordTip = ref('')
const FormDatas = reactive({
  oldPassword: '',
  password: '',
  passwordAgain: ''
})

// 表单校验
function checkAgainPass(rule, value, callback) {
  if (value !== FormDatas.password) {
    callback(new Error(t('error.passwordAgain')));
  } else {
    callback()
  }
}
function checkNewPass(rule, value, callback) {
  if (value === FormDatas.oldPassword) {
    callback(new Error(t('error.sameOldPasswd')));
  } else {
    callback()
  }
}
const rules = {
  oldPassword: [{required: true, message: t('holder.password'), trigger: 'blur'}],
  password: [
    {required: true, message: t('holder.password'), trigger: 'blur'},
    {validator: checkNewPass, trigger: 'blur'}],
  passwordAgain: [
    {required: true, message: t('holder.passwordAgain'), trigger: 'blur'},
    {validator: checkAgainPass, trigger: 'blur'}]
}

// 提交修改
function onSubmit() {
  passwordForm.value.validate((valid) => {
    if (valid) {
      changePassword(FormDatas.oldPassword, FormDatas.password).then(response => {
        ElMessage({
          message: t('tip.successChange'),
          type: 'success',
        })
      }).catch(error => {
        passwordTip.value = error.data.msg
      })
    } else {
      return false;
    }
  })
}

</script>

<style scoped>
#password{
  position: relative;
  width: 100%;
  height: 100%;

  margin: 18vh auto 0;
  padding: 0;
}
.password-page {
  margin: 0 auto;
  width: 400px;
  padding: 20px 35px 35px;

  border-radius: 5px;
  background: #fff;
  border: 1px solid #eaeaea;
  /*box-shadow: 0 0 25px #cac6c6;*/
}

.password-page .password-button {
  width: 60%;
  margin-top: 30px;
}
.password-page .password-tip {
  width: 95%;
  margin: 0 auto 15px;
  padding: 10px 0;

  font-size: 15px;
  color: #9f3a38;
  background-color: #fff6f6;
  border: 1px solid #ebcbcc;
  border-radius: 8px;
}
</style>