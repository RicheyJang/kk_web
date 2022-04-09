import {createRouter, createWebHistory} from "vue-router";
import KeyManage from "../pages/KeyManage.vue"

const routes = [
    {
        path: '/',
        name: 'KeyManage',
        component: KeyManage
    },
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

export default router