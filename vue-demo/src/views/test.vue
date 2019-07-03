<template>
    <div>
        首页：test
        <div>{{gettersMsg}}</div>
        <a-button type="primary" @click="onClick">点击改变数据</a-button>
        <ul>
            <li>1、测试下</li>
            <li>1、测试下</li>
            <li>1、测试下</li>
            <li>1、测试下</li>
        </ul>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'test',
    data() {
        return {};
    },
    computed: { ...mapGetters(['gettersMsg']) },
    methods: {
        ...mapActions(['changeMsg']),
        onClick() {
            this.changeMsg();
            this.$message.success('改变数据成功');
            this.$Modal.confirm({
                title: 'title1',
                content: 'content',
            })
        }
    },
};
</script>

<style lang="scss" scoped>
</style>
