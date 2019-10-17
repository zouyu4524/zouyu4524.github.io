---
layout: article
title: "个人网站建站相关总结"
key: personal-site
author: Yuze Zou
show_author_profile: true
clipboard: true
mathjax: false
tags: ["GitHub", "Cloudflare"]
---

几乎免费的建站方案。

<!--more-->

<div style="margin: 0 auto;" align="justify" markdown="1">

## 建站需求

个人网站一般是轻量级的静态展示站点, 用于发布博客文章、心得体会、学习笔记、生活动态等, 鲜少用于提供后台服务, 因此也就没有必要购置云服务器, 如阿里云的ECS或亚马逊的AWS。GitHub提供了一个很好的“白嫖”机会: **GitHub Pages**。在GitHub账户下创建名为`USERNAME.github.io`的repo, 选择适合自己口味的主题即可快速搭建个人网站的框架。这里强烈推荐: [TeXt](https://github.com/kitian616/jekyll-TeXt-theme)主题。GitHub Pages提供了个人站点的服务器, 只需要专心地简单地通过Markdown语法编写内容并commit到repo即可, GitHub会为你自动更新你的站点内容。如果你并不需要个性域名, 那么到这里就可以了, 你将拥有如下的个人站点的网址, 其中`USERNAME`是你的GitHub账户ID。  

https://USERNAME.github.io
{: .warning}

**如果你还想拥有自己的个性域名, 那么可以参考下面的内容。**

## 建站方案

目前, GitHub Pages已经可以免费地提供对个性域名的强制HTTPS服务, 使你的个人站点即便在个性域名下也一样拥有HTTPS加持而无需另外配置或购买HTTPS证书[^3]。

为了“白嫖”这个功能, 本文介绍的建站方案如下:

[GitHub Pages](https://pages.github.com/) <i class="fas fa-plus"></i> [Cloudflare](https://www.cloudflare.com/) <i class="fas fa-plus"></i> **个性域名**[^1]<sup>, </sup>[^2] \| [Google search console](https://search.google.com/search-console/about) <i class="fab fa-google"></i>
{: .success}

这里首先简要介绍这几个模块各自的功能: 

| 模块 | 功能 |
|:---: |:--- |
| 个性域名 | “门面担当”: 站点URL |
| GitHub Pages | “扛把子”: 站点服务器, 站点内容托管于此 |
| Cloudflare | “润滑剂”: CDN加速, 域名解析, 页面跳转, 若干实用App |
| <i class="fab fa-google"></i> | “扩音器”: 增强站点的可见性 |

*其中Cloudflare并非必须, 但它的功能如表并且免费方案就够用, 建议加上。*详细的内容将在[Cloudflare](#cloudflare)节介绍。

要使托管于GitHub Pages的站点支持个性域名, 需要进行两步操作: **添加CNAME**与**设置DNS解析**, 分别在GitHub端和域名解析端(如Cloudflare)完成。这个过程是这样的:  

用户在浏览器中输入你的**个性域名** <i class="fas fa-long-arrow-alt-right"></i> **DNS解析商**: 找GitHub去 <i class="fas fa-long-arrow-alt-right"></i> **GitHub**: 你来啦？我找找`<CNAME, repo>` <i class="fas fa-long-arrow-alt-right"></i> 走你！
{: .success}

**也就是说**: 在GitHub repo中添加CNAME, 告知了GitHub你的个性域名和当前repo绑定; 而DNS解析商只需要将你的个性域名解析到GitHub即可[^5]。(具体设定在[Cloudflare](#cloudflare)节中介绍)

### 个性域名

可以在[万网](https://wanwang.aliyun.com/)或[GoDaddy](https://godaddy.com)注册, 分别是国内、外的域名服务商。在万网下注册的域名最好进行[备案](https://beian.aliyun.com/)。  
**本方案中唯一需要的花销就在购买域名了。**

### Cloudflare

Cloudflare可以为你的网站提供CDN加速、域名解析、页面跳转以及若干实用的App, 例如: [回到顶部](https://dash.cloudflare.com/apps/back-to-top-button)。上面提到的两个步骤之一是到域名服务商设置, 在此以Cloudflare添加根域名(apex domain)为例[^6], 在DNS功能区下添加`A`类型的解析条目, 将个性域名链接到GitHub提供的IP地址(如图所示)即可:  

<div style="margin: 0 auto; width: 80%" align="center" markdown="1">
![DNS](https://user-images.githubusercontent.com/16682999/66928778-84fbc880-f064-11e9-92ae-3908db48f44b.png){: .shadow.rounded}<em>**在Cloudflare中添加域名解析条目, 将个性域名链接到GitHub的IP地址**</em>
</div>

如此, 域名服务商这边的任务就完成了, 接下来是GitHub Pages端的操作。

### GitHub Pages

为了支持个性域名, 可以在repo的Setting下的GitHub Pages/Custom domain中输入个性域名, 如图:  

<div style="margin: 0 auto; width: 80%" align="center" markdown="1">
![CNAME](https://user-images.githubusercontent.com/16682999/66927499-7d3b2480-f062-11e9-91f1-8373b46dfa16.png){: .shadow.rounded}<em>**GitHub Pages设定CNAME实现绑定个性域名**</em>
</div>

在此设定后, repo中将会出现名为`CNAME`文件, 内容即对应的个性域名; 如此, 桥梁便搭起来了。此外, 还可以勾选图中的*Enfore HTTPS*以强制站点使用HTTPS协议提高安全性, 勾选后一般需要若干小时实际生效。此后, 对个性域名的访问将都建立在HTTPS协议之上。

如何在GitHub Pages搭建个人站点不是本文重点, 你可以在[这里](https://pages.github.com/)或者[这里](https://guides.github.com/features/pages/)找到更多详尽的介绍方法。  
**强烈推荐[TeXt](https://github.com/kitian616/jekyll-TeXt-theme)主题, 风格贴近iOS风格并且有详尽的文档说明, 对新手相当友好。**
{: .error}

### Google search console

为了增加个人站点的曝光度, 可以通过google search console主动添加网站的站点地图(sitemap), 一般是`.xml`文件。首先如图所示在google search console下添加你的站点网址, 可以添加全域或一个子域名。

<div style="margin: 0 auto; width: 80%" align="center" markdown="1">
![google search console](https://user-images.githubusercontent.com/16682999/66915066-b7003100-f04a-11e9-8f70-b1aec63e2492.png){: .shadow.rounded}<em>**Google Search Console添加个性网址**</em>
</div>

然后, 点击“站点地图”后输入站点地图的链接(一般是根网址/sitemap.xml)添加即可。

<div style="margin: 0 auto; width: 80%" align="center" markdown="1">
![sitemap](https://user-images.githubusercontent.com/16682999/66915436-94bae300-f04b-11e9-8b06-dd3e9e526a04.png){: .shadow.rounded}<em>**Google Search Console添加站点地图**</em>
</div>

[TeXt](https://github.com/kitian616/jekyll-TeXt-theme)主题已包含`jekyll-sitemap`插件[^4], GitHub Pages将会在每次commit后为站点自动生成相应的`sitemap.xml`文件。其他Jekyll主题也可以根据该插件的[说明](https://github.com/jekyll/jekyll-sitemap#usage)相应配置即可。

**补充**: 对于其他的搜索引擎(百度、Bing等)也可以类似设置。Bing支持直接从已配置好的google search console导入。
{: .warning}

## 额外选项

### 链接重定向

Cloudflare除了提供DNS解析外, 还提供Page Rule功能, 该功能可以用于实现链接的跳转。使用场景如下(踩坑历史): 你先将你的个人站点链接到了个性域名的三级域名下, 例如: **blog.example.com**, 并且在搜索引擎中已经留下了若干记录或者在其他地方留下了对该域名下的网址的链接; 但某一天你觉得这个域名结构不太好, 你想把它换成这样: **example.com/blog/**; 如果直接换了而不做其他的处理, 那么以前的链接也就变成了死链。这时候就可以用到Page Rule功能用于实现链接的重定向。免费的Cloudflare计划提供3条重定向规则制定, 由于该规则支持通配符匹配[^7], 对于个人站点一般是够用的。例如, 我的站点在修改结构前如下:

```
https://blog.be-my-only.xyz/yyyy/mm/dd/article-title.html
```
而修改后相应的链接变为了:  
```
https://be-my-only.xyz/blog/article-title.html
```
我去除了链接中的日期, 并且将原本的三级域名`blog`挪到了根域名下的`blog`目录了, 那么在Page Rule通过一条指令即可实现, 如图:  

<div style="margin: 0 auto; width: 80%" align="center" markdown="1">
![page rule](https://user-images.githubusercontent.com/16682999/66931921-6815c400-f069-11e9-8d52-38b15eceed2f.png){: .shadow.rounded}<em>**Cloudflare Page Rule实现链接301重定向**</em>
</div>

其中`*`是通配符, 而`$3`表示第三个通配符匹配的内容。在源链接中使用了三个通配符, 第一个用于匹配HTTP或HTTPS, 第二个用于匹配源链接中的日期部分, 第三个是源链接中的网页名称。在目的链接中我强制了HTTPS协议并且地址中现在只保留了第三部分, 因此如上所写。确认以后点击保存并部署稍等几分钟Page Rule就会生效, 如此便可以保留已有的搜索引擎结果和别处的链接而仍然将用户引导到修改后的网址了。

### 小工具

Cloudflare还提供了若干常用的小工具, 这类工具的特点在于与站点后端完全独立, 你可以在Cloudflare的后台调整、预览小工具部署到你的站点后的效果, 部署后用户在访问你的站点时便可以利用上这些小工具。

[^1]: [万网](https://wanwang.aliyun.com/)
[^2]: [GoDaddy](https://godaddy.com)
[^3]: [Custom domains on GitHub Pages gain support for HTTPS](https://github.blog/2018-05-01-github-pages-custom-domains-https/)
[^4]: [jekyll/jekyll-sitemap](https://github.com/jekyll/jekyll-sitemap)
[^5]: [Securing your GitHub Pages site with HTTPS](https://help.github.com/en/articles/securing-your-github-pages-site-with-https)
[^6]: [Configuring an apex domain](https://help.github.com/en/articles/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)
[^7]: [Configuring URL forwarding or redirects with Cloudflare Page Rules](https://support.cloudflare.com/hc/en-us/articles/200172286-Configuring-URL-forwarding-or-redirects-with-Cloudflare-Page-Rules)

</div>