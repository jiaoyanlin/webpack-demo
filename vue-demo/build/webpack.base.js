// 存放 dev 和 prod 通用配置
const webpack = require('webpack');
const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // vue-loader 插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 生产环境抽离css
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const getConfig = require('./_config');

module.exports = (env, mode) => {
    const envConfig = getConfig(env, mode);
    return {
        performance: { // 控制 webpack 如何通知「资源(asset)和入口起点超过指定文件限制」
            hints: 'warning',
            maxAssetSize: (envConfig.isDev ? 20 : 1) * 1024 * 1024, // 单文件：bytes
            maxEntrypointSize: (envConfig.isDev ? 20 : 3) * 1024 * 1024, // 入口所有文件：bytes
        },
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
            extensions: ['.js', '.vue'], // 配置扩展名
            modules: [path.resolve(__dirname, '../node_modules')], // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
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
                        envConfig.isDev ? 'style-loader' : {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../' // 让css中能成功加载到图片
                            }
                        },
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        envConfig.isDev ? 'style-loader' : {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../'
                            }
                        },
                        'css-loader',
                        {
                            loader: 'less-loader', // compiles Less to CSS
                            options: { // ant自定义主题
                                modifyVars: {
                                    'primary-color': '#63937d',
                                    'link-color': '#11b96c',
                                    'item-hover-bg': '#b5ccc2',
                                    'item-active-bg': '#dde8e3',
                                },
                                javascriptEnabled: true,
                            },
                        }
                    ]
                }
            ]
        },
        plugins: [
            // 告诉 Webpack 使用了哪些动态链接库
            new webpack.DllReferencePlugin({
                // 描述 vendor 动态链接库的文件内容
                manifest: require('../dll/vendor.manifest.json')
            }),
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../src/index.html'),
                favicon: path.resolve(__dirname, '../favicon.png'),
                /*
                因为和 webpack 4 的兼容性问题，chunksSortMode 参数需要设置为 none
                https://github.com/jantimon/html-webpack-plugin/issues/870
                */
                chunksSortMode: 'none'
            }),
            new webpack.DefinePlugin({ // 自定义全局变量
                'process.env.CUSTOM_ISDEV': JSON.stringify(envConfig.isDev),
                'process.env.CUSTOM_MODE': JSON.stringify(envConfig.mode),
                'process.env.CUSTOM_DOMAIN': JSON.stringify(envConfig.domain),
                'process.env.CUSTOM_ENV': JSON.stringify(envConfig.env),
            }),
            // 在HtmlWebpackPlugin后使用：用于将vendor插入打包后的页面，并将vendor移动到dist文件夹下面
            new AddAssetHtmlPlugin([
                {
                    // 要添加到编译中的文件的绝对路径
                    filepath: path.resolve(__dirname, '../dll/vendor.*.dll.js'), // 匹配到带hash的文件
                    // 文件输出目录：会在dist文件夹下面再生成dll文件夹
                    outputPath: 'dll',
                    // 脚本或链接标记的公共路径
                    publicPath: 'dll',
                    includeSourcemap: false,
                }
            ]),
        ],
    }
};
