---
layout: article
key: backend-whitelist
title: "后台访问白名单"
author: Yuze Zou
show_author_profile: true
mathjax: true
mermaid: true
tags: ["建站"]
---

Leancloud与百度统计添加白名单以保证后台统计数据的可靠性。<!--more-->

<div style="margin:  0 auto;" align="justify" markdown="1">

## 前言

我的个人网站并未搭建后端服务器, 而是托管于公开的GitHub Pages, 同时备份于七牛云以改善国内的访问速度。其中访问统计、页面访问次数功能分别借由百度统计和LeanCloud完成, 相应的统计JS代码以及访问的API均暴露于GitHub repo中, 如果其他用户fork了相应的repo而未替换对应的统计代码, 那么其访问统计将会归并至我的统计结果中。好在百度统计与LeanCloud均提供了白名单过滤功能, 可以仅统计或准许白名单中的域名访问。

## 白名单

### LeanCloud

<div style="margin: 0 auto;" align="center" markdown="1">
<img src="https://img.be-my-only.xyz/backend-whitelist-01.png" width="90%" alt="leancloud-whitelist" class="shadow rounded">
</div>

如图, 在LeanCloud的后台界面中依次选择: 设置<kbd>→</kbd>安全中心<kbd>→</kbd>Web安全域名, 填入白名单域名并点击保存即可。

需要注意的是, 填入的域名包括: 协议(一般是http, 或https)、域名和端口(https对应443)。
{: .warning}

### 百度统计

<div style="margin: 0 auto;" align="center" markdown="1">
<img src="https://img.be-my-only.xyz/backend-whitelist-02.png" width="90%" alt="leancloud-whitelist" class="shadow rounded">
</div>

类似的, 百度统计也可以如图添加白名单, 在后台界面依次选择: 管理<kbd>→</kbd>过滤规则设置<kbd>→</kbd>受访域名统计规则下的白名单<kbd>→</kbd>点击按钮开启<kbd>→</kbd>添加相应的域名即可。

</div>