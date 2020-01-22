---
layout: article
title: "MATLAB绘图小记4则"
key: matlab-plot-notes-part1
author: Yuze Zou
show_author_profile: true
clipboard: true
tags: ["MATLAB"]
---

导出eps不是矢量图的解决方案; 可旋转的文本标注; 灰度colormap; contour标注数值。<!--more-->

<div style="margin: 0 auto;" align="justify" markdown="1">

## 导出图片非矢量解决方案

论文中的配图一般插入矢量图, eps格式, 通过MATLAB的`.fig`文件导出。而绘制的图可能是以`opengl`渲染以到达快速预览的效果(尤其是3D图), 但该渲染模式下导出的eps图片成为了位图, 而非矢量图。为解决此问题, 需要在导出前将fig图的渲染模式改为`Painters`[^eps]。操作如下:  

```matlab
set(gcf, 'renderer', 'Painters')
```
{: .snippet}

## 可旋转的文本标记

在图示中插入标记的方式一般为`TextBox`, 而该类对象不具备旋转属性, 无法修改旋转角度。可旋转的文本标注使用`text`方法[^text], 示例如下:  

```matlab
ht = text(x,y,'My text');
set(ht,'Rotation',45)
```
{: .snippet}

## 灰度colormap

`gray`可输出灰度colormap, 结合`colormap`函数可设置图示colormap为灰度模式[^gray], 精度可以通过`gray(n)`设置, 例如: `gray(256)`表示256级。

```matlab
colormap(gray)
```
{: .snippet}

## contour图标记数值

绘制等高线时标注数值的方法是: `clabel`[^clabel], 示例如下: 

```matlab
[x,y,z] = peaks;
[C,h] = contour(x,y,z);
v = [2,6];
clabel(C,h,v)
```
{: .snippet}

首先通过`[C, h]`获取数值和图示句柄, 作为1, 2号参数传入`clabel`; 额外地, 可以通过三号位参数`v`, 选择性标注数值。

</div>

[^text]: [Rotate annotation textbox](https://www.mathworks.com/matlabcentral/answers/25996-rotate-annotation-textbox)
[^eps]: [Why does MATLAB not export EPS files properly?](https://www.mathworks.com/matlabcentral/answers/92521-why-does-matlab-not-export-eps-files-properly)
[^gray]: [Gray colormap array](https://www.mathworks.com/help/matlab/ref/gray.html)
[^clabel]: [Label contour plot elevation](https://www.mathworks.com/help/matlab/ref/clabel.html)