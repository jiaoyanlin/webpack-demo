const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理dist文件夹
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // css压缩与优化
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const seen = new Set();
const nameLength = 4;

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: 'js/[name].[contenthash:8].js', // 若文件内容无变化，则contenthash不变
        path: path.resolve(__dirname, '../dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                libs: { // 基础类库:它是构成我们项目必不可少的一些基础类库，比如 vue+vue-router+vuex+axios 这种标准的全家桶，它们的升级频率都不高，但每个页面都需要它们
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // 只打包初始时依赖的第三方
                },
                // antUI: { // UI 组件库
                //     name: 'chunk-ant', // 单独将 ant 拆包
                //     priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                //     test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/
                // },
                // commons: { // 自定义组件/函数
                //     name: 'chunk-commons',
                //     test: path.resolve(__dirname, '../src/components/components-global'), // 可自定义拓展你的规则，比如注册全局组件的目录
                //     minChunks: 2, // 最小共用次数
                //     priority: 5,
                //     reuseExistingChunk: true
                // },
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
                // sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin(), // 压缩css，导致webpack4自带的js压缩无效，需添加UglifyJsPlugin
        ],
    },
    module: {},
    plugins: [
        new CleanWebpackPlugin(),
        // 注意一定要在HtmlWebpackPlugin之后引用, inline的name和runtimeChunk的name保持一致;将runtime~index.xxx.js内联到html中
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
            filename: 'css/[name].[contenthash:8].css',
            // chunkFilename: 'css/[id].[contenthash:8].css'
        }),
        // 分析包大小
        ...(!!process.env.NODE_STATS ? [new BundleAnalyzerPlugin()] : [])
    ],
});
