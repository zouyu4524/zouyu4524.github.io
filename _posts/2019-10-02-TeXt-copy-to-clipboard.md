---
layout: article
key: TeXt-copy-to-clipboard
title: "为博客添加代码块一键复制功能"
author: Yuze Zou
show_author_profile: true
clipboard: true
modify_date: 2019-10-06
tags: ["TeXt", "Jekyll", "Javascript", "GitHub"]
---

参与开源第一步! 第一次的Pull Request, 献给TeXt。

<!--more-->

## 前言

[TeXt](https://github.com/kitian616/jekyll-TeXt-theme)是目前个人网站采用的Jekyll主题, 简单易用, 风格非常符合我的口味; 很大程度激发了我的"创作"热情。由于博文中经常需要贴一些代码块, 一键复制代码是一个需求[#200](https://github.com/kitian616/jekyll-TeXt-theme/issues/200)。本文记录此次的PR, [zouyu4524:copy-to-clipboard](https://github.com/kitian616/jekyll-TeXt-theme/pull/218)。

## 功能简述

- 为博文中的代码块右上角添加复制到剪贴板按钮 <i class="fas fa-copy"></i>, 点击即可复制代码块内容;
- 类似Mathjax, 添加控制变量决定是否启用该功能; 
- 博文内各个代码块独立控制, 即: 可仅为特定的代码块添加。 


<div style="margin: 0" align="center" markdown="1">

![clipboard-demo](https://user-images.githubusercontent.com/16682999/66097584-88597380-e5d1-11e9-9156-04b011c15562.gif){: .shadow.rounded}

</div>

## 主要参考

[clipboard.js](https://clipboardjs.com/)是一款超轻量级的JS脚本, 实现复制到剪贴板功能。此次PR的代码依赖该脚本, 并且复制按钮的风格与操作逻辑也是相应参考其[主页](https://clipboardjs.com/)。

## 实现逻辑

仿照TeXt中对Mathjax支持的实现, 相应修改实现以上提到的功能。首先引入控制变量`clipboard`指示是否需要开启该功能, 因为实现该功能需要加载`clipboard.js`脚本。在需要该功能的前提下, 主要包括两个环节:  

1. 添加相应的样式CSS;
2. 查找页面中目标对象: **`pre`且任意父级包含`snippet` class**, 动态为其创建按钮(`.btn`)对象, 并且监听`mouseenter`[^enter]和`mouseleave`[^leave]事件。

其中步骤1通过`.scss`实现, 样式同样来源于[clipboard.js](https://clipboardjs.com/), 做了适当的精简, 保留了与TeXt项目中定义的样式类不冲突的部分; 而步骤2通过Javascript实现, 查找对象的核心代码如下:  

<div class="snippet" markdown="1">

```
var snippets = document.querySelectorAll('pre');
[].forEach.call(snippets, function(snippet) {
	if (snippet.closest('.snippet') !== null) {
		snippet.firstChild.insertAdjacentHTML('beforebegin', '<button class="btn" data-clipboard-snippet><img class="clippy" height="20" src="/assets/clippy.svg" alt="Copy to clipboard"></button>');
	}
});
```
{: .language-javascript}
</div>

其中`document.querySelectorAll('pre')`[^query]负责查找代码块, 然后通过`closest('.snippet')`[^closest]判断找到的代码块任意父级是否为`snippet` class, 如此便可在博文中控制每个代码块是否提供一键复制的功能了。即: 如果按照原来的插入代码块的方式仍然不提供一键复制功能, 而如果需要提供该功能, 可以在代码块外套上一层`snippet`, 如下:  

<div class="snippet" markdown="1">

~~~
<div class="snippet" markdown="1">

```
def hello():
    print('Hello world!')
```
{: .language-python}
</div>
~~~
{: .language-html}
</div>

## 集成到TeXt项目

上一节中介绍了实现此功能的两个步骤, 以下给出TeXt项目框架以及标注PR修改文件所在的路径。

### TeXt项目结构

```
jekyll-TeXt-theme
 ├── _data
 |     ├── variable.yml
 |     ├── ...
 ├── _includes
 |     ├── scripts
 |     |    ├── lib
 |     |    ├──  ├── copy-to-clipboard.js
 |     |    ├── ...
 |     ├── clipboard.html // load external clipboard.js
 |     ├── copy-to-clipboard.html // determine whether to include clipboard.html and load copy-to-clipboard.js or not
 |     ├── ...
 ├── _layouts
 |     ├── page.html
 |     ├── ...
 ├── _sass
 |     ├── additional
 |     |    ├── _copy-to-clipboard.scss
 |     |    ├── ...
 |     ├── ...
 ├── assets
 |     ├── css
 |     |    ├── main.scss
 |     ├── clippy.svg
 |     ├── ...
 ├── _config.yml
 ├── ...
```

### 修改说明

- `variale.yml` 添加了控制变量`clipboard`, 默认为`false`; 此外, 还添加了`clipboard.js`的CDN地址; 
- `copy-to-clipboard.js` 放置于`_includes/scripts/lib`下, 执行查找页面中目标对象并动态创建按钮的功能; 
- `clipboard.html`与`copy-to-clipboard.html`放置于`_includes`下, 分别用于加载外部`clipboard.js`和判断是否需要开启此功能; 
- `page.html` 添加了执行`copy-to-clipboard.html`的指令; 
- `_copy-to-clipboard.scss`[^note]放置于`_sass/additional`下, 指定了与功能相关组件的样式; 相应在`main.scss`中引入此样式文件; 
- `clippy.svg` 放置于`assets`下, 脚本`copy-to-clipboard.js`中动态创建的按钮图片路径指向此文件; 
- `_config.yml` 中预设了`clipboard`变量为`false`。

### Tips

- `<script>`默认是阻塞式的, 可以设置`async`选项改为非阻塞式;
- JS代码需要注意执行顺序, 例如`copy-to-clipboard.js`依赖外部`clipboard.js`, 则需要先加载`clipboard.js`。

## 总结

通过本次PR, 对TeXt项目的理解更进一步, 对Jekyll编译逻辑更加清晰, 对Liquid语法更熟悉。

[^query]: [Element.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector)
[^closest]: [Element.closest()](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)
[^enter]: [Element: mouseenter event](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event)
[^leave]: [Element: mouseleave event](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event)
[^note]: 本文件由`.css`文件[在线转换](https://jsonformatter.org/css-to-scss)而来。