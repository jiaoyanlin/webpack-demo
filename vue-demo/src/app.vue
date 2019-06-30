<template>
    <div id="app">
        <div>
            hello world, count : 
            <span class="red">{{loading ? 'loading...' : count}}</span>
        </div>
        <div>
            <div class="btn" @click="addCount">add count</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "app",
    data() {
        return {
            loading: false,
            count: 1,
        }
    },
    methods: {
        addCount() {
            if (this.loading) return ;
            return new Promise((resolve, reject) => {
                this.loading = true;
                setTimeout(() => {
                    const {count} = this;
                    this.count = count + 1;
                    this.loading = false;
                    resolve();
                }, 2000);
            });
        },
    },
};
</script>

<style lang="scss" scoped>
$red: #a00;
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /* color: #2c3e50; */
    margin-top: 60px;
    transform: rotate(0deg);
}
.red {
    color: $red;
}
.btn {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
}
</style>

