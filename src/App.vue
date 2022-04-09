<template>
  <el-config-provider :locale="elLocale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import { computed,ref,onMounted,watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

// 语种列表
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import enUS from 'element-plus/lib/locale/lang/en';

// 切换语言
let elLocale = ref(zhCn)
const { t, locale } = useI18n()
function changeLocale(v = 'zh-CN') {
  locale.value = v
  switch (v) {
    case "zh-CN":
      elLocale.value = zhCn
      break
    case "en":
      elLocale.value = enUS
      break
    default:
      elLocale.value = zhCn
      locale.value = "zh-CN"
      return
  }
}
let store = useStore()
onMounted(()=>{
  changeLocale(store.state.locale)
})
watch(()=>store.state.locale, (val, old) => {
  changeLocale(store.state.locale)
})

// 是否已登录
const isLogin = computed(() => {
  // TODO 登录验证
  return true;
});
</script>

<style>
body {
  margin: 0 auto;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
