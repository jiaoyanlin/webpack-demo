// 自动添加css兼容属性
module.exports = {
    plugins: {
        'autoprefixer': {
            overrideBrowserslist: [
                'Android 4.4',
                'iOS 8',
                'ff > 31',
                'ie >= 9',
                'Chrome > 40',
            ]
        }
    }
}
