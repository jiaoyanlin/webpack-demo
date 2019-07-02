import Vue from 'vue';
import router from '@src/router';
import App from '@views/app.vue';
import store from '@src/store/index';
import '@scss/index.scss';
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
});
