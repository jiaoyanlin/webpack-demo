const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge'); // 合并配置文件
const common = require('./webpack.base.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // css压缩与优化
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const seen = new Set();
const nameLength = 4;

module.exports = env => {
    const mode = 'production';
    const commonConfig = common(env, mode);
    return merge(commonConfig, {
        mode,
        output: {
            filename: 'js/[name].[contenthash].js', //contenthash 若文件内容无变化，则contenthash 名称不变
            path: path.resolve(__dirname, '../dist')
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    libs: {
                        name: 'chunk-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial' // 只打包初始时依赖的第三方
                    },
                    antUI: {
                        name: 'chunk-ant', // 单独将 ant 拆包
                        priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                        test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/
                    },
                    commons: {
                        name: 'chunk-commons',
                        test: path.resolve(__dirname, '../src/components/global_components'), // 可自定义拓展你的规则，比如注册全局组件的目录
                        minChunks: 2, // 最小共用次数
                        priority: 5,
                        reuseExistingChunk: true
                    }
                }
            },
            // runtimeChunk：提取 manifest，使用script-ext-html-webpack-plugin等插件内联到index.html减少请求
            runtimeChunk: true,
            /*
            * moduleIds: 固定moduleId；使用文件路径的hash作为 moduleId，解决moduleId递增变化导致的无法长期缓存问题
            * 相当于在plugins中使用new webpack.HashedModuleIdsPlugin()
            */
            moduleIds: 'hashed',
            minimizer: [
                new UglifyJsPlugin({ // 压缩js
                    cache: true,
                    parallel: true,
                    sourceMap: true
                }),
                new OptimizeCSSAssetsPlugin(), // 压缩css，导致webpack4自带的js压缩无效，需添加UglifyJsPlugin
            ],
        },
        module: {
            rules: []
        },
        plugins: [
            new CleanWebpackPlugin(),
            // 注意一定要在HtmlWebpackPlugin之后引用, inline 的name 和runtimeChunk 的 name保持一致;将runtime~index.xxx.js内联到html中
            new ScriptExtHtmlWebpackPlugin({
                inline: /runtime.*\.js$/
            }),
            // NamedChunkPlugin：结合自定义nameResolver固定chunkId
            new webpack.NamedChunksPlugin(chunk => {
                if (chunk.name) {
                    return chunk.name;
                }
                const modules = Array.from(chunk.modulesIterable);
                if (modules.length > 1) {
                    const hash = require('hash-sum');
                    const joinedHash = hash(modules.map(m => m.id).join('_'));
                    let len = nameLength;
                    while (seen.has(joinedHash.substr(0, len))) len++;
                    seen.add(joinedHash.substr(0, len));
                    return `chunk-${joinedHash.substr(0, len)}`;
                } else {
                    return modules[0].id;
                }
            }),
            // 增加css抽取
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash].css',
                chunkFilename: 'css/[id].[contenthash].css'
            }),
        ]
    });
};
