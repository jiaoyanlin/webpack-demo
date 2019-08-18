const path = require('path');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理dist文件夹
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.base.js');

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: 'js/[name].[contenthash:8].js', // 若文件内容无变化，则contenthash不变
        path: path.resolve(__dirname, '../dist')
    },
    module: {},
    plugins: [
        new CleanWebpackPlugin(),
        // 分析包大小
        ...(!!process.env.NODE_STATS ? [new BundleAnalyzerPlugin()] : [])
    ],
});
