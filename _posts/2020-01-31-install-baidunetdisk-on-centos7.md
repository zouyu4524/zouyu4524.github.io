---
layout: article
title: "CentOS 7安装百度网盘"
key: install-baidunetdisk-on-centos7
author: Yuze Zou
show_author_profile: true
clipboard: true
tags: ["Linux", "Javascript"]
---

CentOS 7的默认gcc版本为`4.8`, 导致百度网盘客户端安装后无法正常启动。本文记录解决此问题的过程。<!--more-->

<div style="margin: 0 auto;" align="justify" markdown="1">

## 前言

百度网盘19年推出了Linux版本, 是基于electron框架开发的[^electron]。有了客户端, 通过实验室跳板机（CentOS 7）闲时下载的视频就可以方便地通过客户端秒传功能上传到百度云账号了。

## 安装

- [官网](https://pan.baidu.com/download)下载安装包, 选择rpm包

- 本地安装rpm包

```bash
sudo yum localinstall baidunetdisk_linux_3.0.1.2.rpm
```

CentOS 7系统下, 安装后并不能正常启动, 需要解决下面的两个问题。
{: .error}


## 问题与解决方案

### 缺少`libXss.so.1`

```bash
error while loading shared libraries: libXss.so.1: cannot open shared object file: No such file or directory
```

- **解决方案**: 安装`libXScrnSaver`

```bash
sudo yum install libXScrnSaver
```
{: .snippet}

### `CXXABI_1.3.8` not found

```bash
[yuze@centos-virt baidunetdisk]$ ./baidunetdisk 
A JavaScript error occurred in the main process
Uncaught Exception:
Error: Dynamic Linking Error: /lib64/libstdc++.so.6: version `CXXABI_1.3.8' not found (required by /opt/baidunetdisk/./libkernel.so)
    at new DynamicLibrary (/opt/baidunetdisk/resources/app.asar/node_modules/ffi/lib/dynamic_library.js:74:11)
    at new Library (/opt/baidunetdisk/resources/app.asar/node_modules/ffi/lib/library.js:45:12)
    at Object.<anonymous> (/opt/baidunetdisk/resources/app.asar/dist/electron/main.js:1:4706)
    at r (/opt/baidunetdisk/resources/app.asar/dist/electron/main.js:1:270)
    at Module.<anonymous> (/opt/baidunetdisk/resources/app.asar/dist/electron/main.js:1:565278)
    at r (/opt/baidunetdisk/resources/app.asar/dist/electron/main.js:1:270)
    at /opt/baidunetdisk/resources/app.asar/dist/electron/main.js:1:1078
    at Object.<anonymous> (/opt/baidunetdisk/resources/app.asar/dist/electron/main.js:1:1089)
    at Object.<anonymous> (/opt/baidunetdisk/resources/app.asar/dist/electron/main.js:2:3)
    at Module._compile (internal/modules/cjs/loader.js:693:30)
```

原因在于CentOS 7默认的gcc版本为`4.8`, 对应的`CXXABI`最高支持版本只到`CXXABI_1.3.7`[^ABI]。
{: .warning}

- **解决方案**: 软链`libstdc++.so.6`到`libstdc++.so.6.0.20`

网上查询一番未找到现成的`libstdc++.so.6.0.20`文件, 升级gcc到`4.9`也并未生成该文件, 只得从源码自行编译gcc `4.9`。编译方法如下[^gcc]:  

```bash
sudo yum install libmpc-devel mpfr-devel gmp-devel

cd ~/Downloads
curl ftp://ftp.mirrorservice.org/sites/sourceware.org/pub/gcc/releases/gcc-4.9.2/gcc-4.9.2.tar.bz2 -O
tar xvfj gcc-4.9.2.tar.bz2

cd gcc-4.9.2
./configure --disable-multilib --enable-languages=c,c++
make -j 4
make install
```
{: .snippet}

其中`make -j 4`将花费较长时间, 一般是1\~2小时。编译后, 即可生成`libstdc++.so.6.0.20`文件, 将其拷贝至`/usr/lib64/`目录下, 并修改软链接如下:  

```bash
ln -snf libstdc++.so.6.0.20 libstdc++.so.6
```
{: .snippet}

为省去编译等待时长, 将已编译的文件备份以便他人使用。[libstdc++.so.6.0.20](https://pan.baidu.com/s/1w7DCs7_yc0PVJJwtWHhuMA), 提取码: px3p
{: .success}

## 技术栈

> 技术栈采用electron, 页面上是VUE全家桶, 底层逻辑就是nodejs/c++混编。electron把nodejs和chromium集成在了一起, 可以在WEB页面直接调用nodejs API来与系统交互[^electron]。


</div>

[^electron]: [如何看待百度网盘新推出的Linux版？ - 张逸影的回答 - 知乎](https://www.zhihu.com/question/329464257/answer/717325698)
[^gcc]: [Build GCC 4.9.2 for C/C++ on CentOS 7](https://gist.github.com/craigminihan/b23c06afd9073ec32e0c)
[^ABI]: [ABI Policy and Guidelines](https://gcc.gnu.org/onlinedocs/libstdc++/manual/abi.html)