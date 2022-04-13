import {createRouter, createWebHistory} from "vue-router";
import InstanceManage from "../pages/InstanceManage.vue";
import KeyManage from "../pages/KeyManage.vue";
import store from "../store/index";

const routes = [
    {
        path: '/',
        redirect: '/instance'
    },
    {
        path: '/keys/:instance',
        name: 'Keys',
        component: KeyManage
    },
    {
        path: '/instance',
        name: 'Instance',
        component: InstanceManage
    },
    {
        path: '/user',
        name: 'User',
        component: () => import('../pages/UserManage.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../pages/Login.vue')
    },
    {
        path: '/password',
        name: 'ChangePassword',
        component: () => import('../pages/ChangePassword.vue')
    }
    // {   // 404 页面
    //     path: '/:pathMatch(.*)*',
    //     name: 'NotFound',
    //     component: NotFound
    // },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from) => {
    if(to.name == 'Login')
        return true
    if(store.state.token.length === 0)
        return {name: 'Login'}
    return true
})

export default router