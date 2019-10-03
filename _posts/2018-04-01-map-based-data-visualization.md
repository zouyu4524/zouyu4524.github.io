---
key: map-based-data-visualization
title: 中国省市自治区行政区域数据可视化
author: Yuze Zou
show_author_profile: true
tags: [Excel, MATLAB, Mapshape, Visualization]
---

本文总结对比三种基于地理信息的数据可视化工具。<!--more-->

## 动机

近期的论文中需要对省市自治区数据进行可视化, 查询资料后获取如下的解决方案：

- Excel Power Map
- Matlab geoshow/mapshow
- Mapshaper

## 需求说明
本次需要绘制的数据图为区域图, 即对各省市自治区按照数值大小用不同颜色反映出数据的差异, 将相应区域整体着色。

## Demo

<div align="center">
<figure>
<img src="https://user-images.githubusercontent.com/16682999/63211091-36de4d80-c125-11e9-9d41-47bb1893b325.png" alt="charging pile">
<figcaption>中国各省市自治区电动汽车公共充电桩数量分布（截至2017年12月）</figcaption>
</figure>
</div>

如图所示, 通过区域绘图的方式绘制了充电桩的分布情况（MATLAB实现）。其他与省市相关的数据可视化均可以通过这种方式展示。

## 解决方案
下面分别对以上方案进行简单介绍与对比。

### Excel Power Map
自Office 2016以来, Excel 集成了Power Map功能（使用时需要联网）; Office 2013需要单独下载安装Power Map工具; 再之前的版本不支持该功能。Power Map的优势在于上手方便, 无需编程。在Excel表格中选中相应的数据即可添加至Power Map加载项中即可实现相应的需求。需要注意的是：该功能中务必将省市自治区的名称完整写出, 例如：北京市、广东省、广西壮族自治区, 不能写为北京、广东、广西; 否则在选择数据类型时无法准确识别。此外, Power Map可以选择不同的数据表示方式, 包括：柱状图、热力图、区域图; 根据需求, 我们需要采用区域图。

#### 优点

- 上手快, 无需编程

#### 缺点

- 颜色只能选择单一色调, 颜色深浅是按照原有数据自动配置色彩深浅。（这一点可以通过对数据预处理解决, 对原始数据先进行分级）
- 地图为世界地图, 无法单独抠出中国地图
- 图例形式单一

### Matlab geoshow/mapshow

Matlab中提供了地图绘制的函数, `geoshow`与`mapshow`

可以方便地从地图文件（Shapefile, .shp）中提取经纬度信息, 绘制成地图。具体的操作如下代码所示：

~~~
s = shaperead('省界_region.shp'); % load shapefile
axesm('mercator') % set projection type as mercator projection
set(gca, 'Color', 'none') % set background transparent
set(gca,'XColor','none'); set(gca,'YColor','none'); % set boundary transparent
for k = 1 : length(s)
geoshow(s(k).Y, s(k).X, 'DisplayType', 'polygon');
hold on
~~~
{: .language-matlab}

首先读取地图文件, 存储为地图结构体, 其中包括34个省市自治区的边界信息; 然后设置坐标轴的投影类型为墨卡托投影（这一点在后面会补充提到）; 设置坐标轴以及背景为空为了仅显示地图而不显示背景与坐标轴; 通过循环利用`geoshow`函数绘制各个省市自治区。`geoshow`函数的用法如下：

`handle = geoshow(lan, lon, 'DisplayType', 'polygon', 'FaceColor', [r, g, b]);`
与普通的plot函数用法别无二致。通过设置facecolor即可完成对区域着不同颜色的目标, 而此处着色的方式就更为自由; handle为图形的句柄, 可以为后续设置图例使用。总结MATLAB `geoshow/mapshow`方式的优缺点如下：

#### 优点

- 自由度高, 能达成所有目标
- 了解matlab而言, 上手容易

#### 缺点

- 需要安装matlab
- 有一定门槛

### Mapshaper

[`mapshaper`](http://mapshaper.org/)是一个开源地图编辑软件, 由纽约时报记者[Matthew Bloch](https://github.com/mbloch)开发。该工具基于Node.js开发, 可以在windows, Mac OS, Linux系统下安装, 或者由其提供的web端运行, 该工具使用方便, 功能丰富。以[web端](http://mapshaper.org/)为例, 用户只需要将地图文件（以shapefile为例, 是.zip压缩包）拖拽至web端, 网页将自动加载地图文件; 网页端提供控制台(console), 用户可以在控制台中输入相关的命令即可完成对地图的编辑, 从而实现数据可视化的目标。（该web端提供解析地图的本地脚本, 并不需要将数据上传至服务器, 因此安全性与操作性都可以保障）下面的命令行脚本将提供相关的数据可视化功能示例：

```
mapshaper 省界_region.shp -join evse_distribution.csv keys=ID,ID fields=evse_number -o joined.shp
```

以上代码完成的功能是将外部数据添加到地图文件中, 便于后续的数据展示。

```
mapshaper joined.shp -svg-style fill="#CCE5FF" where="evse_numbe <= 1000" -svg-style fill="#99CCFF" where="evse_numbe > 1000 && evse_numbe <= 3000" -svg-style fill="#66B2FF" where="evse_numbe > 3000 && evse_numbe <= 5000" -svg-style fill="#3399FF" where="evse_numbe > 5000 && evse_numbe <= 10000" -svg-style fill="#0080FF" where="evse_numbe > 10000 && evse_numbe <= 20000" -svg-style fill="#0066CC" where="evse_numbe > 20000 && evse_numbe <= 25000" -svg-style fill="#004C99" where="evse_numbe > 25000" -svg-style stroke-width=1.5 -svg-style stroke="black" -proj merc -o evse_numbers.svg
```

以上代码完成对载入数据的可视化展示并生成svg格式图片。

其中的主要语句包括：[`-join`](https://github.com/mbloch/mapshaper/wiki/Command-Reference#-join), [`-svg-style`](https://github.com/mbloch/mapshaper/wiki/Command-Reference#-svg-style), [`-proj`](https://github.com/mbloch/mapshaper/wiki/Command-Reference#-proj)以及[`-o`](https://github.com/mbloch/mapshaper/wiki/Command-Reference#-o-output)。


#### 优点

- 自由度高, 无需安装任何软件（web接口）

#### 缺点

- 有一定编程门槛
- 图例不便于程序化实现

**注意**: dbf文件写入时, 对于非ascii编码文件, 字段长度截断为10个字符; 因此在以上的代码中“evse_number”在后续调用时变成了“evse_numbe”; 这一点在此前的版本没有截断提示, 近期更新作者已[完善提醒](https://github.com/mbloch/mapshaper/issues/266)。

## 其他

### 地图文件格式

[Shapefile格式](https://zh.wikipedia.org/wiki/Shapefile)与说明如下：

	xxx.zip
	   |--- xxx.dbf:    属性数据格式, 以dBase IV的数据表格式存储每个几何形状的属性数据。
	   |--- xxx.prj:    投帧式, 用于保存地理坐标系统与投影信息。
	   |--- xxx.shp:    图形格式, 用于保存元素的几何实体。
	   |--- xxx.shx:    图形索引格式。

### 投影算法

地图的投影算法决定了地图数据展示的效果; 国内常用的投影算法为[墨卡托投影]()。详细的投影算法介绍可以参见[文章](http://cntchen.github.io/2016/05/09/%E5%9B%BD%E5%86%85%E4%B8%BB%E8%A6%81%E5%9C%B0%E5%9B%BE%E7%93%A6%E7%89%87%E5%9D%90%E6%A0%87%E7%B3%BB%E5%AE%9A%E4%B9%89%E5%8F%8A%E8%AE%A1%E7%AE%97%E5%8E%9F%E7%90%86/)。

### 中国省界地图下载

下载链接：[谷歌云盘](https://drive.google.com/open?id=1xArnjoJoqSDGcg3cqqG9SDswu8FdClpH), [百度云盘](https://pan.baidu.com/s/1YpcDeFd6hydgeuyrry0Efg)

解压密码：**malagis.com**