---
layout: article
title: 常用软件与工具
key: useful-tools
modify_date: 2020-04-30
pageview: false
aside:
    toc: true
---

## A

- [Adobe Acrobat](https://acrobat.adobe.com): PDF阅读与编辑工具
- [Anaconda](https://www.anaconda.com/): Python环境管理工具
- [Android Studio](https://developer.android.com/studio): IDE for Android
- [AutoHotkey](https://www.autohotkey.com/): 自定义快捷键, 可用于设置窗口置顶[^hotkey]
- [ArcTime](https://arctime.org/): 字幕制作软件[^arctime]

## B

- [Bandizip](https://en.bandisoft.com): 解压缩软件, 力荐
- [Bocop](http://www.bocop.org/): 最优化控制问题(Optimal Control Problem)求解软件

## C

- [CTeX](http://www.ctex.org/CTeXDownload): $\LaTeX$傻瓜式安装工具
- [CVX](http://cvxr.com/cvx/): 凸优化问题求解工具, 基于MATLAB开发, 有Python版([CVXPY](https://www.cvxpy.org/)), 但两者solver不一致, 结果不一定相同

## D

- [Docker](https://www.docker.com/): 部署工具, 相对虚拟机更轻量级; Windows下因为Hyper-V[^vb]<sup>, </sup>[^docker]与VirtualBox不相容
- [Davinci Resolve](http://www.blackmagicdesign.com/products/davinciresolve): 视频剪辑与调色软件

## E

- [Everything](https://www.voidtools.com): 系统搜索工具
- [EasyBCD](https://neosmart.net/EasyBCD/): 系统引导设置工具, 双系统可能需要

## F

- [Fork](https://git-fork.com/): 图形化Git管理工具
- [Fraps](https://www.fraps.com): 实时显示帧数
- [Figma](https://www.figma.com): 绘制SVG图像, 设计页面布局等
- [FFmpeg](https://www.ffmpeg.org/): 视频、流媒体相关的完善解决方案

## G

- [GeoGebra](https://www.geogebra.org/): 开源版几何画板
- [Git](https://git-scm.com/): 代码版本控制
- [光影魔术手](http://www.neoimaging.cn/): 简单的图片编辑软件, 一般用来简单的抠图(色度抠图)或调整图片尺寸、大小

## H

- [Hyper](https://hyper.is/): 美化的Terminal, 推荐替换WSL下默认的Terminal[^hyper]
- [HyperCam2](http://hypercam.uptodown.hyperionics.com/hc2/): 录屏软件

## I

- [IntelliJ IDEA](https://www.jetbrains.com/idea/): IDE for Java

## J

- [JRE](https://www.oracle.com/technetwork/java/javase/downloads/index.html): Java Runtime Environment, Java运行时环境, 基于Java应用的基础

## L

- [Language Tool](https://languagetool.org/): 语法查错工具

## M

- [MATLAB](https://www.mathworks.com/products/matlab.html): 工科必备
- [Mathematica](https://www.wolfram.com/mathematica/): 一款优秀的数学、工程软件
- [Microsoft Office](https://www.office.com): 办公三件套
- [MiKTeX](https://miktex.org/): $\LaTeX$编译器与包管理工具, 推荐Windows系统下使用

## N

- [Notepad++](https://notepad-plus-plus.org/downloads/): 文本编辑工具, 复制文本粘贴用来除去格式很方便, 正则匹配文本替换。

## O

- [Octave](https://www.gnu.org/software/octave/): 开源版MATLAB, 功能有限, 稳定性一般(Linux版)
- [Onedrive](https://onedrive.live.com): 云盘, 国内部分ISP网络访问受限, 网页版得翻墙

## P

- [PuTTY](https://www.putty.org/): SSH客户端, 主要用于Windows cmd中使用`pscp`命令从Linux服务器上获取文件
- [PyCharm](https://www.jetbrains.com/pycharm/): IDE for Python

## S

- [Screen2Gif](https://www.screentogif.com/): 录屏并转换为GIF动图, 力荐
- [Sublime Text 3](https://www.sublimetext.com/download): 文本编辑器, 简易的IDE, 个人站点用其编辑
- [Samba](https://www.samba.org/): Linux、Unix操作系统与Windows间实现文件共享
- [Streamlink](https://github.com/streamlink/streamlink): 在线视频下载工具, 与[youtube-dl](https://github.com/ytdl-org/youtube-dl)类似

## T

- [TeXStudio](https://www.texstudio.org/): $\LaTeX$编辑器, 与**Language Tool**以及**MiKTeX**一道组成写论文必备。
- [Texlive](https://www.tug.org/texlive/): 另一个$\LaTeX$编译器与包管理工具, 推荐Linux系统下使用

## U

- [UltraISO](https://www.ultraiso.com/): U盘启动盘制作工具

## V

- [Vmware workstation player](https://www.vmware.com/products/workstation-player.html): 虚拟机工具
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads): 另一个虚拟机工具
- [V2Ray](https://www.v2ray.com/): 翻墙工具
- [Visio](https://products.office.com/visio/flowchart-software): 流程图工具

## W

- [WSL 2](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install): Windows Subsystem for Linux 2, Win10 Linux子系统
- [WinSCP](https://winscp.net/eng/index.php): Windows平台好用的文件传输客户端, 支持SSH、SCP等

## X

- [XShell](https://www.netsarang.com/en/xshell/): 远程连接服务器工具箱

## Y

- [youtube-dl](https://github.com/ytdl-org/youtube-dl): 在线视频下载工具, 如油管和其他以`m3u8`格式提供串流的视频网站

[^vb]: [Running a Virtual Machine when Windows Hyper-V is enabled should NOT Crash Windows](https://www.virtualbox.org/ticket/16801)
[^docker]: [Microsoft Hyper-V](https://docs.docker.com/machine/drivers/hyper-v/)
[^hotkey]: [AutoHotKey 超強自訂快速鍵工具](https://www.youtube.com/watch?v=PJ6L0sBpI5Y)
[^hyper]: [WSL Terminal colors, tabs & styling - Windows subsystem for Linux series](https://www.youtube.com/watch?v=kY4Ns260i2k)
[^arctime]: [每次替影片上字幕都觉得很厌世？学会这招让你从谷底反弹重生！](https://www.youtube.com/watch?v=Fz9VRqSFZAc)