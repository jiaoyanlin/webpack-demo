export const changeMsg = ({ commit }) => {
    commit({
        type: 'mutationsMsg', // 对应mutation.js中的mutationsMsg方法
        globalMsg: '我是修改后的全局数据~~~'
    });
};
