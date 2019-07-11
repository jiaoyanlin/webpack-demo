<template>
    <div>
        <h2>前端概览</h2>
        <div>{{gettersMsg}}</div>
        <a-button type="primary" @click="onClick">点击改变数据</a-button>
        <ul>
            <li v-for="item in data" :key="item.index">{{item.text}}</li>
        </ul>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'test',
    data() {
        return {
            data: []
        };
    },
    computed: { ...mapGetters(['gettersMsg']) },
    methods: {
        ...mapActions(['changeMsg']),
        onClick() {
            this.changeMsg();
            this.$message.success('改变数据成功');
            // this.$Modal.confirm({
            //     title: 'title1',
            //     content: 'content',
            // })
        }
    },
    mounted() {
        let data = [];
        for (let i = 0; i < 50; i++) {
            data.push({
                index: i,
                text: `这是第${i}条数据`
            });
        }
        this.data = data;
    },
};
</script>

<style lang="scss" scoped>
</style>
