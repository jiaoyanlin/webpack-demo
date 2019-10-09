> 最近学习webpack相关知识，特此记录下学习过的文档以及搭建过程；如有错误，记得告诉我呀。项目地址：[地址](https://github.com/jiaoyanlin/webpack-demo),求星星

```javascript
// 1、clone代码到本地
cd vue-demo
npm i
// 通过package.json的scripts可以看到区分了不同环境的启动命令
npm run dev:local // 例如：启动
npm run build // 打包
```

[TOC]

- [vue项目搭建](#vue项目搭建)
  * [初始化项目](#初始化项目)
  * [引入babel7](#引入babel7)
  * [引入其他工具及组件库](#引入其他工具及组件库)
      - [eslint](#eslint)
      - [vue-router](#vue-router)
      - [vuex](#vuex)
      - [antd](#antd)
  * [优化](#优化)
      - [根据不同分环境配置参数、设置全局变量、优化打包信息](#根据不同分环境配置参数、设置全局变量、优化打包信息)
      - [可视化打包工具测试：webpack-bundle-analyzer](#可视化打包工具测试：webpack-bundle-analyzer)
      - [持久化缓存](#持久化缓存)
      - [生产环境抽取css并压缩优化及js压缩](#生产环境抽取css并压缩优化及js压缩)
      - [使用DllPlugin和DllReferencePlugin提升编译速度](#使用DllPlugin和DllReferencePlugin提升编译速度)
      - [使用happypack多进程加速编译](#使用happypack多进程加速编译)
      - [其他小调整](#其他小调整)
  * [学习目录](#学习目录)

# vue项目搭建

> 传送门：相关代码都在[这里](https://github.com/jiaoyanlin/webpack-demo/tree/master/vue-demo)哦！

tips: 当前项目搭建时环境及使用的部分工具版本（版本不同可能导致使用方法不同）：node v11.6.0, npm v6.10.0, webpack: ^4.35.0, webpack-cli: ^3.3.5, 其他请看package.json

## 初始化项目

1.新建vue-demo, cd vue-demo, npm init初始化项目；

2.安装相关依赖：

webpack: `npm i webpack webpack-cli webpack-dev-server webpack-merge --save-dev`

vue: `npm i vue --save`、`npm i vue-loader vue-template-compiler --save-dev`

html解析：`npm i html-webpack-plugin --save-dev`

css、scss相关：`npm i css-loader style-loader node-sass sass-loader --save-dev`

css后处理：`npm i postcss-loader autoprefixer --save-dev`

图片路径处理：`npm i file-loader url-loader --save-dev`

以下为打包时用到的插件，放在webpack.prod.js：

清理dist文件夹：`npm i clean-webpack-plugin --save-dev`

3.创建相关文件如下：

```text
vue-demo
    |--build
        |--webpack.base.js
        |--webpack.dev.js
        |--webpack.prod.js
    |--src
        |--static
            |--images
            |--scss
                |--index.scss
        |--views
            |--app.vue
        |--index.js
        |--index.html
    |--postcss.config.js
    |--favicon.png
```
```javascript
// webpack.base.js 公用配置文件
const webpack = require('webpack');
const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // vue-loader
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html
module.exports = {
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
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
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
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'), // html模板
            favicon: path.resolve(__dirname, '../favicon.png'),
        }),
    ],
};
```
```javascript
// webpack.dev.js 开发环境配置文件
const path = require('path');
const merge = require('webpack-merge'); // 合并配置文件
const common = require('./webpack.base.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: { // 开发服务器
        port: '3000',
        // open: false, // 可以设置是否每次启动都自动打开浏览器页面
        contentBase: '../dist',
        host: '0.0.0.0', // 可通过IP访问，也可以通过localhost访问
        useLocalIp: true, // browser open with your local IP
    },
    output: { // 输出
        filename: 'js/[name].[hash].js', // 每次保存 hash 都变化
        path: path.resolve(__dirname, '../dist')
    },
    module: {},
});
```
```javascript
// webpack.prod.js 生产环境的配置文件
const path = require('path');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理dist文件夹
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
    ],
});
```
```javascript
// index.js
import Vue from 'vue'
import App from './views/app.vue'
import '@scss/index.scss'
new Vue({
    el: '#app',
    render: h => h(App),
});
```
```
<!-- app.vue -->
<template>
    <div id="app">
        hello, vue-demo
    </div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style lang="scss" scoped>
#app {
  text-align: center;
  color: #333;
  margin-top: 100px;
  display: flex;
}
</style>
```
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>webpack-vue-demo</title>
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
```
```javascript
// postcss.config.js css兼容前缀
module.exports = {
    plugins: {
        'autoprefixer': {
            overrideBrowserslist: [
                'Android 4.1',
                'iOS 7.1',
                'Chrome > 31',
                'ff > 31',
                'ie >= 8'
            ]
        }
    }
}
```

4.npm命令：
```
"scripts": {
  "start": "webpack-dev-server --hot --progress --config build/webpack.dev.js",
  "build": "webpack --progress --config build/webpack.prod.js"
},
```
现在，执行`npm start`即可体验项目啦~`npm run build`可以打包项目

## 引入babel7

> @babel/preset-env 语法装换，配置 polyfill及按需加载；@babel/plugin-transform-runtime复用辅助函数

1.安装依赖：

`npm i babel-loader @babel/core @babel/cli --save-dev`

`npm i @babel/preset-env @babel/plugin-transform-runtime --save-dev`

`npm i @babel/polyfill @babel/runtime --save`

2.配置loader：

```javascript
// webpack.base.js
// module.rules中添加
{
    test: /\.js$/,
    use: ['babel-loader'],
    exclude: /node_modules/, // 排除不要加载的文件夹
    include: path.resolve(__dirname, '../src') // 指定需要加载的文件夹
},
```

3.配置babel，在根目录下添加文件.babelrc.js

```javascript
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                "corejs": 2,
                "modules": false, // 模块使用 es modules ，不使用 commonJS 规范 
                "useBuiltIns": 'usage', // 默认 false, 可选 entry , usage；usage表示按需加载
            }
        ]
    ],
    plugins: [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": false, // 默认值，可以不写
                "helpers": true, // 默认，可以不写
                "regenerator": false, // 通过 preset-env 已经使用了全局的 regeneratorRuntime, 不再需要 transform-runtime 提供的 不污染全局的 regeneratorRuntime
                "useESModules": true, // 使用 es modules helpers, 减少 commonJS 语法代码
            }
        ],
    ]
}
```

## 引入其他工具及组件库

### eslint:

安装依赖：`npm i babel-eslint eslint eslint-friendly-formatter eslint-loader eslint-plugin-vue -D`

```javascript
// 根目录下新建文件 .eslintrc.js:
module.exports = {
    //一旦配置了root，ESlint停止在父级目录中查找配置文件
    root: true,
    //想要支持的JS语言选项
    parserOptions: {
        //启用ES6语法支持(如果支持es6的全局变量{env: {es6: true}}，则默认启用ES6语法支持)
        //此处也可以使用年份命名的版本号：2015
        ecmaVersion: 6,
        //默认为script
        sourceType: "module",
        //支持其他的语言特性
        ecmaFeatures: {},
        parser: "babel-eslint"
    },
    //代码运行的环境，每个环境都会有一套预定义的全局对象，不同环境可以组合使用
    env: {
        amd: true, // 否则会出现'require' is not defined 提示
        es6: true,
        browser: true,
        jquery: true
    },
    //访问当前源文件中未定义的变量时，no-undef会报警告。
    //如果这些全局变量是合规的，可以在globals中配置，避免这些全局变量发出警告
    globals: {
        //配置给全局变量的布尔值，是用来控制该全局变量是否允许被重写
        test_param: true,
        window: true,
    },
    //支持第三方插件的规则，插件以eslint-plugin-作为前缀，配置时该前缀可省略
    //检查vue文件需要eslint-plugin-vue插件
    plugins: ["vue"],
    //集成推荐的规则
    extends: ["eslint:recommended", "plugin:vue/essential"],
    globals: {
        process: false,
    },
    //启用额外的规则或者覆盖默认的规则
    //规则级别分别：为"off"(0)关闭、"warn"(1)警告、"error"(2)错误--error触发时，程序退出
    rules: {
        //关闭“禁用console”规则
        "no-console": "off",
        //缩进不规范警告，要求缩进为2个空格，默认值为4个空格
        "indent": ["warn", 4, {
            //设置为1时强制switch语句中case的缩进为2个空格
            "SwitchCase": 1,
        }],
        // 函数定义时括号前面要不要有空格
        "space-before-function-paren": [0, "always"],
        //定义字符串不规范错误，要求字符串使用双引号
        // quotes: ["error", "double"],
        //....
        //更多规则可查看http://eslint.cn/docs/rules/
    }
}
```

```javascript
// webpack.base.js
// module.rules中添加
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
```

运行项目，根据eslint提示修改不规范的代码

### vue-router

`npm i @babel/plugin-syntax-dynamic-import -D`

`npm i vue-router -S`

```javascript
// .babelrc.js
module.exports = {
    plugins: [
        "@babel/plugin-syntax-dynamic-import", // 支持路由懒加载：()=>import('...')
        ...
    ],
    ...
}
```
```javascript
// src/index.js改成如下
import '@scss/index.scss';
import Vue from 'vue';
import router from '@src/router/index.js';
import App from '@views/app.vue';

new Vue({
    el: '#app',
    router,
    render: h => h(App),
});
```

```javascript
// 新增文件 src/router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import Test from '../views/test';
import NoFound from '@views/noFound';

Vue.use(VueRouter);

export default new VueRouter({
    // mode: 'history',  // 使用history防止url中出现#
    routes: [
        {
            path: '/',
            name: 'test',
            component: Test
        }, {
            path: '/test1',
            name: 'test1',
            component: () =>
                import(/* webpackChunkName: "test1" */ '@views/test1.vue'),
        }, {
            path: '*',
            name: 'noFound',
            component: NoFound
        }
    ]
});
```

新增文件 src/views/app.vue

```
<template>
    <div id="app">
        <div class="header">
            <router-link to="/">首页</router-link>
            <router-link to="/test1">test1</router-link>
            <router-link to="/a">noFound</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app',
};
</script>

<style lang="scss" scoped>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    text-align: center;
    margin-top: 60px;
    transform: rotate(0deg);
}
</style>
```

新增文件 src/views/noFound.vue

```
<template>
    <div>
        noFound
    </div>
</template>

<script>
export default {
    name: 'noFound',
};
</script>
```

新增文件 src/views/test.vue

```
<template>
    <div>
        首页：test
        <div>{{msg}}</div>
    </div>
</template>

<script>
export default {
    name: 'test',
    data() {
        return {
            msg: '首页信息'
        }
    },
};
</script>
```

修改文件 src/views/test1.vue成一下内容；并且在src/static/images下面新增1.jpg,2.jpg,smart.gif

```
<template>
    <div>
        <div>
            test1, count : 
            <span class="red">{{loading ? 'loading...' : count}}</span>
        </div>
        <div>
            <div class="btn" @click="addCount">add count</div>
        </div>
        <div class="wrap">
            <div>
                <div>gif</div>
                <img src="@images/smart.gif" alt="">
            </div>
            <div>
                <div>1</div>
                <img src="@images/1.jpg" alt="">
            </div>
            <div>
                <div>2</div>
                <img src="@images/2.jpg" alt="">
            </div>
            <div>
                <div>3</div>
                <div class="img-bg-1"></div>
            </div>
            <div>
                <div>4</div>
                <div class="img-bg-2"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'test',
    data() {
        return {
            loading: false,
            count: 1,
        }
    },
    methods: {
        addCount() {
            if (this.loading) return ;
            return new Promise((resolve) => {
                this.loading = true;
                setTimeout(() => {
                    const {count} = this;
                    this.count = count + 1;
                    this.loading = false;
                    resolve();
                }, 2000);
            });
        },
    },
};
</script>

<style lang="scss" scoped>
$red: #a00;
.red {
    color: $red;
}
img {
    width: 100px;
}
@mixin img-bg {
    width: 100%;
    height: 120px;
    background-size: 100px;
}
.img-bg-1 {
    background: url(~@images/1.jpg) no-repeat center top;
    @include img-bg();
}
.img-bg-2 {
    background: url(~@images/2.jpg) no-repeat center top;
    @include img-bg();
}
.wrap {
    display: flex;
    &>div {
        flex: 1;
    }
}
</style>
```

修改src/static/scss/index.scss

```
.btn {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
}
```

### vuex

`npm i vuex vuex-router-sync -S`

```javascript
// 修改src/index.js
...
import { sync } from 'vuex-router-sync';
import store from '@src/store/index';

// 链接vuex和vue-router
sync(store, router);

new Vue({
    ...
    store, // 新增这一行
    ...
});

```

新增如下文件：

```text
|--src
    |--store
        |--actions.js
        |--getters.js
        |--index.js
        |--mutations.js
        |--state.js
```

```javascript
// actions.js
export const changeMsg = ({ commit }) => {
    commit({
        type: 'mutationsMsg', // 对应mutation.js中的mutationsMsg方法
        globalMsg: '我是修改后的全局数据~~~'
    });
};
```

```javascript
// getters.js
export const gettersMsg = state => state.globalMsg;
```

```javascript
// index.js
import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import state from './state';
Vue.use(Vuex);
const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});
export default store;
```

```javascript
// mutations.js
export const mutationsMsg = (state, payload) => {
    state.globalMsg = payload.globalMsg;
}
```

```javascript
// state.js
const state = {
    globalMsg: '我是全局数据',
}
export default state;
```

具体使用

```javascript
// test.uve
<template>
    <div>
        首页：test
        <div>{{gettersMsg}}</div>
        <div class="btn" @click="changeMsg">点击改变数据</div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'test',
    data() {
        return {};
    },
    computed: { ...mapGetters(['gettersMsg']) },
    methods: { ...mapActions(['changeMsg']) }
};
</script>
```

### antd

`npm i babel-plugin-import less less-loader -D`

`npm i ant-design-vue -S`

```javascript
// .babelrc.js plugins数组中增加
plugins: [
    ...,
    ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": true }], // ant组件按需加载
]
```

```javascript
// webpack.base.js rules中加入
{
    test: /\.less$/,
    use: [
        'style-loader',
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
```

```javascript
// src/index.js 新增一句
import '@src/plugins';
```

```javascript
// 新增文件 src/plugins/index.js
import './ant';
```

```javascript
// 新增文件 src/plugins/ant/index.js
import Vue from 'vue';
import {
    Button,
    Icon,
    Layout,
    Breadcrumb,
    Dropdown,
    Divider,
    Menu,
    Pagination,
    Steps,
    Checkbox,
    DatePicker,
    Input,
    InputNumber,
    Radio,
    Select,
    Switch,
    TimePicker,
    Popover,
    Tabs,
    Tag,
    Tooltip,
    Alert,
    message,
    Modal,
    Popconfirm,
    Spin,
    ConfigProvider,
    LocaleProvider
} from 'ant-design-vue';

Vue.use(Button);
Vue.use(Icon);
Vue.use(Layout);
Vue.use(Breadcrumb);
Vue.use(Dropdown);
Vue.use(Divider);
Vue.use(Menu);
Vue.use(Pagination);
Vue.use(Steps);
Vue.use(Checkbox);
Vue.use(DatePicker);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Switch);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tabs);
Vue.use(Tag);
Vue.use(Tooltip);
Vue.use(Alert);
Vue.use(Modal);
Vue.use(Popconfirm);
Vue.use(Spin);
Vue.use(ConfigProvider);
Vue.use(LocaleProvider);
message.config({
    duration: 2,
    maxCount: 3,
});
Vue.prototype.$message = message;
Vue.prototype.$Modal = Modal;
```

使用

```javascript
// 修改views/test.vue
<a-button type="primary">点击</a-button>
```

## 优化

### 根据不同分环境配置参数、设置全局变量、优化打包信息

> 开发和生产环境都区分三种接口配置：本地、测试、正式

```javascript
// package.json scripts改成：
"dev:local": "webpack-dev-server --env.CUSTOM_ENV=local --hot --progress --config build/webpack.dev.js",
"dev:pre": "webpack-dev-server --env.CUSTOM_ENV=pre --hot --progress --config build/webpack.dev.js",
"dev": "webpack-dev-server --env.CUSTOM_ENV=pro --hot --progress --config build/webpack.dev.js",
"build:local": "webpack --progress --env.CUSTOM_ENV=local --config build/webpack.prod.js",
"build:pre": "webpack --progress --env.CUSTOM_ENV=pre --config build/webpack.prod.js",
"build": "webpack --progress --env.CUSTOM_ENV=pro --config build/webpack.prod.js"
```

```javascript
// .eslintrc.js 新增配置
modules.exports = {
    ...
    globals: {
        ...
        process: false,
    },
    ...
}
```

新增文件 build/_config.js

```javascript
let config = {
    isDev: false, // 是否为开发环境
    mode: 'production', // webpack mode：production、development
    domain: '', // API
    env: 'pro', // 对应接口：local、pre、pro
};

module.exports = (env, mode) => {
    config.isDev = mode === 'development';
    config.mode = mode;
    config.env = env.CUSTOM_ENV;
    let domain = '';
    switch(env.CUSTOM_ENV) {
        case 'local': // 本地开发环境接口
            domain = 'local-api.domain.com';
            break;
        case 'pre': // 测试环境接口
            domain = 'pre-api.domain.com';
            break;
        default: // 正式环境接口
            domain = 'api.domain.com';
    }
    config.domain = domain;
    return config;
};
```

```javascript
// 修改webpack.base.js
const getConfig = require('./_config');

module.exports = (env, mode) => {
    const envConfig = getConfig(env, mode);
    return {
        stats: {
            children: false, // 清理控制台不必要的打印信息
        },
        // 沿用之前的配置
        entry: { 
            ...
        },
        ...
        plugins: [
            ...,
            new webpack.DefinePlugin({ // 自定义全局变量
                'process.env.CUSTOM_ISDEV': JSON.stringify(envConfig.isDev),
                'process.env.CUSTOM_MODE': JSON.stringify(envConfig.mode),
                'process.env.CUSTOM_DOMAIN': JSON.stringify(envConfig.domain),
                'process.env.CUSTOM_ENV': JSON.stringify(envConfig.env),
            }),
        ]
    }
}
```

```javascript
// 修改webpack.dev.js
module.exports = env => {
    const mode = 'development';
    const commonConfig = common(env, mode);
    return merge(commonConfig, {
        mode,
        devtool: 'inline-source-map',
        ...
    }
}
```

```javascript
// 修改webpack.prod.js
module.exports = env => {
    const mode = 'production';
    const commonConfig = common(env, mode);
    return merge(commonConfig, {
        mode,
        ...
    }
}
```

```javascript
// src/index.js 新增
if (process.env.CUSTOM_MODE !== 'production') {
    console.log('CUSTOM_ISDEV:', process.env.CUSTOM_ISDEV);
    console.log('CUSTOM_MODE:', process.env.CUSTOM_MODE);
    console.log('CUSTOM_DOMAIN:', process.env.CUSTOM_DOMAIN);
    console.log('CUSTOM_ENV:', process.env.CUSTOM_ENV);
}
```

> 优化打包信息：通过webpack.base.js中config.stats、命令行中的--progress 优化

### 可视化打包工具测试：webpack-bundle-analyzer

`npm i webpack-bundle-analyzer -D`

package.json的scripts中增加：

`"build:stats": "webpack --progress --env.CUSTOM_ENV=pro --env.STATS --config build/webpack.prod.js --profile --json > stats.json"`

修改webpack.prod.js：

```javascript
...
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

...
plugins: [
    ...,
    // 分析包大小
    ...(env.STATS ? [new BundleAnalyzerPlugin()] : [])
]
...
```

使用：运行`npm run build:stats`自动生成stats.json文件，浏览器会打开对应网页可以看到相关分析结果

### 持久化缓存

`npm i script-ext-html-webpack-plugin -D`

```javascript
// 修改webpack.dev.js
const webpack = require('webpack');

plugins: [
    ...,
    new webpack.NamedModulesPlugin(), // 将文件路径作为 id
]
```

```javascript
// 修改webpack.prod.js
...
const webpack = require('webpack');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const seen = new Set();
const nameLength = 4;

module.exports = env => {
    ...
    return merge(commonConfig, {
        ...
        optimization: {
            splitChunks: {
                chunks: 'all',
                // maxInitialRequests: 3, // 允许入口并行加载的最大请求数（打包生成的index.hash.js本身也算一个）；默认值为3；
                cacheGroups: {
                    libs: { // 基础类库:它是构成我们项目必不可少的一些基础类库，比如 vue+vue-router+vuex+axios 这种标准的全家桶，它们的升级频率都不高，但每个页面都需要它们
                        name: 'chunk-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial' // 只打包初始时依赖的第三方
                    },
                    antUI: { // UI 组件库
                        name: 'chunk-ant', // 单独将 ant 拆包
                        priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                        test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/
                    },
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
        },
        ...,
        plugins: [
            ...,
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
            })
        ]
    });
}

```

### 生产环境抽取css并压缩优化及js压缩

`npm i mini-css-extract-plugin optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin -D`

删除webpack.base.js rules中关于scss和css相关的处理

```javascript
// 修改webpack.base.js
...
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 生产环境抽离css
module.exports = (env, mode) => {
    const envConfig = getConfig(env, mode);
    const isDev = envConfig.isDev;
    return {
        ...,
        module: {
            ...,
            rules: [
                ...,
                {
                    test: /\.(scss|css)$/,
                    include: [
                        path.resolve(__dirname, '../src')
                    ],
                    use: [
                        isDev ? 'style-loader' : {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../' // 让css能成功加载到图片
                            }
                        },
                        'css-loader', 'postcss-loader', 'sass-loader'
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        isDev ? 'style-loader' : {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../'
                            }
                        },
                        'css-loader',
                        'postcss-loader',
                        {
                            loader: 'less-loader',
                            options: { // ant自定义主题
                                modifyVars: {
                                    'primary-color': '#000000',
                                    'link-color': '#17c9e6',
                                    'item-hover-bg': '#F7F7F7',
                                    'item-active-bg': '#f3f3f3',
                                },
                                javascriptEnabled: true,
                            },
                        }
                    ],
                }
            ]
        },
        ...
    }
}
```

```javascript
// 修改webpack.prod.js
...
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // css压缩与优化
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

...
optimization: {
    ...
    minimizer: [
        new UglifyJsPlugin({ // 压缩js
            cache: true,
            parallel: true,
            // sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin(), // 压缩css，导致webpack4自带的js压缩无效，需添加UglifyJsPlugin
    ],
},
...
plugins: [
    ...
    // 增加css抽取
    new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        // chunkFilename: 'css/[id].[contenthash:8].css'
    }),
]
```

### 使用DllPlugin和DllReferencePlugin提升编译速度

`npm i add-asset-html-webpack-plugin -D`

package.json scripts中增加：

```javascript
"dll": "npm run _dll:pro && npm run _dll:dev",
"_dll:pro": "webpack --mode production --progress --config build/webpack.dll.js",
"_dll:dev": "webpack --mode development --progress --config build/webpack.dll.js",
```

```javascript
// 新增文件 build/webpack.dll.js
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
    const isDev = argv.mode === 'development';
    const dir = isDev ? '../dll/dev' : '../dll/pro';
    return {
        // mode: 'production', // ???????
        entry: {
            // 将数组中的模块作为入口编译成动态链接库
            'vendor': ['vue', 'vue-router', 'vuex', 'vuex-router-sync', '@ant-design/icons/lib/dist']
        },
        output: {
            // 指定生成文件所在目录
            // 由于每次打包生产环境时会清空 dist 文件夹，因此这里我将它们存放在了dll文件夹下
            path: path.resolve(__dirname, dir),
            // 指定文件名并添加hash
            filename: '[name].[contenthash:6].dll.js',
            // 存放动态链接库的全局变量名称，加上 _dll_ 是为了防止全局变量冲突：例如对应 vendor 来说就是 _dll_vendor
            // 这个名称需要与 DllPlugin 插件中的 name 属性值对应起来
            library: '_dll_[name]'
        },
        plugins: [
            new CleanWebpackPlugin(),
            // 接入 DllPlugin
            new webpack.DllPlugin({
                // 描述动态链接库的 manifest.json 文件输出时的文件名称
                path: path.join(__dirname, dir, '[name].manifest.json'),
                // 动态链接库的全局变量名称，需要和 output.library 中保持一致
                // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
                // 例如 venfor.manifest.json 中就有 "name": "venfor_dll"
                name: '_dll_[name]'
            })
        ]
    }
}
```

```javascript
// 修改webpack.base.js
...
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

...
plugins: [
    // 告诉 Webpack 使用了哪些动态链接库
    new webpack.DllReferencePlugin({
        // 描述 vendor 动态链接库的文件内容
        manifest: require(isDev ? '../dll/dev/vendor.manifest.json' : '../dll/pro/vendor.manifest.json')
    }),
    ...,
    // 在HtmlWebpackPlugin后使用：用于将vendor插入打包后的页面，并将vendor移动到dist文件夹下面
    new AddAssetHtmlPlugin([
        {
            // 要添加到编译中的文件的绝对路径
            filepath: path.resolve(__dirname, isDev ? '../dll/dev/vendor.*.dll.js' : '../dll/pro/vendor.*.dll.js'), // 匹配到带hash的文件
            // 文件输出目录：会在dist文件夹下面再生成dll文件夹
            outputPath: 'dll',
            // 脚本或链接标记的公共路径
            publicPath: 'dll',
            includeSourcemap: false,
        }
    ]),
]
```

> 首次使用需要执行`npm run dll`构建出测试/正式环境下的dll文件，html中会自动引入相应的dll文件；以后只要没有修改dll配置，就不需要重新构建dll文件，只有修改了webpack.dll.js，才需要重新执行`npm run dll`。也就是按照上面的描述配置好后，先执行npm run dll，得到dll文件夹下面的文件，之后就可以和之前一样按照npm run dev开发、npm run build打包了

> 这里之所以需要区分环境构建不同dll是因为在mode为production时，devtools无法查看vuex数据，尚未找到其他解决方案

### 使用happypack多进程加速编译

`npm i happypack -D`

```javascript
// 修改webpack.base.js
...
const HappyPack = require('happypack');
// 构造出共享进程池，进程池中包含5个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

rules: [
    ...
    // 修改babel-loader
    {
        test: /\.js$/,
        use: 'happypack/loader?id=babel',
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src')
    },
    {
        test: /\.less$/,
        use: [
            isDev ? 'style-loader' : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: '../'
                }
            },
            'happypack/loader?id=less'
        ],
    }
],
...
plugins: [
    new HappyPack({
        // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
        id: 'babel',
        // 如何处理 .js 文件，用法和 Loader 配置中一样
        loaders: ['babel-loader'],
        // 使用共享进程池中的子进程去处理任务
        threadPool: happyThreadPool,
    }),
    new HappyPack({
        id: 'less',
        loaders: ['css-loader', 'postcss-loader', {
                loader: 'less-loader',
                options: { // ant自定义主题
                    modifyVars: {
                        'primary-color': '#000000',
                        'link-color': '#17c9e6',
                        'item-hover-bg': '#F7F7F7',
                        'item-active-bg': '#f3f3f3',
                    },
                    javascriptEnabled: true,
                },
            }
        ],
        threadPool: happyThreadPool,
    }),
    ...
]
```

> tips：这里没有对scss的处理使用happypack，因为使用后发现vue文件中style带scoped会失效，尚未找到原因及解决方案

> 这里使用了happypack之后构建速度反而变慢了，原因？？？


### 其他小调整

```javascript
// 修改webpack.base.js
...
performance: { // 控制 webpack 如何通知「资源(asset)和入口起点超过指定文件限制」
    hints: 'warning',
    maxAssetSize: (isDev ? 20 : 1) * 1024 * 1024, // 单文件：bytes
    maxEntrypointSize: (isDev ? 20 : 3) * 1024 * 1024, // 入口所有文件：bytes
},
...,
resolve: {
    ...,
    modules: [path.resolve(__dirname, '../node_modules')], // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
},

```

> src/index.js中要把`import '@src/plugins';`放到`import '@scss/index.scss';`前面，才不会让ant的样式覆盖了自定义的样式
















```javascript
```
```javascript
```
```javascript
```
```javascript
```
```javascript
```






















### 学习目录

<font size=3 color=#63937d>webpack相关:</font>
* [npm详解](https://juejin.im/post/5ab3f77df265da2392364341)
* [简单易懂的 webpack 打包后 JS 的运行过程-1](https://juejin.im/post/5a23b130f265da432003101a)
* [简单易懂的 webpack 打包后 JS 的运行过程-2](https://juejin.im/post/5a34bcf9f265da43070355f8)
* [import、require、export、module.exports 混合使用详解](https://juejin.im/post/5a2e5f0851882575d42f5609)
* [webpack 打包机制](https://github.com/happylindz/blog/issues/6)
* [webpack 应用编译优化之路](https://juejin.im/post/59dc57f2f265da431d3ba2ef)
* [深入浅出webpack](http://webpack.wuhaolin.cn)
* [入门Webpack，看这篇就够了](https://www.jianshu.com/p/42e11515c10f)
* [webpack 优化](https://github.com/happylindz/blog/issues/8)
* [Webpack4 搭建 Vue 项目](https://juejin.im/post/5b7d350951882542f3278b11)
* [webpack4.X 实战（二）](https://juejin.im/post/5c74a61bf265da2da00ebae1)
* [webpack4.X 实战（三）](https://juejin.im/post/5c984983f265da610f7c0ed4)
* [搭建项目教程](https://juejin.im/post/59097cd7a22b9d0065fb61d2)
* [使用 Webpack 的 DllPlugin 提升项目构建速度](https://www.jishuwen.com/d/2As1#tuit)
* [使用webpack4提升180%编译速度](http://louiszhai.github.io/2019/01/04/webpack4/)
* [移动spa商城优化记（二）--- 减少70%的打包等待时间](https://juejin.im/post/5abf13bf6fb9a028cc61577d)
* [postcss-loader   autoprefixer](https://blog.csdn.net/qq_37942845/article/details/95047372)
* [使用 HashedModuleIdsPlugin 解决 hash 频繁变动的问题](https://github.com/sorrycc/roadhog/issues/510)
* [手摸手，带你用合理的姿势使用webpack4（下）](https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc#heading-4)
* [css压缩](https://juejin.im/post/5b977a19f265da0ac4469057)
* [vuex-router-sync](https://blog.csdn.net/jerryman_ghj/article/details/82754209)
* [ESLint(vue+webpack)配置](https://segmentfault.com/a/1190000016925949)
* [清理控制台](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/39)
* [Webpack传参](https://github.com/wayou/wayou.github.io/issues/14)
* []()
* []()
* []()
* []()

<font size=3 color=#63937d>遇到的问题:</font>
* [babel的polyfill和runtime的区别](https://segmentfault.com/q/1010000005596587?from=singlemessage&isappinstalled=1)
* [Babel学习系列4-polyfill和runtime差别](https://zhuanlan.zhihu.com/p/58624930)
* [transform-runtime polyfill env](https://www.jianshu.com/p/d078b5f3036a)
* [关于@babel/polyfill -- 按需加载](https://segmentfault.com/a/1190000018632153)
* [babel7最佳实践](https://github.com/Weiyu-Chen/blog/issues/5)
* [Babel 7 升级实践](https://blog.hhking.cn/2019/04/02/babel-v7-update/)
* [webpack持久化缓存-1](https://github.com/pigcan/blog/issues/9)
* [webpack持久化缓存-2](https://juejin.im/post/5b977a19f265da0ac4469057)



以下为本项目构建过程中遇到的疑问查找到的相关参考：

1、什么时候用babel-polyfill，什么时候用babel-runtime？

（1）transform-runtime不会污染全局，但是不能使用实例方法，如Array.find

（2）babel-polyfill会污染全局空间，并可能导致不同版本间的冲突，而babel-runtime不会。从这点看应该用babel-runtime。
但记住，babel-runtime有个缺点，它不模拟实例方法，即内置对象原型上的方法，所以类似Array.prototype.find，你通过babel-runtime是无法使用的。最后，请不要一次引入全部的polyfills（如require('babel-polyfill')），这会导致代码量很大。请按需引用最好。

（3）按需引入polyfill存在风险，可能无法为某些第三方组件提供其依赖的polyfill:https://juejin.im/post/5cb9833b6fb9a068a84fe4d0,



遗留问题：

1、依赖包中tree-shaking后的依赖文件能够被编译吗，文件中使用的es6新特性能够被polyfill检测到？

