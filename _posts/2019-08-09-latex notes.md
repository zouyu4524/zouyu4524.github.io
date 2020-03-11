---
layout: article
key: latex-notes
title: LaTeX相关笔记
modify_date: 2020-03-10
author: Yuze Zou
show_author_profile: true
mathjax: true
clipboard: true
tags: [LaTeX]
---

$\LaTeX$相关问题与解决方式, 不定期更新。<!--more-->

<div style="margin: 0 auto;" align="justify" markdown="1">

## 公式相关

### 算法换行保持缩进

在使用`algorithm`包编辑算法时, 偶尔会需要进行换行, 但不增加行号, 在此记录比较简便的方法[^wrap]。

- 示例:

```latex
\begin{algorithm}
    \begin{algorithmic}[1]
        \State \hspace{5mm} Here is a sentence that needs to be broken into new line \newline
               \hspace*{5mm} while maintaining indent.
    \end{algorithmic}
\end{algorithm}
```
{: .snippet}

效果如图所示: 

<div style="margin: 0 auto;" align="center">
    <img src="https://img.be-my-only.xyz/latex-notes-01.png" alt="wrap" width="80%" class="shadow rounded">
</div>

其中用到的关键词包括: `\newline`以及`\hspace*{}`。两者搭配使用即可。`\newline`负责换行并保持行号不自增（如果是`\\`会使行号自增）; 而`\hspace*{}`负责缩进控制, 务必加上`*`, 以告诉编译器此处缩进有效, 否则缩进将被无视[^hspace]。

### $\max$下换行

- 示例:  

$$
\max_{\substack{\alpha, \beta, \gamma, \\\\ \phi, \psi} } \quad \text{Objective} \nonumber
$$

- 源码:  

```latex
\max_{\substack{\alpha, \beta, \gamma, \\ \phi, \psi} } \quad \text{Objective}
```
用到的语法是: `\substack`[^substack], 需要引入的包为: `amsmath`。

## 安装

### Linux上安装texlive

在windows安装ctex合集就能搞定日常需要使用的各种tex环境与包, 相应的在Linux上需要安装texlive以配置latex的环境。通过以下命令安装: 


```bash
sudo apt-get install texlive
```

该命令将安装常用的tex环境和包, 但是仍然缺若干的package或字体, 例如: `algorithm`, `multirow`以及`bbm`, 相应的可以通过安装`texlive-science`[^2], `texlive-latex-extra`[^3]以及`texlive-fonts-extra`[^1]补充。

此后, tex文件可以正常编译, 但可能出现无法显示参考文献的情况, 原因是还缺少`texlive-publishers`, 需要相应安装[^6]。

### Linux上完全卸载texlive

~~~bash
sudo apt-get purge texlive*
sudo rm -rf /usr/local/texlive/* and rm -rf ~/.texlive*
sudo rm -rf /usr/local/share/texmf
sudo rm -rf /var/lib/texmf
sudo rm -rf /etc/texmf
sudo apt-get remove tex-common --purge
rm -rf ~/.texlive
find -L /usr/local/bin/ -lname /usr/local/texlive/*/bin/* | xargs rm
~~~

## 杂项

### IEEEtran会议模板启用`\thanks`

默认情况下, IEEEtran会议模板禁用了`\thanks`, `\IEEEmembership`等标识, 导致编译时被略去, 可以通过在`\begin{document}`前加入`\IEEEoverridecommandlockouts`消去禁用[^4]。

### TexStudio生成dvi文件

默认情况下, texstudio采用`pdflatex`编译器, 将由tex文件生成pdf文件。将编译器修改为`latex`即可默认生成dvi文件。

需要注意的是`latex`编译器对`.pdf`格式插图支持不如`pdflatex`[^size], 最好使用`.eps`插图。
{: .error}

### PDF插图转eps格式

接上一条, 若插图为pdf格式, 需要转为eps格式。Windows可以使用Adobe acrobat另存为选择eps格式即可。Linux可以使用如下脚本[^pdf2eps], 将其保存为`pdf2eps`:   

```bash
#!/bin/sh
# $Id: pdf2eps,v 0.01 2005/10/28 00:55:46 Herbert Voss Exp $
# Convert PDF to encapsulated PostScript.
# usage:
# pdf2eps <page number> <pdf file without ext>

pdfcrop "$2.pdf" "$2-temp.pdf"
pdftops -f $1 -l $1 -eps "$2-temp.pdf" "$2.eps"
rm  "$2-temp.pdf"
```
{: .snippet}

> 其中用到`pdfcrop`与`pdftops`, `pdfcrop`是`texlive-extra-utils`组件之一。

### Unknown document class (or package)

论文写作时如在IEEEtran模板下使用`caption`包, 大概率会出现如下警告提示:   

```
Unknown document class (or package),
(caption)   standard defaults will be used.
See the caption package documentation for explanation.
```

其原因在于[^caption]:  

> This warning appears when your document does not have definition of \@makecaption command.

解决办法在[这里](https://tex.stackexchange.com/a/348152/198472)给出, 不再赘述。


</div>

[^1]: [Installing bbm.sty in linux](https://tex.stackexchange.com/a/300107)
[^2]: [How to install the algorithms package?](https://tex.stackexchange.com/a/28632)
[^3]: [! LaTeX Error: File `multirow.sty` not found](https://tex.stackexchange.com/a/343324)
[^4]: [\thanks won't appear in IEEEtran](https://tex.stackexchange.com/a/53548)
[^5]: [How to remove everything related to TeX Live for fresh install on Ubuntu?](https://tex.stackexchange.com/a/95502)
[^6]: [Can't make citations on Ubuntu](https://www.reddit.com/r/LaTeX/comments/2tzg07/cant_make_citations_on_ubuntu/)
[^substack]: [How to break line of subscript under min?](https://tex.stackexchange.com/a/182675/198472)
[^size]: [Cannot determine size of graphic](https://tex.stackexchange.com/a/17737/198472)
[^pdf2eps]: [How to convert PDF to EPS?](https://tex.stackexchange.com/q/20883/198472)
[^wrap]: [Include a line break in algorithmic while maintaining indentation](https://tex.stackexchange.com/a/444471/198472)
[^hspace]: [\\hspace vs. \\hspace\*](https://tex.stackexchange.com/a/89090/198472)
[^caption]: [Package caption Warning: Unsupported document class](https://tex.stackexchange.com/a/348152/198472)