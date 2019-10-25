---
layout: article
title: "TeXStudio配置"
key: texstudio-settings
author: Yuze Zou
show_author_profile: true
clipboard: true
tags: ["LaTeX"]
---

本文简要概括TeXStudio编辑器的相关配置。
<!--more-->

<div style="margin: 0 auto;" align="justify" markdown="1">

## 依赖项

[TeXStudio](https://www.texstudio.org/)是一款$\LaTeX$编辑器, 其本身并不包括$\LaTeX$编译器, 因此在安装之前需要先安装编译器:  
**MiKTeX**: Windows preferred 或者 **TeXlive**: Mac OS/Linux preferred

## 主题设置

默认的TeXStudio主题是白色背景, 对我来说看久了眼睛疼, 最后用<span style="background-color: #fdf6e3; color: gray;">米黄色</span>代替, 相应的主题设置文件可以在[这里](https://gist.githubusercontent.com/zouyu4524/c42da1e62bde9d582b49c995e0a2a952/raw/993decd91890aca6bc44594626e85fab62c4f12c/Solarized_Light)[^theme]找到。具体的设置方法如下[^setting]:  

- 定位到TeXStudio的配置文件: texstudio.init, 一般位于: `~\AppData\Roaming\texstudio\texstudio.ini`, 如果找不到的话, 可以在主界面<kbd class="dark-apple">→</kbd>Help<kbd class="dark-apple">→</kbd>Check LaTeX Installation<kbd class="dark-apple">→</kbd>在弹出的`System Report`文件中查找**Setting file**对应的路径即可。
- 然后在`texstudio.ini`文件中查找`[formats]`标签, 并用[配置文件](https://gist.githubusercontent.com/zouyu4524/c42da1e62bde9d582b49c995e0a2a952/raw/993decd91890aca6bc44594626e85fab62c4f12c/Solarized_Light)替换即可。

除此以外, 生成的PDF文件预览一般也是白色背景, 也可以相应改一下背景色, 修改方法为: 在导言区(`\begin{document}`之前)添加如下语句[^pagecolor]<sup>, </sup>[^rgb]:

```latex
\usepackage{xcolor}
\definecolor{cream}{RGB}{253, 246, 227}
\pagecolor{cream!90}
```
{: .snippet}

其中`\pagecolor`需要用到`xcolor`包, 而我需要的背景颜色RGB值如上, 通过`\definecolor`指令定义即可。效果如图所示:

![theme-demo](https://user-images.githubusercontent.com/16682999/67468118-8d638d00-f67c-11e9-9aa9-8170997d7df9.png)
{: .shadow.rounded}

**PS**: 相同的方法, 还以用到其他的主题配置, 如深色: [这个](https://robjhyndman.com/hyndsight/dark-themes-for-writing/)和[这个](https://tex.stackexchange.com/a/279321/198472)。

## 语法检查

TeXStudio另一个方便之处在于可以集成Language Tool, 提供语法纠错功能。具体的配置方法在此不重述了, 可以参考这篇[博客](https://blog.csdn.net/yinqingwang/article/details/54583541), 有详尽的操作流程。主要的依赖包括:  

- [x] JRE: Java运行时环境
- [x] [Language Tool](https://languagetool.org/)

相关的资源备份: [百度云链接](https://pan.baidu.com/s/1KoMLDeKL1s0fopA0kn1hEA) 提取码: 4y8q
{: .success}

</div>

[^theme]: [Francis-Hsu/TeXstudio_Solarized](https://github.com/Francis-Hsu/TeXstudio_Solarized)
[^setting]: [How can I set a dark theme in TeXstudio?](https://tex.stackexchange.com/a/108599/198472)
[^pagecolor]: [Change background colour for entire document](https://tex.stackexchange.com/a/82500/198472)
[^rgb]: [Color RGB in LaTeX](https://tex.stackexchange.com/a/239463/198472)