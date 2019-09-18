---
layout: article
key: rl-target-magnitude
title: "向量, 矩阵与张量梯度的理论推导"
author: Yuze Zou
show_author_profile: true
mathjax: true
tags: ["Machine Learning", "Matrix Calculus", "Deep Learning"]
---


机器学习, 神经网络的反向传播的基础在于梯度计算, 涉及向量(vector)、矩阵(matrix)以及张量(tensor)各类梯度, 明白其中的计算原理和规则具有一定的重要性。**The Matrix Calculus You Need For Deep Learning**[^2]巨细无遗地阐述了与机器学习相关的各类calculus知识, 对于夯实相关基础大有裨益。**Vector, Matrix, and Tensor Derivatives**[^1]从基础出发, 以常见的示例阐明了向量, 矩阵, 张量相关求导的**推导方法**, 极具启发性。本文总结**Vector, Matrix, and Tensor Derivatives**[^1]的核心思路如下, 并以一个常见的例子作为练习该推导方法。

## 基本思路

在进行梯度推导时, 从**标量**对**标量**的导数推导出发, 再组合为**标量\|向量\|矩阵**对**标量\|向量\|矩阵**的求导[^1]。

> In order to simplify a given calculation, it is often useful to write out the explicit formula for a single scalar element of the output in terms of nothing but scalar variables. Once one has an explicit formula for a single scalar element of the output in terms of other scalar values, then one can use the calculus that you used as a beginner, which is much easier than trying to do matrix math, summations, and derivatives all at the same time.


## 例子

${\bf X}: B \times N$矩阵, ${\bf W}: N \times M$矩阵, ${\bf Y}: B\times M$矩阵, 而$\tilde{ {\bf Y} }$表示如下: 

$$
\tilde{ {\bf Y} } = {\bf X} \cdot {\bf W},
$$

定义loss为$L=\sum_b \sum_m ( \tilde{ y }_ {b, m} - y_ {b, m} )^2$。  
以上的例子表示一组Batch size为$B$的输入维度为$N$, 输出维度为$M$的数据集通过一层fully connected网络拟合(无bias项)。现在我们需要推导反向传播中需要计算的项$\frac{\partial L}{ \partial {\bf W} }$。注意到其中$L$为标量(scalar), 而${\bf W}$为$N\times M$矩阵(matrix), 我们按照以上的指导原则, 先确定$\frac{\partial L}{ \partial w_ {n, m} }$的表达式, 推导如下:  

$$
\frac{\partial L}{ \partial w_ {n, m} } = \frac{\partial L}{\partial \tilde{ {\bf Y} }} \frac{ \partial \tilde{ {\bf Y} } }{ \partial w_ {n, m} },
$$

注意到其中第一部分为标量对$B\times M$矩阵的梯度, 第二部分为$B\times M$矩阵对标量的梯度; 两者结果均为$B\times M$矩阵, 两者间的"乘"是指对应项相乘再相加, 即"内积"。接下来我们分别计算这两项。

### 第一项: $\partial L / \partial \tilde{ {\bf Y} }$

同样地, 我们首先拆解为标量对标量的求导问题, 如下: 

$$
\begin{aligned}
\frac{ \partial L }{\partial \tilde{ y }_ {i, j} } &= \frac{ \partial }{ \partial \tilde{ y }_ {i, j} } \left[ \sum_b \sum_m ( \tilde{ y }_ {b, m} - y_ {b, m} )^2 \right] \\
&= 2 ( \tilde{ y }_ {i, j} - y_ {i, j} ),
\end{aligned}
$$

即$L$对$\tilde{ {\bf Y} }$的$(i, j)$分量的导数如上, 对应到矩阵形式则: 

$$
\frac{\partial L}{\partial \tilde{ {\bf Y} }} = 2 ( \tilde{ {\bf Y} } - {\bf Y}), \label{first_term}
$$

### 第二项: $\partial \tilde{ {\bf Y} } / \partial w_ {n, m} $

这一项是矩阵对标量求导, 同样地, 先按照标量对标量求导处理: 

$$
\begin{aligned}
\frac{ \partial \tilde{ y }_ {i, j}  }{ \partial w_ {n, m} } &= \frac{\partial }{ \partial w_ {n, m} } \left[ \sum_ {k=1}^N  x_{i, k} w_{k, j}  \right] \\
&= \frac{\partial }{ \partial w_ {n, m} } \left[ x_ {i, 1} w_ {1, j} + \ldots + x_ {i, n} w_ {n, j} + \ldots + x_ {i, N} w_ {N, j} \right] \\
&= \begin{cases}
	0, & j \ne m \\
	x_ {i, n}, & j = m
   \end{cases}
\end{aligned},
$$

根据以上结果可以扩展到矩阵形式的梯度如下:  

$$
\frac{ \partial \tilde{ {\bf Y} } }{ \partial w_ {n, m} } = \left[ 
\begin{array}{ccccc}
0 & \ldots & x_{1, n} & \ldots & 0\\
0 & \ldots & x_{2, n} & \ldots & 0\\
\vdots & \ddots & \vdots & \ddots & \vdots\\
0 & \ldots & x_{B, n} & \ldots & 0\\
\end{array}
\right]_ {B\times M}, \label{second_term}
$$

其中非零列$[x_{1, n}, x_{2, n}, \ldots, x_{B, n} ]^\intercal$位于矩阵的第$m$列。  

### 结合

将第一项$\eqref{first_term}$和第二项$\eqref{second_term}$的结果组合可以得到:  

$$
\begin{aligned}
\frac{\partial L}{ \partial w_ {n, m} } &= \sum_{i}\sum_{j} 2(\tilde{ {\bf Y} } - {\bf Y} ) \circ  \left[ 
\begin{array}{ccccc}
0 & \ldots & x_{1, n} & \ldots & 0\\
0 & \ldots & x_{2, n} & \ldots & 0\\
\vdots & \ddots & \vdots & \ddots & \vdots\\
0 & \ldots & x_{B, n} & \ldots & 0\\
\end{array}
\right]_ {B\times M} \\
&= 2 \sum_{i=1}^B x_{i, n} ( \tilde{y}_ {i, m} - y_{i, m} )\\
&= {\bf X}_ n^\intercal \cdot 2( \tilde{ {\bf Y} } - {\bf Y} )_ m, 
\end{aligned}
$$

其中$\circ$表示Hadamard积, 即矩阵对应项相乘。${\bf X}_ n$与$( \tilde{ {\bf Y} } - {\bf Y} )_ m$分别表示矩阵${\bf X}$的第$n$列和$( \tilde{ {\bf Y} } - {\bf Y} )$的第$m$列。  
综合以上, 将结果矩阵化可以得到$\partial L / \partial {\bf W} $表示如下:  

$$
\begin{aligned}
\frac{\partial L}{ \partial {\bf W} } &= {\bf X}^\intercal \cdot 2 (\tilde{ {\bf Y} } - {\bf Y}) \\
&= {\bf X}^\intercal \frac{\partial L}{\partial \tilde{ {\bf Y} }  }.
\end{aligned}
$$

**小结**: 对形如${\bf C} = {\bf A}\cdot {\bf B}, f({\bf C})$标量函数求梯度$\partial f / \partial {\bf B}$的结果为:  

$$
\frac{\partial f} {\partial {\bf B} } = {\bf A}^\intercal \frac{\partial f}{ \partial {\bf C} }.
$$

[^1]: [Vector, Matrix, and Tensor Derivatives](http://cs231n.stanford.edu/vecDerivs.pdf)  
[^2]: [The Matrix Calculus You Need For Deep Learning](https://explained.ai/matrix-calculus/)