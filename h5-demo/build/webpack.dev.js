// webpack.dev.js 开发环境配置文件
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge'); // 合并配置文件
const common = require('./webpack.base.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: { // 开发服务器
        port: '3031',
        // open: false, // 可以设置是否每次启动都自动打开浏览器页面
        contentBase: '../dist',
        host: '0.0.0.0', // 可通过IP访问，也可以通过localhost访问
        useLocalIp: true, // browser open with your local IP
    },
    output: { // 输出
        filename: 'js/[name].[hash].js', // 每次保存 hash 都变化
        path: path.resolve(__dirname, '../dist')
    },
    module: {},
    plugins: [
        new webpack.NamedModulesPlugin(), // 将文件路径作为 id
    ]
});
