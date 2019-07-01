// 存放 dev 和 prod 通用配置
const webpack = require('webpack');
const path = require("path");
// vue-loader 插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// html插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    resolve: {
        alias: { // 别名
            '@src': path.resolve(__dirname, '../src'),
            '@scss': path.resolve(__dirname, '../src/static/scss'),
            '@images': path.resolve(__dirname, '../src/static/images'),
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/, // 排除不要加载的文件夹
                include: path.resolve(__dirname, '../src') // 指定需要加载的文件夹
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
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                // 使用url-loader, 它接受一个limit参数，单位byte；
                // 当文件小于limit：将文件转为Data URI格式内联到引用的地方
                // 当文件大于limit：将调用 file-loader, 把文件复制到输出目录，并将引用的文件路径改写成输出后的路径
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 20 * 1024,
                            // 分离图片至imgs文件夹
                            name: "imgs/[name].[ext]",
                        }
                    },
                ]
            },
        ]
    },
    plugins: [
        // 使用文件路径的 hash 作为 moduleId，解决vender后面的hash每次都改变
        new webpack.HashedModuleIdsPlugin(),
        // 请确保引入这个插件来施展魔法
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            favicon: path.resolve(__dirname, '../favicon.png'),
        }),
    ],// 插件
};
