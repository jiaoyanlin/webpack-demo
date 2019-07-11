<template>
    <div id="app">
        <!-- 已登陆 -->
        <template v-if="isLogin">    
            <div class="app-header">
                <div class="logo-wrap">
                    <img class="logo" src="@images/logo.png" alt="">
                    <div class="logo-text">前端</div>
                </div>
                <div class="user-wrap">
                    <a-dropdown :trigger="['click']">
                        <div class="user-info">你好，林小林 <a-icon type="down" /></div>
                        <a-menu slot="overlay">
                            <a-menu-item key="0">
                                <div class="log-out" @click="onLogout">退出登录</div>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </div>
            </div>
            <div class="app-main">
                <div class="app-aside">
                    <a-menu mode="inline" :selectedKeys="[current]" style="width: 100%">
                        <a-menu-item v-for="route in routes" :key="route.name">
                            <router-link :to="route.path">{{route.text}}</router-link>
                        </a-menu-item>
                    </a-menu>
                </div>
                <div class="app-content-wrap">
                    <div class="app-content">
                        <div class="app-content-bg">
                            <router-view></router-view>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <!-- 未登录 -->
        <template v-else>
            <router-view></router-view>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { routes } from '@src/router';
import util from '@src/util';
export default {
    name: 'app',
    data() {
        return {
            current: '',
            routes: [],
            isLogin: false, // 是否已登录
        };
    },
    computed: {
        ...mapState({
            nowRoute: state => state.route
        }),
    },
    watch: {
        'nowRoute.name': {
            immediate: true,
            handler(value) {
                this.current = value || '';
                this.isLogin = !!util.getToken();
            }
        }
    },
    methods: {
        onLogout() {
            util.removeToken();
            this.$router.replace({name: 'login'});
        }
    },
    created() {
        this.routes = routes;
    },
};
</script>

<style lang="scss" scoped>
@import '@scss/mixin.scss';
$headerHei: 60px;
$maxWidth: 900px;
$minWidth: 800px;
#app {
    @include wh();
    min-width: $minWidth;
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
}
.app-header {
    @include pos-a-wh(0, 0, 100%, $headerHei);
    z-index: 10;
    background-color: $primary-color;
    color: #fff;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    .logo-wrap {
        display: flex;
        align-items: center;
    }
    .logo {
        @include wh(50px, 50px);
        margin-right: 10px;
    }
    .user-wrap {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
}
.app-main {
    @include pos-a-wh();
    z-index: 1;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    padding-top: $headerHei;
    display: flex;
}
.app-aside {
    @include wh(200px, 100%);
    background-color: #fff;
}
.app-content-wrap {
    flex: 1;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}
.app-content {
    @include wh();
    overflow: auto;
    padding: 20px 10px 20px 20px;
}
.app-content-bg {
    background-color: #fff;
    padding: $com-padding;
    margin: 0 auto;
    max-width: $maxWidth;
}
.ant-menu-item {
    text-align: center;
    padding: 0 !important;
}
</style>

