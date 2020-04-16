---
layout: article
key: matrix-equations
title: "常用矩阵等式"
author: Yuze Zou
show_author_profile: true
mathjax: true
tags: ["数学"]
---

记录几个矩阵中常用的等式变换, 包括: trace, Kronecker product, vectorization。<!--more-->

<div style="margin: 0 auto;" align="justify" markdown="1">

## 符号说明

| 符号 | 含义 | 符号 | 含义 |
| :---: | :--- | :---: | :--- |
| ${\boldsymbol x}$, ${\bf X}$ | 向量${\boldsymbol x}$, 矩阵${\bf X}$ | $\otimes$ | Kronecker乘积 |
| ${\bf tr}({\bf X})$ | 矩阵${\bf X}$的迹(trace) | $\text{diag}({\bf x})$ | 以向量${\bf x}$构建对角矩阵 |
| ${\bf vec}({\bf X})$ | 将矩阵${\bf X}$按其列依次堆叠构成向量 | $x_{ij}$, ${\bf X}_{ij}$ | 矩阵${\bf X}$的第$i$行, 第$j$列元素 |
| ${\bf X}^\intercal$ | 矩阵${\bf X}$的转置 | ${\bf I}_m$ | 维度为$m\times m$的单位矩阵 |
| ${\bf X}_k$ | 矩阵${\bf X}$的第$k$列 | $\sideset{ _{}^{k} }{ _{}^{} }{\bf X}$ | 矩阵${\bf X}$的第$k$列 |


## 公式一览

$$
{\bf D}{\boldsymbol a} = \text{diag}({\boldsymbol a}) {\boldsymbol d},\label{vector}
$$

其中${\bf D}$为对角矩阵, 即${\bf D} = \left[ \begin{array}{ccc} d_1 & & \\\\ & \ddots & \\\\ & & d_n  \end{array} \right]$ 而${\boldsymbol d}$是将矩阵${\bf D}$向量化, ${\boldsymbol d} = [d_1, \cdots, d_n]^\intercal$。

$$
{\bf tr}\left( {\bf A}^\intercal {\bf B} \right) = {\bf tr}\left( {\bf B} {\bf A}^\intercal \right), \label{trace}
$$

$$
{\bf tr}\left( {\bf A}^\intercal {\bf B}\right) = {\bf vec}({\bf A})^\intercal {\bf vec}({\bf B}), \label{trace_vec}
$$

以上公式中, 矩阵${\bf A}$, ${\bf B}$具有相同的维度[^trace]。

$$
{\bf vec}({\bf A}{\bf B}{\bf C}) = \left( {\bf C}^\intercal \otimes {\bf A} \right) {\bf vec}\left( {\bf B} \right),\label{vec1}
$$

$$
{\bf vec}\left( {\bf A} {\bf B} \right) = \left( {\bf I}_n \otimes {\bf A}\right) {\bf vec}\left( {\bf B} \right) = \left( {\bf B}^\intercal \otimes {\bf I}_m \right) {\bf vec}\left( {\bf A} \right), \label{vec2}
$$

以上公式中, 矩阵${\bf A}$, ${\bf B}$, ${\bf C}$的维度分别是: $m\times l$, $l \times n$, $n \times k$[^vec]。

$$
({\bf A} \otimes {\bf B}) ({\bf C} \otimes {\bf D}) = ({\bf A}{\bf C}) \otimes ( {\bf B}{\bf D}), \label{kron}
$$

以上公式中, 矩阵${\bf A}$, ${\bf B}$, ${\bf C}$, ${\bf D}$需可以构成以上的乘法[^kron]。

## 证明

$\eqref{vector}$的证明如下:

$$
{\bf D}{\boldsymbol a} = [d_1 a_1, \cdots, d_n a_n]^\intercal = \text{diag}({\boldsymbol a}) {\boldsymbol d}. \nonumber
$$

$\eqref{trace}$的含义在于交换${\bf tr}(\cdot)$中两个矩阵的位置不改变结果, 证明如下: 

$$
{\bf tr}\left( {\bf A}^\intercal {\bf B} \right) = \sum_{i=1}^{m} \sum_{j=1}^{n} a_{ij} b_{ij} = {\bf tr}\left( {\bf A} {\bf B}^\intercal \right). \nonumber
$$

$\eqref{trace_vec}$表明了trace运算与vec运算间的关系, 证明如下: 

$$
{\bf vec}\left( {\bf A} \right)^\intercal {\bf vec}\left( {\bf B} \right) = \left[ {\bf A}_1^\intercal, \cdots, {\bf A}_n^\intercal \right] \left[ \begin{array}{c} {\bf B}_1 \\ \vdots \\ {\bf B}_n \end{array} \right]  = \sum_{j=1}^{n} {\bf A}_j^\intercal {\bf B}_j = \sum_{j=1}^{n} \left[ a_{1j}, \cdots, a_{mj} \right] \left[ \begin{array}{c} b_{1j} \\ \vdots \\ b_{mj} \end{array} \right] = \sum_{i=1}^{m} \sum_{j=1}^{n} a_{ij} b_{ij}.\nonumber
$$

$\eqref{vec1}$的证明如下:

$$
\begin{equation*}
\begin{aligned}
\left( {\bf C}^\intercal \otimes {\bf A} \right) {\bf vec}({\bf B}) &= \left[ \begin{array}{ccc} c_{11} {\bf A} & \cdots & c_{n1} {\bf A} \\ \vdots & \ddots & \vdots \\ c_{1k}{\bf A} & \cdots & c_{nk}{\bf A} \end{array} \right] \left[ \begin{array}{c} {\bf B}_1 \\ \vdots \\ {\bf B}_n \end{array} \right] = \left[ \begin{array}{c} \sum_{j=1}^{n} c_{j1}{\bf A}{\bf B}_j \\ \hline \vdots \\ \hline  \sum_{j=1}^{n} c_{jk}{\bf A}{\bf B}_j \end{array} \right] \nonumber\\ &= {\bf vec}\left( \left[ \begin{array}{ccc} \sum_{j=1}^{n} \sum_{i=1}^{l} a_{ {\color{red}1}i}b_{ij}c_{j{\color{red}1}} & \cdots & \sum_{j=1}^{n} \sum_{i=1}^{l} a_{ {\color{red}1}i}b_{ij}c_{j{\color{red}k}} \\ \vdots & \ddots & \vdots \\ \sum_{j=1}^{n} \sum_{i=1}^{l} a_{ {\color{red}m}i}b_{ij}c_{j{\color{red}1}} & \cdots & \sum_{j=1}^{n} \sum_{i=1}^{l} a_{ {\color{red}m}i}b_{ij}c_{j{\color{red}k}}  \end{array} \right] \right)\\ \nonumber
&= {\bf vec}\left({\bf A} {\bf B} {\bf C}\right)
\end{aligned}
\end{equation*}
$$

$\eqref{vec2}$是$\eqref{vec1}$的特例, 分别为${\bf A}{\bf B}$前置、后置单位矩阵即可。

$\eqref{kron}$的证明如下:

若以上等式有意义, 矩阵${\bf A}$, ${\bf B}$, ${\bf C}$, ${\bf D}$之间的维度可以设定为: ${\bf A}: l\times m$, ${\bf C}: m\times n$, ${\bf B}: p\times q$, ${\bf D}: q\times r$。等式两边的维度一致,均为$mp \times lr$, 只需要验证对应位置的值相等即可。

首先, 等式左边视为两个矩阵相乘, 那么其第$i$行, 第$j$列的元素计算如下:

$$
\begin{equation*}
\begin{aligned}
\left(({\bf A} \otimes {\bf B}) ({\bf C} \otimes {\bf D})\right)_{ij} &= \sideset{ _{}^{i} }{ _{}^{} } {\left( {\bf A} \otimes {\bf B}\right)} \left( {\bf C} \otimes {\bf D}\right)_j \nonumber \\ 
&= \left[ a_{ {i_1} 1} \sideset{ _{}^{i_2} }{ _{}^{} }{\bf B}, \cdots, a_{ {i_1} m} \sideset{ _{}^{i_2} }{ _{}^{} }{\bf B} \right] \left[ \begin{array}{c} c_{1 j_1} {\bf D}_{j_2} \\ \hline \vdots \\ \hline c_{m j_1} {\bf D}_{j_2} \end{array} \right] \nonumber\\
&= \sum_{k=1}^m a_{i_1 k} c_{k j_1} \sideset{ _{}^{i_2} }{ _{}^{} }{\bf B} {\bf D}_{j_2} \nonumber \\
&= \left({\bf A}{\bf C}\right)_{i_1 j_1} \left({\bf B}{\bf D}\right)_{i_2 j_2} = \left( \left({\bf A}{\bf C} \right) \otimes \left({\bf B}{\bf D} \right) \right)_{ij}, \nonumber
\end{aligned}
\end{equation*}
$$

其中$i_1$, $i_2$满足关系: $i_1 = \left\lfloor \frac{i-1}{p} \right\rfloor + 1$, $i_2 = (i-1)\% p + 1$, 分别表示行号$i$对应${\bf A} \otimes {\bf B}$中${\bf A}$, ${\bf B}$元素的行号。$\lfloor \cdot \rfloor$表示向下取整, $\%$表示取余数。例如: $p=5$, $i=7$, 则$i_1=2$, $i_2=2$, 即$({\bf A}\otimes{\bf B})$的第$7$行由矩阵${\bf A}$的第2行元素依次与矩阵${\bf B}$的第2行相乘: $\left[ a_{21}\sideset{ _{}^{2} }{ _{}^{} }{\bf B}, \cdots, a _{2m} \sideset{ _{}^{2} }{ _{}^{} }{\bf B}\right]$。同理, $j_1$, $j_2$与$j$的关系类似, $j_1= \left\lfloor \frac{j-1}{r} \right\rfloor + 1$, $j_2 = (j-1)\% r + 1$。

</div>

[^trace]: [Trace (linear algebra)](https://en.wikipedia.org/wiki/Trace_(linear_algebra))
[^vec]: [Vectorization (mathematics)](https://en.wikipedia.org/wiki/Vectorization_(mathematics))
[^kron]: [Kronecker product](https://en.wikipedia.org/wiki/Kronecker_product)