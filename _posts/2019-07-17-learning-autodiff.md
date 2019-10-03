---
layout: article
key: learning-autodiff
title: Autodiff学习笔记
author: Yuze Zou
show_author_profile: true
mathjax: true
tags: ["Machine Learning", "AutoDiff"]
---
Automatic differentiation, 缩写为 AutoDiff 是机器学习中重要概念——backpropagation——的基础。<!--more-->

**概念厘清**: AutoDiff 并不是利用数值化方式*近似计算*梯度, 也不是诸如 Mathematica 数学软件符号化计算梯度；而是介于两者之间, 提供了一种符号化的计算过程。

## “三步走”

实现 AutoDiff 主要可以概括为三个步骤[^1][^2]

> 1. Tracing the computation to build the **computation graph**  
> 2. Implementing **Vector-Jacobian Products (VJPs)** for each primitive op  
> 3. Backprop itself  

其中包括两个重要概念：**computation graph** 以及 **VJP**。

**Computation Graph**: 如下图给出了computation graph的示例: 

<div align="center">
<img src="https://user-images.githubusercontent.com/16682999/63222046-9a738400-c1d4-11e9-9c6e-1b56759b3c8a.jpg" alt="Computation Graph" width="500">
</div>

其表示的计算过程为: 

$$
\begin{aligned}
z &= \omega x + b\\
y &= \sigma(z)\\
\mathcal{L} &= \frac{1}{2} (y-t)^2 \\
\mathcal{R} &= \frac{1}{2} \omega^2 \\
\mathcal{L}_ {\text{reg} } &= \mathcal{L} + \lambda \mathcal{R}
\end{aligned}
$$

**VJP**: 是多元微分链式法则的计算方式。计算$\frac{\partial {\bf y} }{\partial {\bf x} }$, 即Jacobi矩阵, 表示如下:  

$$
{\bf J} = \frac{\partial {\bf y} }{\partial {\bf x} } = \left(
\begin{array}{ccc}
\frac{\partial y_1}{\partial x_1} & \cdots & \frac{\partial y_1}{\partial x_n}\\
\vdots & \ddots & \vdots \\
\frac{\partial y_m}{\partial x_1} & \cdots & \frac{\partial y_m}{\partial x_n}
\end{array}
\right),
$$

有了以上两个重要概念以后, backprop中的“递推”公式如下给出:  

$$
\bar{ {\bf z} } = \left( \frac{\partial {\bf y} }{\partial {\bf z} } \right)^\top \bar{ {\bf y} },
$$

其中, $\bar{ {\bf z} }$ 以及 $\bar{ {\bf y} }$ 分别表示loss function对 ${\bf z}$, ${\bf y}$的梯度, 这个符号表示是Grosse教授在[1]中使用的符号。而${\bf z}$到${\bf y}$之间是fully connected关系, 即他们之间的computation graph如下图所示[^3]   


<div align="center">
<img src="https://user-images.githubusercontent.com/16682999/63222064-e6262d80-c1d4-11e9-8c70-07070cd704f4.jpg" alt="fully connected graph" width="128">
</div>

为了理解这个表达式, 我们拆开单独看$\bar{z_ j}$ 的计算过程如下: 

$$
\bar{z_ j} = \sum_k \bar{y_k} \frac{\partial y_k}{\partial z_j}
$$

将其向量化即可得到以上利用Jacobi矩阵表示的"递推"公式。

**注**: VJP的构造只是为了说明“递推”公式的计算原理, 而实际实现时并不一定需要实际构造Jacobi矩阵, 可以根据不同的运算规则特定地编写VJP计算过程。举例而言, 假设${\bf z}\rightarrow{\bf y}$的运算规则是element-wise的, 那么相应的VJP实际上是对角阵, 如果相应构造Jacobi矩阵则计算开销较大, 实际上可以直接用element-wise（Hadamard积, $\circ$）即可。

### Tracing, 构造computation graph

`Autograd` 实现tracing computation graph的重要原理在于设计了`Node`类, 封装（重载）了所有`numpy`的premitive op, 使其可以如同`numpy`一样的写法, 但实际内部运作机制多`numpy`一层。`numpy`的运算符输入、输出均为numpy array, 而`Autograd`封装的`Node`使得其重载后的操作符输入、输出均为`Node`类, 而该类具有如下四个属性:   

> 1. `value`, the actual value computed on a particular set of inputs  
> 2. `fun`, the primitive operation defining the node  
> 3. `args` and `kwargs`, the arguments the op was called with  
> 4. `parents`, the parent `Node`s  

相应的`Node`类操作符（以`sum`为例）的运算流程/逻辑如下图所示:

<div align="center">
<img src="https://user-images.githubusercontent.com/16682999/63222068-11108180-c1d5-11e9-9c8e-90f9ce8c1b0c.jpg" alt="node computation" width="500">
</div>

具体的构造computation graph的实现是`Autograd`的核心代码, 将来可以进一步阅读。  
综上, 将`numpy`的premitive op重载以符合`Node`类的运算流程；然后计算VJP； 反向传播即可。

[^1]: [Lecture 6: Automatic Differentiation](http://www.cs.toronto.edu/~rgrosse/courses/csc421_2019/readings/L06%20Automatic%20Differentiation.pdf)
[^2]: [A pedagogical implementation of Autograd](https://github.com/mattjj/autodidact)
[^3]: [CSC421/2516 Lecture 4: Backpropagation](http://www.cs.toronto.edu/~rgrosse/courses/csc421_2019/slides/lec04.pdf) 