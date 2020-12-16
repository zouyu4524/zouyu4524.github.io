---
layout: article
key: latex-notes
title: LaTeX相关笔记
modify_date: 2020-12-16
author: Yuze Zou
show_author_profile: true
mathjax: true
clipboard: true
tags: [LaTeX, "笔记"]
---

$\LaTeX$相关问题与解决方式, 不定期更新。<!--more-->

<div style="margin: 0 auto;" align="justify" markdown="1">

## 公式相关

### 调整公式显示大小

论文中时常会出现公式过长超出栏位的情况, 一般可以通过换行、跨双栏的方式解决; 对于略超出栏位的公式, 可以通过适当放缩公式的方式解决, 使用`\resizebox`, 用法如下:
```latex
\resizebox{<length>}{<height>}{$ math equations $}
```
一共有三个参数, 分别指定：长度、高度以及内容。该方法用于**文本模式**, 而非公式模式[^resizebox], 需要显式地声明公式, 举例如下:

{% raw %}
```latex
\begin{equation}
    \resizebox{0.91\hsize}{!}{% 百分号用于去掉由换行多出的空格
        $y_{t}^{3} = -145.071 - 0.003 x_{t-1}^{7} + 0.459 x_{t}^{6} + 0.001 x_{t-1}^{8} 
                     -5.071 x_{t-1}^{9} + 7.322 x_{t-1}^{5} - 0.235 x_{t-1}^{1}$% 此处百分号作用同理
        }
\end{equation}
```
{% endraw %}

以上例子, 通过`\resizebox`将公式的长度设置为栏宽的0.91倍, 而第二个参数用`!`代替, 表示相应的保持长宽比不变[^resizebox2]。此外, 由于`\resizebox`用于文本, 换行将被解释为空格, 这里通过添加`%`的方式跳过换行而避免多余的空格, 一方面改善了代码阅读体验, 也不影响编译的结果。

### 左侧上下标

通过`^{}`, `_{}`可以在表达式的右侧添加上、下标, 而如果需要在左侧添加时, 可以通过`\sideset`命令实现, 该命令属于`amsmath`宏包, 用法如下:

```latex
{\sideset{^#1 _#2}{^#3 _#4} 表达式}
```
其中, `#1`, `#2`, `#3`, `#4`为占位符, 分别表示表达式的左上、左下, 右上, 右下四个位置。如果只需要左侧上、下标, 则可将`#3`, `#4`占位符留空, 但不可省略`^`, `_`。用例如下[^sideset]:

<div class="grid-container">
<div class="grid grid--px-2">
  <div class="cell cell--6" markdown="1">
```latex
{\sideset{^1_2}{^3_4}\sum }
```
</div>
  <div class="cell cell--4">
<div style="padding: 10px 0px" align="center" markdown="1">
  $${\sideset{^1_2}{^3_4}\sum }$$
</div>
</div>
</div>
</div>

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

### 参考文献控制显示作者数量

IEEEtran模板提供了控制参考文献省略作者数量的接口[^bib], 需要在两处做改动以适配个性化需求, 分别是: 

+ 正文中`\begin{document}`之后插入`\bstctlcite{IEEEexample:BSTcontrol}`, 注意务必在`\begin{document}`之后插入, 而不是导言区(即之前)
+ 首个引入的`bib`文件首行插入以下内容:
  ```latex
  @IEEEtranBSTCTL{IEEEexample:BSTcontrol,
      CTLuse_forced_etal       = "yes",
      CTLmax_names_forced_etal = "3",
      CTLnames_show_etal       = "2"
  }
  ```

其中, `CTLuse_forced_etal`、`CTLmax_names_forced_etal`、`CTLnames_show_etal`分别控制: 是否启用作者数量控制、触发作者数量控制的门限、显示的作者数量。以上的参数设定生效后, 参考文献中作者数量**超过3人**的文献将仅显示**前两位**作者, 其他作者以`et al`代替。其他若干可控制的参数可参阅[How to Use the IEEEtran BIB$\mathrm{\TeX}$ Style](http://tug.ctan.org/biblio/bibtex/contrib/IEEEtran/IEEEtran_bst_HOWTO.pdf)。

以下给出完整示例[^bibstyle]:

+ 主文件`main.tex`

```latex
\begin{document}

\bstctlcite{IEEEexample:BSTcontrol} % 使修改的参数生效

\cite{ref1}
\bibliography{ref}
\bibliographystyle{IEEEtran}

\end{document}
```
{: .snippet}

+ 参考文献`ref.bib`

```latex
@IEEEtranBSTCTL{IEEEexample:BSTcontrol,
    CTLuse_forced_etal       = "yes",
    CTLmax_names_forced_etal = "3",
    CTLnames_show_etal       = "2"
}

@article{ref1,
    author = {Braggins, Don},
    journal = {Sensor Review},
    month = {December},
    number = {4},
    pages = {272--277},
    title = {Fingerprint sensing and analysis},
    volume = {21},
    year = {2001}
}
```
{: .snippet}

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
[^sideset]: [\sideset - Tex Command](https://www.tutorialspoint.com/tex_commands/sideset.htm)
[^resizebox]: [Resizebox within equation environment](https://tex.stackexchange.com/a/237051/198472)
[^resizebox2]: [What exactly is the exclamation mark \*in terms of the latex language\* in the resizebox{width}{!}{object} command?](https://tex.stackexchange.com/a/326910/198472)
[^bibstyle]: [undefined control sequence. \\bstctlcite](https://tex.stackexchange.com/a/431089/198472)
[^bib]: [How to Use the IEEEtran BIB$\mathrm{\TeX}$ Style](http://tug.ctan.org/biblio/bibtex/contrib/IEEEtran/IEEEtran_bst_HOWTO.pdf)