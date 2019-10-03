---
layout: article
key: matlab-oop-notes
title: "《MATLAB面向对象编程》读书笔记"
author: Yuze Zou
show_author_profile: true
mathjax: true
mermaid: true
tags: ["MATLAB", "读书笔记"]
---

部分读书笔记。<!--more-->

## 第2章 面向对象程序入门

### 类的声明

| keyword | 功能 |
| ---:     |:---  |
| `classdef` | 声明一个类 |
| `properties` | 声明数据成员 |
| `methods`  | 声明成员方法 |
| `obj`  | 可以视为`this`指针相同的作用，是对象的一个指代 |

```
classdef Point2D < handle
    properties  % 属性 block
        % ... 对应C++中的数据成员
        x   % 横坐标，依然不需要指定变量类型
        y   % 纵坐标
    end
    
    methods     % 方法 block
        % ... 对应C++中的成员方法
        function obj = Point2D(x0,y0)   % 构造函数，必须有至少一个左值接收创建的对象
            obj.x = x0;
            obj.y = y0;
        end
        function normalize(obj)         % 坐标归一化方法
            r = sqrt(obj.x^2 + obj.y^2);
            obj.x = obj.x / r;
            obj.y = obj.y / r;
        end
    end
end
```
{: .language-matlab}

`Dependent`、`Constant`、`Hidden` 修饰符
```
properties(Dependent)   % 从属属性
    p1;
end
properties(Constant，Hidden) % 常量属性(与C++中的constant一致)以及隐藏属性(不显示，但可以被访问)
    p2;
end
```
{: .language-matlab}

### 继承

+ `<` 表示继承
+ `&` 连接多个被继承的父类
+ `@` 调用父类方法

```
classdef sub < super1 & super2
    % ...
    foo@super1(obj, arg1, arg2) % 调用父类方法 foo    
end
```
{: .language-matlab}

### Handle的set与get方法

handle类的set与get方法的功能与C++中为数据成员设置的set、get方法是一样的。  
*注意 set、get与Dependent属性的组合用法。*可以用来做参数检查或者在需要修改变量名称时无需做大量修改。

## 第3章 句柄类(`handle`类) vs. 实体值类

书中的案例大部分类都继承了`handle`类，使其具有handle类的特征。而`handle`类 类似C语言中指针以及C++中的引用(Reference)概念，`handle`是内存空间地址的一个指代，通过`handle`修改了所指向的内存地址中的值后，其他指向该内存地址的值也相应变化。

handle具有计数器。类似C++ 11中的智能指针。
{: .warning}

## 第4章 事件与响应

### 示例
以下的示例中定义了一个`Publisher`类，其中有一个简单的事件，叫做`dataChange`；另外定义了一个`Subscriber`类，其中包括一个Static方法，`gotNotifiedStatic`以及一个成员方法 `gotNotified`。在脚本中，创建了一个`Publisher`对象，一个`Subscriber`对象，并且，为`Publisher`对象的`dataChange`事件添加了两个侦听对象，分别是`Subscriber的静态方法，以及Subscriber`对象s的`gotNotified`对象。

最后通过`Publisher`对象的`notify`方法，告知所有注册在事件`dataChange`的对象。

+ `Publisher`类

```
classdef Publisher < handle
    events
       dataChange
    end
end
```
{: .language-matlab}

+ `Subscriber`类

```
classdef Subscriber < handle
    methods(Static)
        function gotNotifiedStatic(src, data)
            disp('Got Notified Static!')
        end
    end
    methods
        function gotNotified(obj, src, data)
            disp('Got Notified!')
        end
    end
end
```
{: .language-matlab}

+ 调用脚本

```
p = Publisher();
s = Subscriber();
p.addlistener('dataChange', @Subscriber.gotNotifiedStatic);
p.addlistener('dataChange', @s.gotNotified);
p.notify('dataChange')
```
{: .language-matlab}

+ 显示效果

```
Got Notified!
Got Notified Static!
```

### 说明

+ 所有的侦听函数必须要有**两个输入参数 `src`, 以及 `data`**，其中，`src`用于记录被侦听的事件名称，`data`用于接收事件传递的数据，该数据必须是`event.EventData`。

+ 消息通知时，传递参数的方法

```
p.notify('dataChange', data);
```
{: .language-matlab}

其中，notify只能传递除了event name外的一个参数，并且参数类型是`event.EventData`类型，`event.EventData`是一个基类

> The event.EventData class is the base class for all data objects passed to event listeners.  It is used to encapsulate information about an event which can then be passed to event listeners via NOTIFY.   
> Subclass the event.EventData class if you wish to pass additional information to event listeners.

```
% event.EventData defines two read-only properties:
    EventName - Name of the event described by this object.
    Source    - The object that defines the event described by this object.
```
{: .language-matlab}

```
%Example: Creating an event data class
classdef engineData < event.EventData
    properties
        Temperature;
        OilPressure;
    end
    methods
        function obj = engineData(temp,pressure)
            obj.Temperature = temp;
            obj.OilPressure = pressure;
        end
    end
end
```
{: .language-matlab}

## 第11章 对象数组

### 用非同类(Heterogeneous)数组盛放不同类对象
基类 `Shape2D` 继承了 `matlab.mixin.Heterogeneous`使其能够支持 子类放置在同一数组中。

```
classdef Shape2D < handle & matlab.mixin.Heterogeneous
end
```
{: .language-matlab}

+ 子类1 `Square`

```
classdef Square < Shape2D
    properties
        a
    end
end
```
{: .language-matlab}

+ 子类2 `Circle`

```
classdef Circle < Shape2D
    properties
        r
    end
end
```
{: .language-matlab}

这样一来可以构造如下的对象数组：

```
s1 = Square();
c1 = Circle();
arr1 = [s1, c1]; % correct!
```
{: .language-matlab}

如果，基类`Shape2D`未继承`matlab.mixin.Heterogeneous`，则以上的合并对象`s1`，`c1`为一个数组的操作是错误的。

**注： 以上特性是在R2011b后引入的！**
{: .warning}

### 向量化访问对象数组的属性

```
objArr = [Circle(1), Circle(2)];
objArr.r    % 可以返回两个Circle对象的r值构成的数组
```
{: .language-matlab}

**Tips：** 可以通过`[ ]`将对象数组的属性组合为一个数组

```
[objArr.r]  % 获得属性数组
```
{: .language-matlab}

### 使成员方法支持向量化

对于成员方法`foo(obj)`而言，其中`obj`参数是可以视为一个对象数组的，只要`foo`方法中对数组化的`obj`支持向量化操作，那么`foo`方法就对对象数组提供向量化支持的操作，例如：

```
classdef Circle < Shape2D
    methods
        function s = area(obj)
            s = pi * [obj.r].^2;
        end
    end
end
```
{: .language-matlab}

其中`area`方法计算圆形的面积，其中的操作是向量化的，因此该方法是支持对象数组向量化调用的。

对于Heterogeneous类型的对象数组，支持向量化操作的成员方法需要声明为`Sealed`类型，即不可以被子类重载，这一点可想而知，因为向量化操作的特点在于**统一**，`Sealed`类型的方法保证了这一点。

## 参考书目

徐潇, 李远, *MATLAB面向对象编程——从入门到设计模式*, 北京航空航天大学出版社




