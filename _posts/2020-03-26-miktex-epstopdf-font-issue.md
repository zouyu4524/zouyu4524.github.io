---
layout: article
title: "MiKTeX epstopdf 字体问题"
key: miktex-epstopdf-font-issue
author: Yuze Zou
show_author_profile: true
clipboard: true
tags: ["LaTeX"]
---

<div style="margin: 0 auto;" align="justify" markdown="1">

近期整理了Windows系统中的LaTeX编译环境, 发现MiKTeX的epstopdf功能出现bug, 由eps转出的pdf图片为空。原因在于: MiKTeX未安装该eps中嵌入的字体。本文记录解决此问题的过程。<!--more-->

## 问题描述

论文中的插图一般以`eps`格式存储, 编译过程中会通过`epstopdf`包将eps图片转为`pdf`格式, 然后嵌入文章中。但最近在修改了某一插图后再编译发现了奇怪的问题: **eps图片单独打开正常, 编译未报错, 但文中被修改的图片处留白。**

## 解决过程

由于图片是通过MATLAB导出的, 首先以为问题是MATLAB的问题, 于是先通过MATLAB将fig导出为pdf, 然后通过Adobe Acrobat将pdf转为eps, 经此转换后得到的eps即可成功嵌入文中。而后发现在编译日志中有如下的错误提示:

```
Error: /invalidfont in /findfont
Operand stack:
   Helvetica-Oblique
Execution stack:
   %interp_exit   .runexec2   --nostringval--   --nostringval--   --nostriMiKTeX GPL Ghostscript 9.25: Unrecoverable error, exit code 1
ngval--   2   %stopped_push   --nostringval--   --nostringval--   --nostringval--   false   1   %stopped_push   2015   1   3   %oparray_pop   2014   1   3   %oparray_pop   --nostringval--   1998   1   3   %oparray_pop   1884   1   3   %oparray_pop   --nostringval--   %errorexec_pop   .runexec2   --nostringval--   --nostringval--   --nostringval--   2   %stopped_push   --nostringval--   1967   1   3   %oparray_pop
Dictionary stack:
   --dict:973/1684(ro)(G)--   --dict:0/20(G)--   --dict:123/200(L)--
Current allocation mode is local
Last OS error: No such file or directory

Sorry, but "MiKTeX EPS-to-PDF Converter" did not succeed.

The log file hopefully contains the information to get MiKTeX going again:

  C:\Users\yuze\AppData\Local\MiKTeX\2.9\miktex\log\epstopdf.log
```

相应的, 遵循该错误提示找到`epstopdf.log`文件, 有如下内容: 

```
2020-03-26 16:58:14,467+0800 INFO  epstopdf - starting with command line: epstopdf --outfile=./figures/fig2_-eps-converted-to.pdf ./figures/fig2_.eps
2020-03-26 16:58:15,859+0800 FATAL epstopdf - Invalid argument
2020-03-26 16:58:15,863+0800 FATAL epstopdf - Info: 
2020-03-26 16:58:15,868+0800 FATAL epstopdf - Source: Libraries\MiKTeX\Core\Stream\FileStream.cpp
2020-03-26 16:58:15,868+0800 FATAL epstopdf - Line: 68
```

以上错误提示仍然是一头雾水。Google后找到了相同的[问题](https://tex.stackexchange.com/questions/519027/error-while-using-epstopdf)。根据提供的解决方案的解释[^epstopdf]:

> I guess you do not have the necessary fonts installed within your MiKTeX. Make sure you have all the packages mentioned here https://github.com/MiKTeX/miktex-packaging/issues/112 installed and try again.

即MiKTeX未安装eps图片中的部分字体(这里是`Helvetica-Oblique`), 为此解决方案即相应安装对应字体所属的package即可(这里是`helvetic`)。
{: .success}

*这也解释了为什么通过Adobe Acrobat转换后的eps图片可以正常嵌入, Acrobat会嵌入字体, 无需由MiKTeX提供。*

## 解决办法

对于此类问题, 解决办法概括如下: 根据提示缺少的字体, 找到相应的字体package, 通过MiKTeX Console安装即可[^issue1]<sup>, </sup>[^issue2]。
> **注**: 需要先删除已生成的空白pdf文件, 否则编译将跳过`epstopdf`这一过程。

## `epstopdf`的用法

```bash
epstopdf --outfile=fig1.pdf fig1.eps
```

</div>

[^epstopdf]: [Error while using epstopdf](https://tex.stackexchange.com/a/519193/198472)
[^issue1]: [Suggested feature: epstopdf - alert on missing font packages #429](https://github.com/MiKTeX/miktex/issues/429)
[^issue2]: [Not all Ghostscript's free fonts are included in Basic Installer #112](https://github.com/MiKTeX/miktex-packaging/issues/112)