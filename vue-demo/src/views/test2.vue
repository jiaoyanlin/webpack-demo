<template>
    <div>
        test2
        <div>全局数据：{{gettersMsg}}</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'test2',
    data() {
        return {
        }
    },
    computed: { ...mapGetters(['gettersMsg']) },
    methods: {
    },
};
</script>

<style lang="scss" scoped>
</style>
