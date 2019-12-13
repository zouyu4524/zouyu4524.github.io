---
layout: article
title: "个人博客图床方案"
key: img-hosting-for-blog
author: Yuze Zou
show_author_profile: true
clipboard: true
tags: ["图床"]
---

每月不超过10元、国内外均可访问、HTTPS、自定义域名的图床方案。
<!--more-->

<div style="margin: auto 0;" align="justify" markdown="1">

## 七牛云

七牛云是一家云服务公司, 为个人用户提供了不错的免费图床服务: **10GB 存储**以及**每月10GB HTTP流量**。在七牛云上搭建图床需要用到其提供的两类服务: **对象存储**与**融合CDN**。其中对象存储服务用于存储图片, 而融合CDN负责缓存策略与域名链接。整个流程为: 1) 在对象存储服务下新建存储空间(即bucket); 2) 上传图片至该存储空间; 3) 配置融合CDN, 将个人域名链接至对象存储[^cname]。

### 依赖项

- [X] 已备案域名
- [X] SSL证书 (非必须)

七牛云为新建账号提供一个月的试用域名, 到期后会回收域名, 届时相应图片链接将失效。为了保持博客图片的长期有效访问, 一个已备案的域名还是必不可少。
{: .warning}

### HTTPS

七牛云提供的免费流量仅限HTTP, 其HTTPS流量需要收费, 好在费用不算贵, 10GB 国内流量大概3元[^price]。为了启用资源的HTTPS访问, 可以通过七牛云提供的SSL证书或者已有的证书(pem格式, 例如从阿里云“白嫖”的证书)。详细的配置过程七牛云的文档介绍比较清晰, 在此不再赘述。七牛云目前提供的免费证书是TrustAsia的, 单个证书绑定单个域名, 有效期为一年。而阿里云提供的免费证书是Symantec的, 同样是一年有效期。注意七牛云上注明了限时免费, 到期后不确定是否还需要收费。阿里云的证书目前看来是可以不断申请一年期的免费证书。

### 上传工具

以博客写作的场景来看, 直接在官网控制台页面下上传图片已经足够方便了。  
其他的插件[^extension]或者程序[^program]也许会方便一点, 但优势有限。

## 其他方案

除了七牛云以外, 还有其他若干图床方案, 如: GitHub's CDN[^github], [Cloudinary](https://cloudinary.com/), [微博图床](https://chrome.google.com/webstore/detail/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%9B%BE%E5%BA%8A/fdfdnfpdplfbbnemmmoklbfjbhecpnhf)。其中就访问可达而言, GitHub CDN存在国内某些ISP无法访问的情况(主站可以访问, 但存储的图片存在被墙的情况), Cloudinary是国外云服务厂商, 据说国内外访问速度都还OK[^cloudinary]; 微博图床存在国外网络无法访问或丢图的情况。就管理而言, GitHub CDN与微博图床都是一键式上传生成链接, 没有图库, 不便于管理。Cloudinary和七牛云有存储空间, 方便管理图片。此外, cloudinary的免费版无法设置自定义的域名[^custom-domain]。

</div>

[^price]: [七牛云-定价](https://www.qiniu.com/prices?source=fusion)
[^cloudinary]: [个人网站中的静态文件云存储选择](https://jimmysong.io/posts/static-website-storage/)
[^custom-domain]: [Can we have our own CNAME to our own domain? Like cdn.example.com?](https://support.cloudinary.com/hc/en-us/articles/202520562-Can-we-have-our-own-CNAME-to-our-own-domain-Like-cdn-example-com-)
[^cname]: [如何配置域名的 CNAME](https://developer.qiniu.com/fusion/kb/1322/how-to-configure-cname-domain-name)
[^extension]: [七牛云图床](https://chrome.google.com/webstore/detail/%E4%B8%83%E7%89%9B%E4%BA%91%E5%9B%BE%E5%BA%8A/fmpbbmjlniogoldpglopponaibclkjdg)
[^program]: [qshell](https://github.com/qiniu/qshell)
[^github]: [Upload Images to GitHub's CDN](https://gist.github.com/vinkla/dca76249ba6b73c5dd66a4e986df4c8d)