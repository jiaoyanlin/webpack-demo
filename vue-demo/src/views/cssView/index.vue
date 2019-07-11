<template>
    <div>
        cssview
        <div>全局数据：{{gettersMsg}}</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'cssview',
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
