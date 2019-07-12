const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        // 将数组中的模块作为入口编译成动态链接库
        'vendor': ['vue', 'vue-router', 'vuex', 'vuex-router-sync', '@ant-design/icons/lib/dist']
    },
    output: {
        // 指定生成文件所在目录
        // 由于每次打包生产环境时会清空 dist 文件夹，因此这里我将它们存放在了dll文件夹下
        path: path.resolve(__dirname, '../dll'),
        // 指定文件名并添加hash
        filename: '[name].[contenthash:6].dll.js',
        // 存放动态链接库的全局变量名称，加上 _dll_ 是为了防止全局变量冲突：例如对应 vendor 来说就是 _dll_vendor
        // 这个名称需要与 DllPlugin 插件中的 name 属性值对应起来
        library: '_dll_[name]'
    },
    plugins: [
        new CleanWebpackPlugin(),
        // 接入 DllPlugin
        new webpack.DllPlugin({
            // 描述动态链接库的 manifest.json 文件输出时的文件名称
            path: path.join(__dirname, '../dll', '[name].manifest.json'),
            // 动态链接库的全局变量名称，需要和 output.library 中保持一致
            // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
            // 例如 venfor.manifest.json 中就有 "name": "venfor_dll"
            name: '_dll_[name]'
        })
    ]
}
