// webpack.base.js 公用配置文件
const webpack = require('webpack');
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html
console.log('---process.env.NODE_ENV', process.env.NODE_ENV, process.env.API_MODE)
module.exports = {
    entry: {
        index: path.resolve(__dirname, '../src/index.js'),
    },
    resolve: {
        alias: { // 别名
            '@src': path.resolve(__dirname, '../src'),
            '@static': path.resolve(__dirname, '../src/static'),
        },
        extensions: ['.js'], // 配置扩展名
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
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
    plugins: [ // 插件
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/template.html'), // html模板
            favicon: path.resolve(__dirname, '../favicon.png'),
        }),
    ],
};
