# Personal HomePage

邹雨泽的个人主页。主题来自于[TeXt](https://github.com/kitian616/jekyll-TeXt-theme)。

<details>
<summary>点击打开目录</summary>
<!-- MarkdownTOC autolink="true" -->

- [快速开始](#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)
	- [进阶\(本地编译，预览\)](#%E8%BF%9B%E9%98%B6%E6%9C%AC%E5%9C%B0%E7%BC%96%E8%AF%91%EF%BC%8C%E9%A2%84%E8%A7%88)
		- [依赖项](#%E4%BE%9D%E8%B5%96%E9%A1%B9)
		- [配置方式](#%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F)
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


## ChangeLog

| 日期	| 修改说明 |
|:---:	|:---	  |
| 2019/08/15 | 第一篇blog, 测试Mathjax和代码高亮	|
| 2019/08/14 | Fork TeXt, 搭建框架 |