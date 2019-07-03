import Vue from 'vue';
import router from '@src/router';
import App from '@views/app.vue';
import store from '@src/store/index';
import { sync } from 'vuex-router-sync';
import '@src/plugins';
import '@scss/index.scss';

// 链接vuex和vue-router
sync(store, router);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
});
