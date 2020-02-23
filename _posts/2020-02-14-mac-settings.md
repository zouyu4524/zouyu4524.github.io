---
layout: article
title: "Mac OS初体验"
key: first-step-on-macOS
author: Yuze Zou
show_author_profile: true
clipboard: true
tags: ["macOS"]
---

入坑OS X, 打造适合科研的mac笔记本。<!--more-->

<div style="margin: 0 auto;" align="justify" markdown="1">

## 前言

一直听说Macbook深受开发者的青睐, 很想体验。老婆的Macbook air是15年款, 此前一直用PD装windows用, 几乎处于闲置状态, 借着放假正好拿来折腾一番。花了几天时间体验, 着实感受到了mac的魅力。本文记录折腾的过程和若干配置。

## 硬件

> Macbook air 13˝, early 2015, 1.6GHz, 双核i5, 4G内存, 250G SSD

配置比较低, 网上甚至有不少评价该款是“电子垃圾”。但是几天的体验, 感觉日常使用绝对够用, 最大的优势在于待机。

## 配置与快捷

### 触摸板

触摸板是macbook的代表, “用了就回不去了”, “鼠标不再需要了”。此前少有的尝试下并没有体会到这种感觉, 这次修改若干配置[^touch]后才体会到。

- [ ] **轻点来点按**: 开启轻点后就可以不再按下触摸板了, 轻松许多;
- [ ] **三指拖动**: 类似PC下鼠标的点击拖动动作, 拖动窗口非常方便, 但选择文本需要一定的练习;
- [ ] **触发角**: 可定制光标移至屏幕四个角的动作。

> 以上的设置非默认开启, 需要自行修改。

- [x] **切换全屏窗口**: 三（四）指滑动;
- [x] **显示桌面**: 张开拇指和其他三指;
- [x] **调度中心**: 三（四）指向上滑动;
- [x] **启动台**: 捏拢拇指和其他三指。

> 以上为默认快捷键。

### 键盘

默认的键盘设置下, **重复前延迟**较高, **按键重复**较慢, 导致给人感觉很卡, 尤其在使用Terminal按下方向键移动光标或者vim通过按键换行时。需要修改这两个设置改善。位于:  <kbd>→</kbd> 系统偏好设置 <kbd>→</kbd> 键盘 <kbd>→</kbd> 键盘（标签页）。

### 快捷键

Mac快捷键中记住`command`键对标Windows的`ctrl`键可以应对大多数情况。
{: .success}

## 软件

### Homebrew

macOS下的包管理神器。原本直接通过一行命令可以安装（下载一键安装脚本并执行）, 但是由于国内网络访问GitHub不畅, 需要先下载脚本, 替换其中的repo地址为国内镜像源。

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

具体可参考链接[^1]<sup>, </sup>[^2]。脚本可能会更新, 参考链接中提到的方法不一定仍然有效, 明确需要安装的模块包括两个即可: `brew` \| `brew-core`。其中`brew`是软件主体, 而`brew-core`用于管理brew官方收录的软件。以上的参考教程中均提到了修改`CORE_TAP_REPO`, 但目前的安装脚本中不再有该变量。导致会卡在如下环节: 

```bash
==> Tapping homebrew/core
Cloning into '/usr/local/Homebrew/Library/Taps/homebrew/homebrew-core'...
```

[^1]的评论区给出了解决方案: 手动创建文件夹并从镜像源clone下`homebrew-core`这个repo。

```bash
cd "$(brew --repo)/Library/Taps/"
mkdir homebrew
cd homebrew
git clone git://mirrors.ustc.edu.cn/homebrew-core.git
brew update
```
{: .snippet}

执行成功后, 将提示`Already up-to-date.`
{: .success}

此外, `homebrew-cask`提供了具有图形化界面或大型的程序库, 也需要同样的方式手动从镜像源安装：

```bash
cd "$(brew --repo)/Library/Taps/"
cd homebrew
git clone git://mirrors.ustc.edu.cn/homebrew-cask.git
brew update
```

在安装好Homebrew两个库以后, 还需要设置homebrew bottles二进制预编译包镜像[^bottles], 否则brew多数情况下会预先从原始的bottles库(Github)下载, 仍然无法起到加速作用。
{: .warning}

- 临时替换

```bash
export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles
```
{: .snippet}

- 长期替换

```bash
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles' >> ~/.bash_profile
source ~/.bash_profile
```
{: .snippet}

### Zsh 与 On-my-zsh

安装好Homebrew以后, 可以顺势安装Zsh和On-my-zsh以获得更佳的终端。Catalina(OSX 10.15)默认将Zsh设置为终端。安装方法如下:

```bash
brew install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```
{: .snippet}

效果如图。
<div style="margin: 0 auto;" align="center" markdown="1">
<img src="https://img.be-my-only.xyz/mac-settings-01.png" width="600px" alt="zsh" class="shadow">
</div>

### MacTeX

论文写作所需的LaTeX工具。同样可以通过Homebrew安装。

```bash
brew cask install mactex
```
{: .snippet}

或者通过[官网](http://www.tug.org/mactex/mactex-download.html)下载。该工具类似于Windows下的MikTeX。

MacTeX更多是作为LaTeX的后台工具, 提供了包管理器和常用的编译器。编辑器可以用[TeXstudio](http://www.texstudio.org/), 比较方便和直观, 在[TeXStudio配置](https://be-my-only.xyz/blog/texstudio-settings/)中给出了常用的配置, 包括搭配LanguageTool做语法检查。这里给出另一个解决方案: **VSCode + LaTeX workshop**。

### VSCode

VSCode强大之处在于其丰富的插件市场, 使其能够成为多种语言的IDE, 对于LaTeX自然也不例外; 而完成这一功能的插件便是: LaTeX workshop。VSCode同样推荐采用Homebrew安装:

```bash
brew cask install visual-studio-code
```
{: .snippet}

在安装好VSCode后， LaTeX workshop插件可以在插件市场搜索并安装。在MacTeX已安装的前提下, 该插件配合使用无需多做设置, 可以方便地编译（自由切换编译器）, 双向跳转, 更酷的是支持**公式实时预览**。此外, 配合Code spell checker插件可以进行单词检查。需要的话还可以安装LTeX插件实现LanguageTool中的语法检查功能[^ltex]（但实际使用体验后, 该插件的反应速度较慢, 体验不佳）。

### V2rayU

科学上网工具不可少。V2Ray是当前最佳的技术之一, 而V2RayU则是V2Ray在Mac上的最佳封装。同样可以通过Homebrew安装:  

```bash
brew cask install v2rayu
```
{: .snippet}

### Office套装

日常中偶尔用到Office三件套, Office for Mac 2019款完全能够胜任我的需求。额外的字体也可同Windows下安装字体方法一致, 双击即可。

### Parallels Desktop

虚拟机, 安装一个Win7系统, 以防万一。

### 其他

其他的装机必备软件就不一一赘述了, 包括但不限于: IINA, Typora, Alfred, Fliqlo, 微信, QQ, 网易云音乐等。

## 系统重装

Mac提供了时间机器功能, 可以外接移动硬盘自动备份系统, 方便系统升降级。而我此前直接将系统直接从El capitan升级到了最新的Catalina, 跳过了中间的系统; 但最新的系统有个很蛋疼的bug: 蓝牙“断连”, 系统会随机地将播放设备由蓝牙耳机切换至内置扬声器[^bug]。尝试了多种方法仍未解决, 只得痛定思痛将系统降级为Mojave。由于没有该版本的备份, 只得进行重装, 根据官网提供的教程[^install], 下载Mojave的安装程序后拷贝到一个存储不小于16GB的U盘或移动硬盘, 然后将其烧制为启动设备, 并选择系统从该盘启动即可完成安装。

</div>

[^touch]: [用了那么久 Mac，才知道触控板原来还有这些功能](https://zhuanlan.zhihu.com/p/35907832)
[^1]: [Mac下使用国内镜像安装Homebrew](https://www.jianshu.com/p/6523d3eee50d)
[^2]: [macOS安装homebrew的方法解析和无vpn下成功安装](https://segmentfault.com/a/1190000016114955)
[^bottles]: [Homebrew-bottles 镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew-bottles/)
[^ltex]: [在 VS Code 中用 LaTeX 时，如何用上拼写检查和语法纠错？](https://zhuanlan.zhihu.com/p/92670838)
[^bug]: [Bluetooth audio problems Catalina](http://discussions.apple.com/thread/250793838)
[^install]: [如何创建可引导的 macOS 安装器](https://support.apple.com/zh-cn/HT201372)