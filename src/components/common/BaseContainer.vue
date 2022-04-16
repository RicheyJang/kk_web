<template>
  <el-container style="width: 100%;">
    <el-header class="main-header">
      <!--左侧-->
      <div class="menubar" style="left: 0;">
        <slot name="left">
          <el-button @click="goBack()" v-if="canBack">{{t('back')}}</el-button>
        </slot>
      </div>

      <div class="menubar title">
        <slot name="title"></slot>
      </div>
      
      <!--右侧-->
      <div class="menubar" style="right: 0;">
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
          <el-dropdown>
            <span class="el-dropdown-link user-name" style="margin-left: 20px;">
              {{username}}<el-icon class="el-icon--right" style="transform: translateY(15%)"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">{{t('user.logout')}}</el-dropdown-item>
                <el-dropdown-item @click="handleChangePasswd">{{t('user.password')}}</el-dropdown-item>
                <el-dropdown-item v-if="store.state.level >= UserLevelAdmin" divided @click="handleClickManageUser">{{t('user.control')}}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </slot>
      </div>
    </el-header>

    <el-divider class="main-header-divider" />

    <el-main style="width: 80%; text-align: center; margin: 0 auto;">
      <slot></slot>
    </el-main>

  </el-container>
</template>

<script setup>
import { UserLevelAdmin } from '../../api/user';
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { logout } from '../../api/user';

const { t } = useI18n();
const router = useRouter();
const store = useStore();

const canBack = computed(() => {
  return window.history.length > 1;
});

function goBack() {
  router.go(-1);
}

function handleSelectLang(lang) {
  store.commit('changeLocale', lang)
}

// 用户相关操作

const username = computed(() => {
  if(store.state.username.length > 0) {
    return store.state.username
  } else {
    return t('user.name')
  }
});

function handleLogout() {
  logout().then(response => {}).catch(error => {}).finally(() => {
    store.commit('setToken', '');
    router.replace({
      name: 'Login'
    });
  });
}

function handleChangePasswd() {
  router.push({
    name: 'ChangePassword'
  });
}

function handleClickManageUser() {
  router.push({
    name: 'User'
  });
}
</script>

<style scoped>
.main-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 50;

  align-self: center;
  width: 85vw;
}

.main-header-divider {
  margin: 0;
  position: sticky;
  top: 60px;
  z-index: 50;
}

.main-header .menubar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.main-header .title {
  left: 50%;
  transform: translateX(-50%) translateY(-50%) !important;

  font-size: 20px;
  font-weight: 500;
}

.main-header .user-name {
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
}

.translate-icon {
  cursor: pointer;
  font-size: 20px;
  position: relative;
  top: 4px;
}
</style>