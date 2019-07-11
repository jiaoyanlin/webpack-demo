<template>
    <div>
        登录页面
        <div class="btn" @click="onLogin">登录</div>
    </div>
</template>

<script>
import util from '@src/util';
export default {
    methods: {
        onLogin() {
            util.setToken('test-token');
            this.$router.push('/');
        }
    },
    created() {
        if (util.getToken()) this.$router.replace({ name: 'home' });
    }
};
</script>

<style lang="scss" scoped>
</style>
