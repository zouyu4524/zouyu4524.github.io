---
layout: article
title: "远程连接实验室服务器"
key: remote-connect-server
author: Yuze Zou
show_author_profile: true
clipboard: false
modify_date: 2019-11-18
tags: ["Linux"]
---

乞丐版远程服务器跳板。 <!--more-->

<div style="margin: 0 auto;" align="justify" markdown="1">

## 前言

结束了访学回到实验室, 目前自带电脑搬砖, 捡了一个旧电脑装着CentOS, 在学妹的帮助下有了实验室服务器的账户。日常在实验室的工作逐渐走上了正轨, 但偶尔需要在家远程访问实验室服务器上程序的运行结果, 正是本文所记录的内容。

## 适用情况

- [x] 服务器只在“局域网”范围内可访问
- [x] 服务器无法安装远程桌面

## 解决方案

尝试了通过学校VPN再ssh到实验室服务器, 仍然无法连接, 应该是由于服务器的访问限制(VPN后的IP与服务器的IP不在一个网段)。为此, 考虑通过Teamviewer连接到实验室的旧电脑, 再通过旧电脑连接到服务器。在这个方案下, 涉及几个问题: 

1. 旧电脑并没有持续稳定的网络连接, 上网需要通过校园网客户端认证; 
2. 旧电脑没有独立的显示器, 暂时与我的笔记本共用显示器。

为此, 我需要定时启动校园网客户端以保障网络连接, 这个可以通过`crontab`[^3]实现; 而显示器的问题在于, 如果不接, 那么Teamviewer采不到数据无法实用[^1]<sup>, </sup>[^2]。目前的解决方案是手动在下班后将显示器接回旧电脑。参考链接[^1]<sup>, </sup>[^2]中提到的“虚拟显示器”设备已到, 效果不错。

<div style="margin: 0 auto;" align="center" markdown="1">
<img src="http://img.be-my-only.xyz/remote-connect-server.png" class="shadow rounded" width="200px"><em>虚拟显示器</em>
</div>

## 杂项

校园网客户端需要root权限执行, 若要通过`crontab`自动执行需要为用户提供特定程序免密root的功能, 在`/etc/sudoers`文件中添加如下指令[^4]:

```bash
your-name ALL=(ALL) NOPASSWD: /bin/kill
```

以上是为用户`your-name`赋予了免密root执行`/bin/kill`命令。

</div>

[^1]: [TeamViewer连接远程无显示器电脑，显示黑屏](https://bbs.et8.net/bbs/showthread.php?t=1356746)
[^2]: [TEAMVIEWER 远程控制，对方电脑没有接显示器，无法正常显示，屏幕小等问题解决方案](https://www.remoteaps.com/blog/602)
[^3]: [crontab every 5 minutes](https://crontab.guru/every-5-minutes)
[^4]: [How to Run ‘sudo’ Command Without Entering a Password in Linux](https://www.tecmint.com/run-sudo-command-without-password-linux/)