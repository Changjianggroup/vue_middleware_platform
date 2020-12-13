import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '*',
            redirect: '/404'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: {title: '自述文件'},
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: {title: '系统首页'}
                },
                {
                    path: '/redis/management',
                    component: () => import('../components/page/redisManagement'),
                    meta: {title: 'redis集群管理'}
                    },
                {
                    path: '/redis/operation',
                    component: () => import('../components/page/redisOperation'),
                    meta: {title: 'redis操作'}
                    },
                {
                    path: '/perm/groups',
                    component: () => import('../components/page/perm/groups'),
                    meta: {title: '组设置'}
                },
                {
                    path: '/perm/users',
                    component: () => import('../components/page/perm/users'),
                    meta: {title: '用户设置'}
                },
                {
                    path: '/rabbitmq/management',
                    component: () => import('../components/page/rabbitmqManagement'),
                    meta: {title: 'rabbitmq集群管理'}
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                    },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
                    ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        }
        ]
});
