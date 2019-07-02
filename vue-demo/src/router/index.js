import Vue from 'vue';
import VueRouter from 'vue-router';
import Test from '../views/test';
// import Test1 from '@views/test1';
import Test2 from '@views/test2';
import NoFound from '@views/noFound';

Vue.use(VueRouter);

export default new VueRouter({
    // mode: 'history',  //使用history防止url中出现#
    routes: [
        {
            path: '/',
            name: 'test',
            component: Test
        }
        , {
            path: '/test1',
            name: 'test1',
            component: () =>
                import(/* webpackChunkName: "test1" */ '@views/test1.vue'),
        },
        , {
            path: '/test2',
            name: 'test2',
            // component: Test2
            component: () =>
                import(/* webpackChunkName: "test2" */ '@views/test2.vue'),
        }
        , {
            path: '*',
            name: 'noFound',
            component: NoFound
        }
    ]
});
