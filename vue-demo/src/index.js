import Vue from 'vue';
import router from '@src/router';
import App from '@views/app.vue';
// import "core-js/modules/es6.promise";
// import "core-js/modules/es6.array.iterator";
import '@scss/index.scss';
new Vue({
    el: '#app',
    router,
    render: h => h(App),
});
