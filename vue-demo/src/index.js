import Vue from 'vue';
import router from '@src/router';
import App from '@views/app.vue';
import store from '@src/store/index';
import { sync } from 'vuex-router-sync';
import '@src/plugins';
import '@scss/index.scss';

if (process.env.CUSTOM_MODE !== 'production') {
    console.log('CUSTOM_ISDEV:', process.env.CUSTOM_ISDEV);
    console.log('CUSTOM_MODE:', process.env.CUSTOM_MODE);
    console.log('CUSTOM_DOMAIN:', process.env.CUSTOM_DOMAIN);
    console.log('CUSTOM_ENV:', process.env.CUSTOM_ENV);
}

// 链接vuex和vue-router
sync(store, router);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
});
