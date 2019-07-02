module.exports = {
    plugins: [
        "@babel/plugin-syntax-dynamic-import",
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": false, // 默认值，可以不写
                "helpers": true, // 默认，可以不写
                "regenerator": false, // 通过 preset-env 已经使用了全局的 regeneratorRuntime, 不再需要 transform-runtime 提供的 不污染全局的 regeneratorRuntime
                "useESModules": true, // 使用 es modules helpers, 减少 commonJS 语法代码
            }
        ],
    ],
    presets: [
        [
            "@babel/preset-env",
            {
                "corejs": 2,
                "modules": false, // 模块使用 es modules ，不使用 commonJS 规范 
                "useBuiltIns": 'usage', // 默认 false, 可选 entry , usage
            }
        ]
    ]
}
