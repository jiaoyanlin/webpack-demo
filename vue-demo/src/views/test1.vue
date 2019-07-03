<template>
    <div>
        <div>
            test1, count : 
            <span class="red">{{loading ? 'loading...' : count}}</span>
        </div>
        <div>
            <div class="btn" @click="addCount">add count</div>
        </div>
        <div class="wrap">
            <div>
                <div>gif</div>
                <img src="@images/smart.gif" alt="">
            </div>
            <div>
                <div>1</div>
                <img src="@images/1.jpg" alt="">
            </div>
            <div>
                <div>2</div>
                <img src="@images/2.jpg" alt="">
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
    name: 'test',
    data() {
        return {
            loading: false,
            count: 1,
        }
    },
    methods: {
        addCount() {
            if (this.loading) return ;
            return new Promise((resolve) => {
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
@import '@scss/theme.scss';
.red {
    color: $red;
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
    background: url(~@images/1.jpg) no-repeat center top;
    @include img-bg();
}
.img-bg-2 {
    background: url(~@images/2.jpg) no-repeat center top;
    @include img-bg();
}
.wrap {
    display: flex;
    &>div {
        flex: 1;
    }
}
</style>
