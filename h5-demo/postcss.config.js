module.exports = {
    plugins: {
        'autoprefixer': { // 自动添加css兼容属性
            overrideBrowserslist: [
                'Android 4.4',
                'iOS 8',
                'ff > 31',
                'ie >= 9',
                'Chrome > 40',
            ]
        },
        // 结合在resize的时候更改body的font-size，实现750px设计稿上xpx可以被转换成375px屏幕下的x/2px
        'postcss-px2rem': {
            remUnit: 200,
        }
    }
}
