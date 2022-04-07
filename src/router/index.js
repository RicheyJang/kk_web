import {createRouter, createWebHistory} from "vue-router";

const routes = [
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