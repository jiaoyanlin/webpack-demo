export default [
    {
        path: '/auth/login',
        name: 'login',
        component: () => import( /* webpackChunkName: "auth" */ '@views/auth/login.vue'),
        meta: {
            requiresAuth: false,
        }
    },

    {
        path: '/auth/reset',
        name: 'reset',
        component: () => import( /* webpackChunkName: "auth" */ '@views/auth/reset.vue'),
    },
]
