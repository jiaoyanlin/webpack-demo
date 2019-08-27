// webpack.base.js 公用配置文件
const webpack = require('webpack');
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 生产环境抽离css
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
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
        // 'vconsole.min': resolve('../src/static/js/vconsole.min.js'),
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
                test: /\.html$/,
                loader: 'html-loader?interpolate', // html插值
            },
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: [resolve('../node_modules'), resolve('../src/static/js')], // 排除不要加载的文件夹
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
                // exclude: /node_modules/, // 排除不要加载的文件夹
                exclude: [resolve('../node_modules'), resolve('../src/static/js')], // 排除不要加载的文件夹
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
        // 给测试环境添加vconsole
        ...(getConfig.env === 'pro' ? [] : [
            // 在HtmlWebpackPlugin后使用：用于将文件插入打包后的页面，并将文件移动到dist文件夹下面
            new AddAssetHtmlPlugin([
                {
                    // 要添加到编译中的文件的绝对路径
                    filepath: resolve('../src/static/js/vconsole.min.js'),
                    // 文件输出目录：会在dist文件夹下面再生成dll文件夹
                    outputPath: 'js',
                    // 脚本或链接标记的公共路径
                    publicPath: 'js',
                    includeSourcemap: false,
                }
            ]),
        ]),
        new webpack.DefinePlugin({ // 自定义全局变量
            'process.env.CUSTOM_ISDEV': JSON.stringify(getConfig.isDev),
            'process.env.CUSTOM_MODE': JSON.stringify(getConfig.mode),
            'process.env.CUSTOM_DOMAIN': JSON.stringify(getConfig.domain),
            'process.env.CUSTOM_ENV': JSON.stringify(getConfig.env),
        }),
    ],
};
