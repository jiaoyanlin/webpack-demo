const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css

module.exports = merge(common, {
    mode: 'development',
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
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
            },
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(), // 将文件路径作为 id
        // 增加css抽取
        // new MiniCssExtractPlugin({
        //     filename: 'css/[name].css',
        //     chunkFilename: '[name].css'
        // }),
    ]
});
