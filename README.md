# Personal HomePage

邹雨泽的个人主页。主题来自于[TeXt](https://github.com/kitian616/jekyll-TeXt-theme)。

<details>
<summary>点击打开目录</summary>
<!-- MarkdownTOC autolink="true" -->

- [快速开始](#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)
	- [进阶\(本地编译，预览\)](#%E8%BF%9B%E9%98%B6%E6%9C%AC%E5%9C%B0%E7%BC%96%E8%AF%91%EF%BC%8C%E9%A2%84%E8%A7%88)
		- [依赖项](#%E4%BE%9D%E8%B5%96%E9%A1%B9)
		- [配置方式](#%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F)
- [评论设置](#%E8%AF%84%E8%AE%BA%E8%AE%BE%E7%BD%AE)
- [ChangeLog](#changelog)

<!-- /MarkdownTOC -->
</details>

## 快速开始

- clone本repo, 

```
git clone https://github.com/zouyu4524/zouyu4524.github.io.git
```

- 删除`_posts`目录下的所有内容, 新增内容添加其中即可。

- 修改`_config.yml`配置个人信息

**更多详细设置可以参阅原Po的[文档](https://tianqi.name/jekyll-TeXt-theme/docs/zh/configuration)**。

### 进阶(本地编译，预览)

#### 依赖项

- Ruby & Jekyll

安装方式参考: [Installation](https://jekyllrb.com/docs/installation/)

#### 配置方式 

- 以上安装完毕后, 进入已clone的项目目录下

```
cd zouyu4524.github.io
```

- 初始化项目

```
bundle install --path vendor/bundle
```
**说明:** `bundle`是用于管理Ruby依赖项的工具, 相当于`gradle`之于安卓。将会根据项目中的`Gemfile`逐一安装项目所需的依赖项。而`--path vendor/bundle`则是指定相应依赖项所存放的目录。

- 编译, 启动预览

以上执行完毕后将配置好相应的依赖项, 此后只需执行

```
bundle exec jekyll serve
```

即可本地编译, 启动预览。

- 预览

在浏览器中输入`localhost:4000`即可预览。

## 评论设置

首先需要在`_config.yml`文件中配置`comments`下的`provider`, 以`gitalk`为例。接下来需要相应配置`gitalk`的各个参数, 注释中有详述。其原理为, 评论内容自动连接到Github指定仓库, 并在该仓库创建Issue。从而将评论内容填入其中。为了实现这个功能, 还需要创建一个GitHub的OAuth application, 创建[链接](https://github.com/settings/applications/new)。其中名称可以填写为主页repo, URL和callback URL一致, 均为`https://USERNAME.github.io`（或自定义的域名）。创建后就可以得到相应的Client ID以及Client Secret。

此外, 需要开启评论功能的文章需要为其设置唯一的`key`属性, 为字符串, 以字母开头（**不需要引号**）, Gitalk将会以此`key`在相应的评论所创建的issue上打上标签。

*本地通过Jekyll编译时无法看到评论功能。*

**注意**: 相应主页的repo需要开启ISSUE功能, 否则无法开启评论。

## ChangeLog

| 日期	| 修改说明 |
|:---:	|:---	  |
| 2019/10/12 | 更改网站URL为: be-my-only.xyz/blog/, credit to [@Zerone](https://github.com/ZeroneCat) |
| 2019/10/12 | 新增blog, 实现*双播放器*功能 |
| 2019/10/03 | 增加一键代码复制功能, 新增blog记录PR |
| 2019/10/01 | 新增blog, TikZ简介 |
| 2019/09/30 | 新增blog, 高斯正十七边形 |
| 2019/09/30 | 新增旧blog, MATLAB OOP 读书笔记 |
| 2019/09/28 | 新增blog, Pop-Art 算法复现 |
| 2019/09/24 | 新增blog, PyTorch backward与in-place赋值小记 |
| 2019/09/19 | 新增blog, PyTorch基础教程 |
| 2019/09/18 | 新增blog, 矩阵梯度推导 \| 修改Mathjax的自动编号为`True` |
| 2019/09/12 | 新增blog, 翻译论文 |
| 2019/09/04 | 新增blog, 介绍Python中调用MATLAB的方法 |
| 2019/08/28 | 增加 `jekyll-seo-tag` |
| 2019/08/18 | 更改logo, 新增以前的博客内容 |
| 2019/08/17 | 启用评论功能(gitalk), 新增一篇以前的博客, 更新About |
| 2019/08/15 | 第一篇blog, 测试Mathjax和代码高亮	|
| 2019/08/14 | Fork TeXt, 搭建框架 |
