<template>
    <div id="app">
        <div class="header">
            <router-link to="/">首页</router-link>
            <router-link to="/test1">test1</router-link>
            <router-link to="/test2">test2</router-link>
            <router-link to="/a">noFound</router-link>
        </div>
        <router-view></router-view>
        
    </div>
</template>

<script>
export default {
    name: 'app',
};
</script>

<style lang="scss" scoped>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /* color: #2c3e50; */
    margin-top: 60px;
    transform: rotate(0deg);
}
</style>

