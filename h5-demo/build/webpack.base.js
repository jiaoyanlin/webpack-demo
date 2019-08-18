// webpack.base.js 公用配置文件
const webpack = require('webpack');
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 生产环境抽离css
const getConfig = require('./_config')();

function resolve(dir) {
    return path.resolve(__dirname, dir);
}

console.log('---process.env.NODE_ENV', process.env.NODE_ENV, process.env.API_MODE)
module.exports = {
    stats: {
        children: false, // 清理控制台不必要的打印信息
    },
    entry: {
        index: resolve('../src/index.js'),
    },
    resolve: {
        alias: { // 别名
            '@src': resolve('../src'),
            '@static': resolve('../src/static'),
        },
        extensions: ['.js'], // 配置扩展名
        modules: [resolve('../node_modules')], // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                // 指定检查的目录
                include: [resolve('../src')],
                // eslint检查报告的格式规范
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/, // 排除不要加载的文件夹
                include: [resolve('../src')] // 指定需要加载的文件夹
            },
            {
                test: /\.(scss|css)$/,
                include: [
                    resolve('../src')
                ],
                use: [
                    getConfig.isDev ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../' // 让css能成功加载到图片
                        }
                    },
                    'css-loader', 'postcss-loader', 'sass-loader'
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
    plugins: [ // 插件
        new HtmlWebpackPlugin({
            template: resolve('../src/template.html'), // html模板
            favicon: resolve('../favicon.png'),
        }),
        new webpack.DefinePlugin({ // 自定义全局变量
            'process.env.CUSTOM_ISDEV': JSON.stringify(getConfig.isDev),
            'process.env.CUSTOM_MODE': JSON.stringify(getConfig.mode),
            'process.env.CUSTOM_DOMAIN': JSON.stringify(getConfig.domain),
            'process.env.CUSTOM_ENV': JSON.stringify(getConfig.env),
        }),
    ],
};
