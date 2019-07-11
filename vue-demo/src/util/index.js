import local from './local';

export default {
    local,
    setToken: (token) => {
        console.log('----token', token)
        local.set('token', token)
    },
    getToken: () => local.get('token'),
    removeToken: () => local.remove('token'),
};
