<template>
    <div>
        <h2>jsVIew</h2>
        <pre>
            <code>
                // Add a request interceptor
                axios.interceptors.request.use(function (config) {
                    const token = store.getState().session.token;
                    config.headers.Authorization =  token;

                    return config;
                });
            </code>
        </pre>
    </div>
</template>

<script>
export default {
    name: 'jsVIew',
    data() {
        return {
        }
    },
    methods: {
    },
};
</script>

<style lang="scss" scoped>
pre {
    background: #eee;
    border-radius: 10px;
    margin-top: 10px;
}
</style>
