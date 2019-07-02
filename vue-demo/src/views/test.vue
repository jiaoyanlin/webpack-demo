<template>
    <div>
        首页：test
        <div>{{gettersMsg}}</div>
        <div class="btn" @click="changeMsg">点击改变数据</div>
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
    methods: { ...mapActions(['changeMsg']) }
};
</script>

<style lang="scss" scoped>
</style>
