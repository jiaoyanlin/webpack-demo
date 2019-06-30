// 存放 dev 和 prod 通用配置
const webpack = require('webpack');
const path = require("path");
// vue-loader 插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// html插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js', //入口
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 5000,
                            // 分离图片至imgs文件夹
                            name: "imgs/[name].[ext]",
                        }
                    },
                ]
            },
        ]
    },
    plugins: [
        // 解决vender后面的hash每次都改变
        new webpack.HashedModuleIdsPlugin(),
        // 请确保引入这个插件来施展魔法
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
        }),
    ],// 插件
};
