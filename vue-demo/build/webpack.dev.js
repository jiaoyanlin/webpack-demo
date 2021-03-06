const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const path = require('path');

module.exports = env => {
    const mode = 'development';
    const commonConfig = common(env, mode);
    return merge(commonConfig, {
        mode,
        devtool: 'inline-source-map',
        devServer: { // 开发服务器
            port: '3000',
            // open: false,
            contentBase: '../dist',
            host: '0.0.0.0', // 可 通过IP 访问，也可以通过 localhost 访问
            useLocalIp: true, // browser open with your local IP
        },
        output: { // 输出
            filename: 'js/[name].[hash].js', // 每次保存 hash 都变化
            path: path.resolve(__dirname, '../dist')
        },
        module: {
            rules: []
        },
        plugins: [
            new webpack.NamedModulesPlugin(), // 将文件路径作为 id
        ]
    });
}
