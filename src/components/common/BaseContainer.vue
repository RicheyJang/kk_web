<template>
  <el-container>
    <el-header class="main-header">
      <!--左侧-->
      <div class="toolbar" style="left: 0;">
        <slot name="left">
          <el-button @click="goBack()">{{t('back')}}</el-button>
        </slot>
      </div>
      
      <!--右侧-->
      <div class="toolbar" style="right: 0;">
        <el-dropdown @command="handleSelectLang">
            <i class="el-icon translate-icon el-tooltip__trigger">
              <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1.2em" height="1.2em">
              <path fill="currentColor" d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301a14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725a16.676 16.676 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877a16.165 16.165 0 0 0 2.91-4.876L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"></path>
              </svg>
            </i>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        <slot name="right">
          <span style="margin-left: 20px;">{{t('user')}}</span>
        </slot>
      </div>
    </el-header>

    <el-divider style="margin: 0;" />

    <el-main>
      <slot></slot>
    </el-main>

  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
const { t } = useI18n();
const router = useRouter();
const store = useStore();

function goBack() {
  router.go(-1);
}

function handleSelectLang(lang) {
  store.commit('changeLocale', lang)
}
</script>

<style scoped>
.main-header {
  align-self: center;
  position: relative;
  width: 85vw;
}

.main-header .toolbar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.translate-icon {
  cursor: pointer;
  font-size: 20px;
  position: relative;
  top: 4px;
}
</style>