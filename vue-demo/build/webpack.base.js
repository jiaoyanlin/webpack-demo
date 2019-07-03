// 存放 dev 和 prod 通用配置
const webpack = require('webpack');
const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // vue-loader 插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 生产环境抽离css
const getConfig = require('./_config');

module.exports = (env, mode) => {
    const envConfig = getConfig(env, mode);
    return {
        stats: {
            children: false, // 清理控制台不必要的打印信息
        },
        entry: {
            index: path.resolve(__dirname, '../src/index.js'),
        },
        resolve: {
            alias: { // 别名
                '@src': path.resolve(__dirname, '../src'),
                '@views': path.resolve(__dirname, '../src/views'),
                '@scss': path.resolve(__dirname, '../src/static/scss'),
                '@images': path.resolve(__dirname, '../src/static/images'),
            },
            extensions: ['.js', '.json', '.vue'], // 配置扩展名
        },
        module: {
            rules: [
                {
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    enforce: 'pre',
                    // 指定检查的目录
                    include: [path.resolve(__dirname, '../src')],
                    // eslint检查报告的格式规范
                    options: {
                        formatter: require('eslint-friendly-formatter')
                    }
                },
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
                {
                    test: /\.(scss|css)$/,
                    use: [
                        envConfig.isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        envConfig.isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'less-loader', // compiles Less to CSS
                            options: { // ant自定义主题
                                modifyVars: {
                                    'primary-color': '#63937d',
                                    'link-color': '#11b96c',
                                    'item-hover-bg': '#547c6a',
                                    'item-active-bg': '#466657',
                                },
                                javascriptEnabled: true,
                            },
                        }
                    ]
                }
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../src/index.html'),
                favicon: path.resolve(__dirname, '../favicon.png'),
            }),
            new webpack.DefinePlugin({ // 自定义全局变量
                'process.env.CUSTOM_ISDEV': JSON.stringify(envConfig.isDev),
                'process.env.CUSTOM_MODE': JSON.stringify(envConfig.mode),
                'process.env.CUSTOM_DOMAIN': JSON.stringify(envConfig.domain),
                'process.env.CUSTOM_ENV': JSON.stringify(envConfig.env),
            }),
        ],
    }
};
