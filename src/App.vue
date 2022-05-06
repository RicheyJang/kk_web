<template>
  <el-config-provider :locale="elLocale">
    <router-view v-slot="{ Component }">
      <transition name="view-component-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <div class="global-footer">Key Keeper | By RicheyJang</div>
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

</script>

<style>
html, body {
  margin: 0 auto;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

.el-dialog__body {
  display: flex;
  justify-content: center;
}

.global-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 35px;
  background-color: white;

  border-top: #e0e0e0 solid 1px;
  color: #7c8e9e;
  text-align: center;
  line-height: 34px;
  font-size: 14px;
}

/* 动画过渡 */
.view-component-fade-enter-active,
.view-component-fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.view-component-fade-enter-from,
.view-component-fade-leave-to {
  opacity: 0;
}
</style>
