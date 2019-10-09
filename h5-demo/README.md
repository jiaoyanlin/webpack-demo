> 搭建一个用于开发移动端简单H5的框架，很多内容的配置和之前写的[webpack项目配置](https://github.com/jiaoyanlin/webpack-demo)基本一致，这里主要加入一些移动端开发常用的配置以及删除非必要的配置


1、项目初始化

基础配置及文件内容请参照：https://github.com/jiaoyanlin/webpack-demo/commit/44e9125784d88e1cb3672543d157205e7256b1a0

2、给测试环境添加控制台插件vconsole，可参考[链接1](https://github.com/jiaoyanlin/webpack-demo/commit/7bded0876594f4dc8082aefb0e27f921566f8cca)、[链接2](https://github.com/jiaoyanlin/webpack-demo/commit/fdcef9e7a0abdfa7ad3429b57362035686198fea)

> 有两种方法：1、直接把vconsole.min.js添加在入口文件中；2、使用add-asset-html-webpack-plugin拷贝文件并添加到html中。由于添加到入口文件中vconsole.min.js会被webpack重新打包和编译，因此这里选择第二种方法

（1）改造从网上下载的vconsole.min.js，禁用给文件的eslint校验，并直接在此文件最后调用该插件；将其放到/src/static/js下

```
/*eslint-disable */
... // 此处为vconsole代码
var vconsole = new window.VConsole();
/*eslint-enable */
```

（2）引入vconsole.min.js

```
npm i add-asset-html-webpack-plugin -D
```

```
// webpack.base.js
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
...
{
    test: /\.js$/,
    use: ['babel-loader'],
    exclude: [resolve('../node_modules'), resolve('../src/static/js')], // 排除不要加载的文件夹
    include: [resolve('../src')] // 指定需要加载的文件夹
 },
...
plugins: [
    ...
    // 给测试环境添加vconsole
    ...(getConfig.env === 'pro' ? [] : [
        // 在HtmlWebpackPlugin后使用：用于将文件插入打包后的页面，并将文件移动到dist文件夹下面
        new AddAssetHtmlPlugin([
            {
                // 要添加到编译中的文件的绝对路径
                filepath: resolve('../src/static/js/vconsole.min.js'),
                // 文件输出目录：会在dist文件夹下面再生成js文件夹
                outputPath: 'js',
                // 脚本或链接标记的公共路径
                publicPath: 'js',
                includeSourcemap: false,
            }
        ]),
    ]),
]
```

3、引入html-loader：html插值

```
npm i html-loader -D
```

```
// webpack.base.js
...
module: {
    rules: [
        {
            test: /\.html$/,
            loader: 'html-loader?interpolate', // html插值
        },
        ...
    ]
}
```

```
// src/template.html，需补充foot.html和head.html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>h5-demo</title>
        ${require("./views/common/head.html")}
    </head>
    <body>
        <div id="app"></div>
        ${require("./views/common/foot.html")}
    </body>
</html>
```

4、使用rem：postcss-px2rem配合resize时改变html基本字号

```
npm i postcss-px2rem -D
```

```
// postcss.config.js
...
'autoprefixer': {
    ...
    // 结合在resize的时候更改html的font-size，实现750px设计稿上xpx可以被转换成375px屏幕下的x/2px
    'postcss-px2rem': {
        remUnit: 200,
    }

}
```

```
// head.html
<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0" name="viewport">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="format-detection" content="telephone=no"/>
<script>
	(function(win, doc) {
		var docEl = doc.documentElement;
		var refreshRem = function() {
				var w = docEl.getBoundingClientRect().width || 320;
				var fontSize = w / 3.75; // 750px设计稿下，root font-size: 100px为基准
				fontSize = fontSize > 200 ? 200 : fontSize;
				docEl.style.fontSize = fontSize + "px";
				win.fontSize = fontSize;
			},
			refreshRemId;
		win.addEventListener(
			"resize",
			function() {
				clearTimeout(refreshRemId);
				refreshRemId = setTimeout(refreshRem, 100);
			},
			false
		);
		win.addEventListener(
			"pageshow",
			function(e) {
				if (e.persisted) { // 来自缓存
					clearTimeout(refreshRemId);
					refreshRemId = setTimeout(refreshRem, 100);
				}
			},
			false
		);
		refreshRem();
	})(window, document);
</script>
```

```
// foot.html
<script crossorigin="anonymous" integrity="sha384-qu2J8HSjv8EaYlbzBdbVeJncuCmfBqnZ4h3UIBZ9WTZ/5Wrqt0/9hofL0046NCkc" src="//lib.baomitu.com/zepto/1.2.0/zepto.min.js"></script>
```
