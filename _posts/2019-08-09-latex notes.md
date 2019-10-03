---
layout: article
key: latex-notes
title: LaTeX相关笔记
author: Yuze Zou
show_author_profile: true
mathjax: true
tags: [LaTeX]
---

$\LaTeX$相关问题与解决方式, 不定期更新。<!--more-->

### IEEEtran会议模板启用`\thanks`

默认情况下, IEEEtran会议模板禁用了`\thanks`, `\IEEEmembership`等标识, 导致编译时被略去, 可以通过在`\begin{document}`前加入`\IEEEoverridecommandlockouts`消去禁用[^4]。

### TexStudio生成dvi文件

默认情况下, texstudio采用pdflatex编译器, 将由tex文件生成pdf文件。将编译器修改为latex即可默认生成dvi文件。

### Linux上安装texlive

在windows安装ctex合集就能搞定日常需要使用的各种tex环境与包, 相应的在Linux上需要安装texlive以配置latex的环境。通过以下命令安装: 


```
sudo apt-get install texlive
```

该命令将安装常用的tex环境和包, 但是仍然缺若干的package或字体, 例如: `algorithm`, `multirow`以及`bbm`, 相应的可以通过安装`texlive-science`[^2], `texlive-latex-extra`[^3]以及`texlive-fonts-extra`[^1]补充。

此后, tex文件可以正常编译, 但是可能出现无法显示参考文献的情况, 原因在于还缺少`texlive-publishers`, 需要相应安装[^6]。

### Linux上完全卸载texlive

~~~
sudo apt-get purge texlive*
sudo rm -rf /usr/local/texlive/* and rm -rf ~/.texlive*
sudo rm -rf /usr/local/share/texmf
sudo rm -rf /var/lib/texmf
sudo rm -rf /etc/texmf
sudo apt-get remove tex-common --purge
rm -rf ~/.texlive
find -L /usr/local/bin/ -lname /usr/local/texlive/*/bin/* | xargs rm
~~~
{: .language-bash}

[^1]: [Installing bbm.sty in linux](https://tex.stackexchange.com/a/300107)
[^2]: [How to install the algorithms package?](https://tex.stackexchange.com/a/28632)
[^3]: [! LaTeX Error: File `multirow.sty` not found](https://tex.stackexchange.com/a/343324)
[^4]: [\thanks won't appear in IEEEtran](https://tex.stackexchange.com/a/53548)
[^5]: [How to remove everything related to TeX Live for fresh install on Ubuntu?](https://tex.stackexchange.com/a/95502)
[^6]: [Can't make citations on Ubuntu](https://www.reddit.com/r/LaTeX/comments/2tzg07/cant_make_citations_on_ubuntu/)