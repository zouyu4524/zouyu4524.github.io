---
layout: article
title: "CSS小记若干则"
key: css-note-1
author: Yuze Zou
show_author_profile: true
clipboard: true
mathjax: false
tags: ["CSS", "HTML", "Javascript"]
---

与CSS相关的三个小页面。

<!--more-->

<div style="margin: 0 auto;" align="justify" markdown="1">

## 前言

近期对前端有些手痒, 正好有三个小页面可以拿来练手, 记录实现过程中学到的若干与CSS相关的知识。
 
- [x] 替代word做简易海报, 实现自动填充海报内容; 
- [x] 以简易动画的形式绘制站点URL来由; 
- [x] 个人页面增加悬浮照片。

## 知识点概况

其中涉及到的CSS知识点包括:  

- SVG Path: `stroke-dasharray` \| `stroke-dashoffset`
- `@keyframes` \| `animation`
- `nth-child`
- `@media` \| `screen` \| `max-width`
- `position` \| `relative` \| `float` \| `top`

## 学习CSS布局

这篇[教程](http://zh.learnlayout.com/)快速地介绍了CSS中常用的布局关键词, 适合初学与备查。

## 替代word做简易海报

### 动机

老婆单位需要每周表彰业绩标兵, 制作喜报; 喜报格式很简单, A4大小, 之前用word制作了一版。每周需要根据当周的情况修改标兵姓名, 然后导出为图片格式; 由于有多个业务种类, 是重复性高的一项工作。考虑通过网页实现此功能, 将每周的标兵数据保存为json文件, 直接读取并显示到页面即可, 通过浏览器的打印功能一键出图, 一劳永逸。

### 相关CSS知识点

单个页面是A4大小, 设计`page`对象的样式如下[^A4]:  

```css
page {
  background: white;
  background-image: url("background-images/individual.png");
  background-size: cover; 
  background-repeat: no-repeat;

  display: block;
  margin: 0 auto;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
}

page[size="A4"] {  
  width: 21cm;
  height: 29.7cm; 
}
```
{: .snippet}

其中用到的CSS相关属性包括:  
- `background-image`, 通过`url`指定背景图片的位置;
- `background-size`, 通过设置此属性为`cover`可以让图片覆盖整个`page`对象; 再结合`backgroud-repeat: no-repeat`控制背景图片不会重复;
- `width` \| `height` 分别设置对象的宽度和高度为A4纸张的大小。

如此, 单个页面和背景就完成了; 接下来只需要在上面合适的位置摆放表彰内容即可; 设计一个`div`对象存储表彰内容, 并定义其`class=content_placer`, 相应地`.content_placer`的样式设计如下:  

```css
.content_placer {
  position: relative;
  width: 18cm;
  margin: 0 auto;
  top: 36%;
  font-family: "Microsoft YaHei";
  font-size: 44;
  font-weight: bold;
  text-shadow: 1px 2px rgba(255, 191, 0, 0.60);
  color: gold;
  line-height: 1.8em;
}
```
{: .snippet}

其中用到的CSS相关属性包括:  
- `position: relative`, 指明对象的位置是相对于其父对象的, 相对地如果设定为`absolute`则是相对整个浏览器页面的; 
- `top: 36%`, 表明对象位置上方空出的空间占父对象高度的36%, 相当于将对象**下移**; 
- `line-height: 1.8em`, 表示对象的行高为1.8倍的字体高度; 
- `text-shadow`, 设置文本的阴影效果。

另一方面, 喜报整体上分为两个类型: 个人和团队, 布局上会有少许差别, 这里可以用到**CSS样式"继承"**的概念, 如下:  

```css
.content_placer.group {
  top: 46%;
  text-shadow: 1.5px 2px rgba(255, 0, 0, 0.5);
  color: rgb(255, 229, 153);
  line-height: 1.5em;
}
```
{: .snippet}

默认的`.content_placer`类适用于个人, 团队的样式整体上与个人类似, 但有若干属性需要调整, 那么可以在HTML中为团队类型增加一个class: `group`, 与`content_placer`组合起来, 并如上在`.content_placer.group`中改写相应的属性即可; 在HTML中定义团队的标签如下:  

```html
<div class="content_placer group"></div>
```

### 效果图

<div class="grid-container">
<div class="grid grid--px-2">
  <div class="cell cell--5" style="margin: 0 auto;"><img src="http://img.be-my-only.xyz/notes-on-css-part1-01.png" alt="indi" class="shadow" /><em>个人版</em></div>
  <div class="cell cell--5" style="margin: 0 auto;"><img src="http://img.be-my-only.xyz/notes-on-css-part1-02.png" alt="grp" class="shadow"/><em>团队版</em></div>
</div>
</div>

> 人名已做随机处理。
{:style="font-size: 0.9em"}

### Tips

除了CSS以外, 这个小项目涉及得流程中还包括几个值得记录的点:  

- **Python创建简易的服务器**

由于浏览器的安全性考虑不允许Javascript直接读取本地的文件, 只能考虑创建一个本地服务, 将json文件作为资源host在本地"服务器"上, 再通过`GET`方法获取该文件。而这一过程可以通过Python 3快速实现[^py_server]:  

```shell
cd location/to/the/folder
python -m http.server 8000
```
其中, 8000为端口号, 可以设定任意未被占用的端口号; 启动后, 在浏览器中通过`localhost:8000`即可访问; 所创建的服务器根目录将位于`location/to/the/folder`。

- **一键PDF转PNG**

浏览器打印所得的PDF文件可以通过Linux下的软件`pdftoppm`一键转换为图片[^pdf2img], 并且是每一页对应一张图片, 如下: 

```shell
pdftoppm input.pdf outputname -png
```

> 在Windows下, 可以通过WSL安装Ubuntu系统, 在其上再安装若干实用Linux软件。
{:style="font-size: 0.9em"}

## SVG简易动画

第二个页面是为了演示本站URL的来历, 效果👉[这里](/why-this-domain){:target="_blank"}。本页的动画受到[这个](https://www.youtube.com/watch?v=vJNVramny9k){:target="_ blank"}视频的启发。所展示的图像是一个SVG图片, 由多个字母组成, 每个字母单独为一个`path`顺次并列于`svg`标签下, SVG图片是在[Figma](https://www.figma.com)完成的, 这一点在视频中也有介绍。主要用到的CSS知识点包括:  

`nth-child` \| `stroke-dasharray` \| `stroke-dashoffset` \| `@keyframes`
{: .success}

### nth-child

如上所述, 每个字母独立为一个`path`, 可以通过`path:nth-child(x)`访问到第`x`个`path`, 无需使用Javascript。

### stroke-dasharray

这是实现动画的关键属性, 属于`path`, 该值控制图形的虚线化效果的空白区大小, 默认单位是`px`; 值越大, 空白区越大; 与之配套的还有`stroke-dashoffset`, 控制起始点的偏移; 两者结合起来常见的用法如下: 

<div class="grid-container">
<div class="grid grid--px-2">
<div class="cell cell--6" markdown="1">

```css
path {
  stroke-dasharray: 150;
  stroke-dashoffset: 0;
}
```
{: .snippet}

</div>
<div class="cell cell--6" markdown="1">

```css
path {
  stroke-dasharray: 150;
  stroke-dashoffset: 150;
}
```
{: .snippet}

</div>
</div>
</div>

假设当前的`path`长度为150(可以通过`getTotalLength()`方法获得`path`的长度), 那么左边的写法就显示了该`path`的完整图形, 而右边则完全隐去了该`path`; 因为通过`stroke-dasharray: 150`指定了空白区域的长度与`path`长度等长, 但`stroke-dashoffset`又等于0, 即空白区域实际上从`150-0`处才开始, 也就看不到空白区域了; 相反若指定`stroke-dashoffset: 150`则空白区域从`150-150=0`处开始, 并且空白区长度与`path`等长, 故`path`就被隐去了。

### @keyframes 与 animation

接下来就是"动起来"。顾名思义, `@keyframes`中可以指定**关键帧**的样式, 再结合`animation`, CSS将自动根据填补关键帧之间的变化过程从而形成动画效果。`@keyframes`的使用示例如下:  

<div class="grid-container">
<div class="grid grid--px-2">
<div class="cell cell--6" markdown="1">

```css
@keyframes name-one {
  from {
    stroke-dashoffset: 150;
  }
  to {
    stroke-dashoffset: 0;
  }
}
```
{: .snippet}

</div>

<div class="cell cell--6" markdown="1">

```css
@keyframes name-two {
  0%, 50% {
    fill: transparent;
  }
  100% {
    fill: red;
  }
}
```
{: .snippet}

</div>
</div>
</div>

其中, 跟在`@keyframes`后的为这组关键帧的名称, 方便在`animation`中调用; 而在一组关键帧中可以指定多个时间节点的特征, 例如左边用`from`\|`to`两个点表示动画的开始\|结束两个时间节点; 也可以像右边通过百分比指定时间节点。因为`@keyframes`并不决定动画的绝对时长, 只确定相对的节点, 可以方便与`animation`的控制参数"脱钩"。  
**结合`animation`的用例如下**:  

```css
path:nth-child(1) {
  animation: 
    name-one 1s ease forwards,
    name-two 1s ease forwards 1s;
}
```
{: .snippet}

如上, 将在为第一个`path`添加两个动画: `name-one`和`name-two`, 分别持续`1s`, 并且`name-two`延迟`1s`后执行, 从而实现两个动画衔接的效果。基于以上的原理, 根据预期实现的效果对应为每个字母设计相应的关键帧与动画即可。

## 个人页面增加悬浮照片

最后一个页面是为CV页添加悬浮照片, 可以在[这里](/about.html)看到效果。用到的CSS知识点如下: 

- `float` \| `display: none`
- `@media` \| `screen` \| `max-width`

**用例如下**:
{:style="margin-block-end: 0em"}
<div class="grid-container">
<div class="grid grid--px-2">
<div class="cell cell--6" markdown="1">

```css
#ID_PHOTO {
  position: relative;
  float: right;
  z-index: 99;
}
```
{: .snippet}
</div>
<div class="cell cell--6" markdown="1">

```css
@media screen and (max-width: 800px) {
  #ID_PHOTO {
    display: none !important;
  }
}
```
{: .snippet}

</div>
</div>
</div>

其中`float: right`将图片对象放置于其父容器的右侧; 而`@media`用于控制浏览器窗口大小变化时相应的样式变化, 这里结合`max-width: 800px`的逻辑是: 当屏幕宽度小于800px时设置`#ID_PHOTO`对象的显示属性为`none`, 即隐藏。

### 移动对象

由于CV页是借由主题提供的模板布局写成, 语言为markdown, 那么新增一个照片对象在其中时, 其父容器也就由插入的位置确定了; 但我想改一下其父对象以达到更合预期的效果, 这时就需要用到一点Javascript了[^move_elem]。

```javascript
(function () {
    document.querySelector(".article__header header").appendChild(
        document.querySelector("#ID_PHOTO")
    );
})();
```
{: .snippet}

以上语法言简意赅, 可以实现需求。

[^A4]: [A4 CSS page template](https://codepen.io/rafaelcastrocouto/pen/LFAes)
[^py_server]: [Python: Let’s Create a Simple HTTP Server](https://www.afternerd.com/blog/python-http-server/)
[^pdf2img]: [How to convert PDF to Image?](https://askubuntu.com/a/50180/1007981)
[^move_elem]: [How to move an element into another element?](https://stackoverflow.com/a/54263203/8064227)

</div>