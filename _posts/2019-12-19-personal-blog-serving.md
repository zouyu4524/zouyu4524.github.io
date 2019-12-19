---
layout: article
title: "个人博客全面迁移"
key: personal-blog-serving
author: Yuze Zou
show_author_profile: true
clipboard: true
tags: ["云服务", "Cloudflare"]
---

将个人博客完全托管于七牛云。<!--more-->

<div style="margin: auto 0;" align="justify" markdown="1">

## 前言

由于国内网络环境的因素, 托管于GitHub的个人博客访问时延很高, 甚至在某些ISP网络下无法访问。加上Cloudflare的免费CDN服务后, 也并没有明显改善。为了改善这一情况, 考虑将个人博客迁移至国内CDN服务提供商下。

## 方案

[此前](/blog/img-hosting-for-blog)已将图床方案迁移至七牛云。考虑到七牛云提供的服务相对全面且价格便宜, 所以决定将博客整体迁移至七牛云。


## 迁移成本

此前网站的搭建方式是: **Cloudflare + GitHub**。GitHub负责编译并托管网站内容, Cloudflare解析域名, 并用到了Page Rules重定向以及返回顶部按钮插件。目前的搭建方式是: **阿里云 + 七牛云**。网站内容本地编译好以后同步至七牛云对象存储, 阿里云负责DNS解析。针对不同子域名分别采用了阿里云和七牛云的免费SSL证书。

### 网站上传

此前方案写好博客文章后, 在本地调试无误后直接push至GitHub repo即可自动部署更新; 目前的方案需要在本地编译后, 将`_site`文件夹下的内容上传至七牛云对象存储。在Win下, 通过七牛云提供的上传工具[^qsunsync], 这个过程也还比较方便。具体的用法如下:  

<div class="grid-container">
<div class="grid grid--px-2">
  <div class="cell cell--5" style="margin: 0 auto;"><img src="https://img.be-my-only.xyz/personal-blog-serving-01.png" alt="indi" class="shadow" /></div>
  <div class="cell cell--5" style="margin: 0 auto;"><img src="https://img.be-my-only.xyz/personal-blog-serving-02.png" alt="grp" class="shadow"/></div>
</div>
</div>

注意勾选图中红框标注的三个选项, 勾选这三项的功能在于增量式更新, 并智能覆盖同名文件。
{: .warning}

此外, 新方案属于本地编译, 方式如下[^publish]:  

```ruby
JEKYLL_ENV=production bundle exec jekyll build
```
{: .snippet}

否则将失去评论功能。
{: .error}

### Jekyll permalink设置

我的网站是通过Jekyll编译的, 此前使用TeXt主题时没有留意permalink的设置, 采用了默认的设置方式, 即: `/:title`, 在该设置下, 编译将根据`.md`文件名生成相应的网址链接, 例如:  

```
2019-10-01-national-holiday.md  // 源文件
/national-holiday.html          // 编译产生的文件
/national-holiday               // 链接
```

以上`.md`文件的`title`值即: `national-holiday`, 那么编译将生成相应title且以`.html`结尾的文件, 但是对应的链接地址是`/national-holiday`。这在托管于GitHub上的网站没有问题, 因为GitHub会自动将链接`/national-holiday`对应到`/national-holiday.html`, 在浏览器中输入这两个地址均可以访问到相同的内容, 但是在七牛云上这里存在问题。七牛云更多视为文件服务器, 而非网站服务器, 因此七牛云只会根据链接提取文件传输给终端用户, 因此以上述方式编译产生的链接和文件并不对应相同的资源, 导致访问`/national-holiday`地址时提示无法找到文件, 只能通过`/national-holiday.html`才能获取预期内容。这样一来一旦完全将网站内容迁移至七牛云, 将导致大量的死链。好在通过两个功能可以比较好地解决这个问题: 1) permalink 多加一个`/`, 2) 七牛云对象存储的默认首页设置。具体如下:  

以上说到将permalink设置为`/:title`, 而如果将permalink设置为`/:title/`, 编译产生的文件结构将有所不同:  

```
2019-10-01-national-holiday.md  // 源文件
/national-holiday/index.html    // 编译产生的文件
/national-holiday/              // 链接
```
注意其中的区别, 编译的文件将产生名称为`national-holiday`的文件夹, 并在其下产生名为`index.html`的文件[^index], 实际上该文件内容与上述方法产生的`national-holiday.html`一致。此外, 链接也多了一个`/`。另一方面, 七牛云为对象存储提供了默认首页设置功能（位于: 对象存储<kbd>→</kbd>空间设置）。该功能描述如下:  

> 开启功能后，空间根目录中的 index.html（或 index.htm）文件将会作为默认首页进行展示。

这两个功能正好对上了, 并且能够保证上一种方法下的链接有效, 从而保障网站的平滑迁移。

### HTTPS

七牛云提供每月10GB免费的HTTP流量, 但HTTPS收费, 好在费用很低。为了启用HTTPS, 需要首先申请SSL证书, 七牛云提供免费SSL证书服务, 也支持导入自有证书, 可以从阿里云免费申请。有了SSL证书后, 在相应DNS服务商添加`TXT`记录即可。

### 遗留问题

此前, 创建的域名为`blog.be-my-only.xyz`, 而后换为了`be-my-only.xyz/blog`, 为了已存在的搜索引擎中的记录不失效, 需要用到301重定向, Cloudflare免费提供三条Page Rules实现这一功能, 具体在[这篇博客](/blog/personal-website-with-custom-domain/#section-4)中有介绍。但是七牛云不提供这一功能, 而阿里云也需要购买弹性Web托管服务才可设置, 不划算。考虑到博客访问量很低, 以前的链接也基本不会出现在搜索结果中, 在此就放弃这一功能了。另外, 七牛云对象存储支持绑定多个域名, 可以分别将`blog.be-my-only.xyz`以及`be-my-only.xyz`绑定到同一对象存储上, 就能实现类似301的效果。采用新方案的另一损失是没有了Cloudflare的实用Apps功能了, 返回顶部的按钮没有了。这个以后考虑将该功能内建至博客主题中。

### 缓存刷新

考虑到网站内容可能的更新, 有必要设定缓存刷新规则以保障用户能访问到最新的内容。七牛云可以手动刷新文件或者目录, 又或者设定缓存规则, 进行文件扩展名匹配, 具体的设置方法在此不赘述。


## 七牛云 vs Cloudflare

|         | 七牛云 | Cloudflare |
|:---:    | :---  | :--- |
| 常用服务 | 对象存储、融合CDN、SSL证书服务 | DNS、CDN、DDoS防御、Page Rules、Apps |
| 优势    | 国内CDN加速快 | 功能全面 |
| 劣势    | HTTPS收费    | 国内速度不佳 |

简而言之, 如果网站的主要受众是国外用户, 那么Cloudflare是不二之选, 但是如果主要面向国内, 那么七牛云是个不错的选择。Cloudflare提供免费的HTTPS服务, CDN加速, 以及若干实用网页小程序, 如返回顶部按钮。但是使用其服务的前提是将域名的DNS解析托管于Cloudflare。
{: .success}

## 新的博客发布流程

1. 写markdown文档, 开启本地编译实时查看效果: `bundle exec jekyll serve -I`; 
2. 确定文档后, 执行本地发布编译: `JEKYLL_ENV=production bundle exec jekyll build`; 
3. 同步`_site`文件夹到七牛云; 
4. 刷新七牛云缓存。

## GitHub

迁移至七牛云后, GitHub端repo仍可保留, 以保存网站更新记录, 并且作为网站的一个备份。删除repo中的CNAME文件以及DNS服务器中指向GitHub IP的A记录以消除repo到域名的重定向。

</div>

[^qsunsync]: [同步上传Windows客户端(QsunSync)](https://developer.qiniu.com/kodo/tools/1666/qsunsync)
[^index]: [Controlling URLs and Links in Jekyll](https://www.digitalocean.com/community/tutorials/controlling-urls-and-links-in-jekyll)
[^publish]: [Build and Publish - TeXt](https://tianqi.name/jekyll-TeXt-theme/docs/en/quick-start#build-and-publish)