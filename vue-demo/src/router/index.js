import Vue from 'vue';
import VueRouter from 'vue-router';
import util from '@src/util';
import Home from '@views/home/index';
import NoFound from '@views/noFound';
import auth from './auth';

Vue.use(VueRouter);

const menuRoutes = [{
    path: '/',
    name: 'home',
    text: '前端概览',
    component: Home,
}, {
    path: '/html',
    name: 'html',
    text: 'html基础知识',
    component: () =>
        import(/* webpackChunkName: "sync_html" */ '@views/htmlView/index.vue'),
}, {
    path: '/css',
    name: 'css',
    text: 'css基础知识',
    component: () =>
        import(/* webpackChunkName: "sync_css" */ '@views/cssView/index.vue'),
}, {
    path: '/js',
    name: 'js',
    text: 'js基础知识',
    component: () =>
        import(/* webpackChunkName: "sync_js" */ '@views/jsView/index.vue'),
}, {
    path: '/frame',
    name: 'frame',
    text: '前端框架',
    component: () =>
        import(/* webpackChunkName: "sync_frame" */ '@views/frame/index.vue'),
}];

const otherRoutes = [
    ...auth,
    {
        path: '*',
        name: 'noFound',
        component: NoFound
    }
];

const router = new VueRouter({
    // mode: 'history',  //使用history防止url中出现#
    routes: menuRoutes.concat(otherRoutes)
});

router.beforeEach((to, from, next) => {
    const isAuth = /^(\/auth\/(login|reset))/gi.test(to.path);
    let token = util.getToken();
    if (isAuth || token) {
        next();
    } else {
        next({name: 'login'});
    }
});

export const routes = menuRoutes;
export default router;
