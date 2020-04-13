---
layout: article
title: "为博客提供两种视频源选择"
key: dual-player
author: Yuze Zou
show_author_profile: true
clipboard: true
mathjax: false
tags: ["前端"]
---

本文为博客设计了一种视频嵌入方案: 可以由用户自主选择播放源。

<!--more-->

<div style="margin: 0 auto;" align="justify" markdown="1">

## 动机

[TeXt](https://github.com/kitian616/jekyll-TeXt-theme)主题提供了博客嵌入视频的简便方式, 但是存在的一个问题是如果用户从国内访问, 嵌入的油管视频在不经过科学上网的情况下无法加载, 导致页面载入缓慢(直至油管视频Timeout), 这将大大降低用户体验。为此, 考虑改进嵌入视频的方案: 为用户提供按钮选择, 自主切换播放源。默认情况下可以载入B站播放源, 或根据浏览器语言种类预先判断从而提供“合适”的播放源。

## 实现方案

起初, 考虑通过判断用户“网络”地理位置而相应设置播放源: 如果在国内则提供B站播放源, 否则提供油管源。判断地理位置的方式主要有如下两种:  

- 第三方API, 如: `https://ipinfo.io`判断用户的IP[^1], 返还的json信息中包括区域信息
- `navigator.geolocation`[^3]


**这两个方案各有缺点**: 方法一API免费使用的次数有限, 可以注册账号, 申请免费token加入到API后缀中: `https://ipinfo.io?token=xxx`, 但由于网站托管于GitHub Pages下, 这些信息都是公开的, 不妥。另一方面, 更为主要的弊端在于这个API域名从国内访问比较慢, 增加这一过程收益太低, 相对成本却比较高。而方法二是HTML 5标准下的不错方案, 主要的问题是浏览器将会询问用户是否允许网页读取地理信息的权限。这一提示未免有些“扎眼”, 用户不一定会通过该权限。此外, 该方法务必在https协议下才有效, 这给本地调试(localhost)带来了一定的麻烦(解决方案可参考:[^2], 暂未尝试)。

### 方案设计

因此, 退而求其次, 给出相对“保守”的方案: 为用户提供两个按钮, 分别对应B站和油管的播放源, 用户可以自主选择。剩下的问题就是默认的播放源怎么办？可以采用通过浏览器语言(`navigator.language`)的方式做一个粗略的判断。如果浏览器语言为中文, 则默认选择B站播放源, 否则选择油管源。


### 实现细节

为了实现以上方案, 涉及如下几个细节:  

- `iframe`加载方式
- 传递Liquid参数到Javascript脚本中
- 同一页面下多组视频相互区分的实现

`iframe`组件的特点在于设定(或修改)`src`后, 该组件将发起对相应`src`的请求[^4]。利用这一特点, 只需要为两个按钮绑定`click`事件监听, 并执行切换`iframe`组件对应`src`即可。另一方面, 为方面编写文章时的便利, 仿照[嵌入YouTube视频](https://tianqi.name/jekyll-TeXt-theme/docs/en/extensions#youtube)的用法, 需要将视频ID参数传递到Javascript脚本中, 而Javascript脚本原生就支持Liquid的参数传递语法, 示例如下[^5]:

{% raw %}
```
<script>
var myVar = {{yourLiquidVar | json}}
</script>
```
{: .language-javascript}
{% endraw %}

最后, 由于一个页面中可能插入多组视频, 如何区分不同的视频使得按钮控制对应的`iframe`组件？为实现这一功能, 考虑设计如下的组件结构:  

```
<div id="dual-player">
    <button class="bilibili"></button>
    <button class="youtube"></button>
    <div class="extensions extensions--video">
        <iframe></iframe>
    </div>
</div>
```
{: .language-html}

将两个按钮与原本的`iframe`组件并列为一级, 而在外层套用一个`div`, 并为其赋予`id=dual-player`。通过紧跟着的Javascript脚本查找`dual-player`元素, 并为其**生成唯一的id替换之**, 接下来为该元素内的两个button绑定`click`事件监听即可。如此, 每一组视频的两个按钮都唯一与`iframe`对应, 实现独立控制的效果。其中, 生成唯一ID的方法参考[这里](https://gist.github.com/gordonbrander/2230317)。

## 源码与用例

### 使用方法

{% raw %}
<div class="snippet" markdown="1">

```
<div>{% include extensions/dual-player.html id_y='mVHXOtVwWG4' id_b='41965268' %}</div>
```
{: .language-liquid}
</div>
{% endraw %}


### 源码

以下代码复制粘贴至`_includes/extensions/dual-player.html`下即可。

{% raw %}
<div class="snippet" markdown="1">

```
<div id="dual_player">
	<a class="button button--primary button--rounded bilibili" style="background-color: #00A1D6;">BiliBili</a>
	<a class="button button--primary button--rounded youtube" style="background-color: #FF1E1E;">YouTube</a>
<div class="extensions extensions--video" style="top: -0.5rem">
	<iframe src="" frameborder="no" scrolling="no" allowfullscreen="true"></iframe>
</div>
</div>

<script type="text/javascript">
(function () {

	var src_b = "//player.bilibili.com/player.html?aid={{ include.id_b | json }}&page=1";
	var src_y = "https://www.youtube.com/embed/{{ include.id_y | json }}?rel=0&showinfo=0";
	
	var unique_id = 'video_' + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 5);

	// replace dual player's id as an unique one
	document.getElementById('dual_player').id = unique_id;

	var src_url = src_b; // use bilibili as default
	var language = navigator.language;
	
	if ( language !== "zh-CN" ) {
    	// use youtube if the language is not zh-CN
    	src_url = src_y;
    }
    document.getElementById(unique_id).querySelector("iframe").src = src_url;

    // bind two buttons with bilibili and youtube links, respectively
    document.getElementById(unique_id).querySelector(".bilibili").addEventListener("click", function () {
		this.parentElement.querySelector("iframe").src = src_b;
	});
    document.getElementById(unique_id).querySelector(".youtube").addEventListener("click", function () {
	    this.parentElement.querySelector("iframe").src = src_y;
    });
    
})();
</script>
```
{: .language-html}
</div>
{% endraw %}

## 效果演示

我最喜欢的两个科普博主: [妈咪说](https://space.bilibili.com/223146252)和[李永乐老师](https://space.bilibili.com/9458053), 正好都有在B站和油管上发布视频。

### 妈咪说MommyTalk

<div>{%- include extensions/dual-player.html id_y='mVHXOtVwWG4' id_b='41965268' -%}</div>

### 李永乐老师

<div>{%- include extensions/dual-player.html id_y='fOzR-PO-lQ8' id_b='70593729' -%}</div>

## Tips

### Javascript变量作用域

源码script脚本中声明了`var src_b`和`var src_y`以存储B站源和油管源的视频地址, 注意script脚本通过以下结构包裹:

```
(function () {
    // ...
})();
```
{: .language-javascript}

其作用在于控制其中声明的变量仅在当前闭包内有效, 防止变量“污染”[^6]。

### Liquid的{% raw %}`{% raw %}`{% endraw %}

<div id="escape-liquid-raw-inside-raw-environment" markdown="1">

博客中插入的代码若包括Liquid语法, 如: {% raw %}`{{ }}`或`{% %}`{% endraw %}, 则需要注意使用{% raw %}`\{% raw %\}`与`\{% endraw %\}`{% endraw %}控制Liquid语法有效区域, 默认情况下Liquid语法优先级最高, 任意位置的包括Liquid语法的字符都会被执行并替换, 因此若需要注释相应的Liquid语法, 可以通过{% raw %}`\{% raw %\}`{% endraw %}标签暂时关闭, 如下[^7]: 

{% raw %}
```
\{% raw %\}
Hello, my name is {{name}}.
\{% endraw %\}
```
{% endraw %}

</div>

[^1]: [Find user location using jQuery/JS (without google geolocation api)?](https://stackoverflow.com/questions/14177647/find-user-location-using-jquery-js-without-google-geolocation-api)
[^2]: [HOW TO GET HTTPS WORKING IN WINDOWS 10 LOCALHOST DEV ENVIRONMENT](https://zeropointdevelopment.com/how-to-get-https-working-in-windows-10-localhost-dev-environment/)
[^3]: [HTML5 Geolocation](https://www.w3schools.com/html/html5_geolocation.asp)
[^4]: [Iframe loading techniques and performance](http://www.aaronpeters.nl/blog/iframe-loading-techniques-performance)
[^5]: [Using Liquid variables in JavaScript](https://stackoverflow.com/questions/51769347/using-liquid-variables-in-javascript)
[^6]: [变量作用域与解构赋值](https://www.liaoxuefeng.com/wiki/1022910821149312/1023021187855808)
[^7]: [Escaping double curly braces inside a markdown code block in Jekyll](https://stackoverflow.com/questions/24102498/escaping-double-curly-braces-inside-a-markdown-code-block-in-jekyll/)

</div>

<!-- remove backslash used to escape liquid raw control inside raw control -->
<script type="text/javascript">
	var text = document.getElementById('escape-liquid-raw-inside-raw-environment').innerHTML;
	document.getElementById('escape-liquid-raw-inside-raw-environment').innerHTML = text.replace(/\\/g, "");
</script>