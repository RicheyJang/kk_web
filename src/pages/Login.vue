<template>
<div id="login">
  <div class="login-page" >
    <h3 class="title" style="margin-bottom: 30px">{{t('login')}}</h3>
    <div class="login-tip" v-if="loginTip.length > 0">{{ loginTip }}</div>
    <el-form :model="FormDatas" :rules="rules"
      status-icon
      ref="loginForm"
      label-position="left"
      label-width="70px">
        <el-form-item :label="t('label.username')" prop="username" >
          <el-input type="text"
              v-model="FormDatas.username"
              auto-complete="off"
              :placeholder="t('holder.username')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="t('label.password')" prop="password">
          <el-input type="password"
              v-model="FormDatas.password"
              auto-complete="off"
              :placeholder="t('holder.password')"
          ></el-input>
        </el-form-item>
    </el-form>
    <el-button type="primary" class="login-button" @click="onSubmit()">{{t('login')}}</el-button>
  </div>
</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { login } from '../api/user';

const store = useStore()
const router = useRouter()
const { t } = useI18n()

const loginForm = ref(null)
const loginTip = ref('')
const FormDatas = reactive({
  username: '',
  password: '',
})
const rules = {
  username: [{required: true, message: t('holder.username'), trigger: 'blur'}],
  password: [{required: true, message: t('holder.password'), trigger: 'blur'}]
}

function onSubmit() {
  loginForm.value.validate((valid) => {
    if (valid) {
      // 成功
      login(FormDatas.username, FormDatas.password).then(response => {
        //登录成功
        store.commit('setUsername', response.data['data'].username)
        store.commit('setToken', response.data['data'].token);
        router.replace({path: '/'});
      }).catch(error => {
        console.log(t('error.loginFailed'), error.data.msg)
        loginTip.value = error.data.msg
      })
    } else {
      return false;
    }
  })
}

</script>

<style scoped>
#login{
  position: relative;
  width: 100%;
  height: 100%;

  background-color: #f6f6f6;
  background-size:100% 100%;
  margin: 0;
  padding: 0;
}
.login-page {
  position: relative;
  top: 25%;

  margin: 0 auto;
  width: 400px;
  padding: 35px 35px 35px;

  border-radius: 5px;
  background: #fff;
  border: 1px solid #eaeaea;
  /*box-shadow: 0 0 25px #cac6c6;*/
}

.login-page .login-button {
  width: 60%;
  margin-top: 30px;
}
.login-page .login-tip {
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