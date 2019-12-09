---
layout: article
title: "家庭路由器无线桥接"
key: AP-WDS-bridging
author: Yuze Zou
show_author_profile: true
clipboard: false
aside:
  toc: false
tags: ["居家"]
---

终于解决了家里无线网络的切换问题。<!--more-->

<div style="margin: 0 auto;" align="justify" markdown="1">

为了解决家里无线网络的覆盖问题, 购置了新款的路由器, 但单路由器仍然不能保证全覆盖, 还是存在不少信号死角。两个路由器同时启用后, 在设备移动时, 又需要手动进行切换, 难免有些不方便。此时就可以利用上路由器的**无线桥接**(WDS bridging)功能: 副路由器桥接到主路由器, 由副路由器覆盖信号死角从而实现信号全覆盖的情况下网络自动切换。其拓扑关系如下:  

<div align="center">
<img src="http://img.be-my-only.xyz/AP-WDS-bridging.png" alt="topo" width="500px" class="shadow rounded">
</div>

**设备包括**:  
- TL-WDR7300: 主路由
- TL-WR847N V2: 副路由

其中副路由是一款很老的路由器了, 但支持WDS功能, 够用。设置部分参考TP-Link官网的设置手册[^manual], 步骤清晰详尽。主要的设置在副路由器, 主路由器只需要确定**设置信道号**即可, 默认一般是自动选择信道号(由于副路由只支持2.4GHz频段, 所以只需要设置主路由器对应2.4GHz的信道号)。而副路由的设置包括:  

- 修改网关地址到与主路由在一个网段
- 扫描并连接到主路由器
- 修改SSID(以及密码)与主路由一致, 开启WDS功能
- 关闭副路由DHCP

TP-Link的文档写得很详细, 很赞！较新的路由器更是集成了一键桥接工具, 操作更为便捷。

</div>

[^manual]: [[TL-WR847N V1 ~V3] 无线桥接（WDS）如何设置？](https://service.tp-link.com.cn/detail_article_698.html)