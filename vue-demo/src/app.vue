<template>
    <div id="app">
        <div>
            hello world, count : 
            <span class="red">{{loading ? 'loading...' : count}}</span>
        </div>
        <div>
            <div class="btn" @click="addCount">add count</div>
        </div>
        <div class="wrap">
            <div>
                <div>gif</div>
                <img src="./static/images/smart.gif" alt="">
            </div>
            <div>
                <div>1</div>
                <img src="./static/images/1.jpg" alt="">
            </div>
            <div>
                <div>2</div>
                <img src="./static/images/2.jpg" alt="">
            </div>
            <div>
                <div>3</div>
                <div class="img-bg-1"></div>
            </div>
            <div>
                <div>4</div>
                <div class="img-bg-2"></div>
            </div>
            <div>
                <div>5</div>
                <div class="global-test"></div>
            </div>
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
img {
    width: 100px;
}
@mixin img-bg {
    width: 100%;
    height: 120px;
    background-size: 100px;
}
.img-bg-1 {
    background: url(./static/images/1.jpg) no-repeat center top;
    @include img-bg();
}
.img-bg-2 {
    background: url(./static/images/2.jpg) no-repeat center top;
    @include img-bg();
}
.wrap {
    display: flex;
    &>div {
        flex: 1;
    }
}
</style>

