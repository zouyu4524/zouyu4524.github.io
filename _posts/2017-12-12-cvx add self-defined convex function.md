---
key: cvx-add-self-function
title: cvx添加自定义函数
author: Yuze Zou
show_author_profile: true
tags: [cvx, MATLAB, "Convex Optimization"]
---

本文记录MATLAB/CVX工具包添加自定义函数的示例。<!--more-->

## 背景

最近考虑的一个优化问题中出现了如下的函数：

$$f(x, y)=\begin{cases}

y 2^{\frac{x}{y}}, & x > 0, y > 0\\

0, & y = 0, x \geq 0\\

+\infty, & \text{otherwise}

\end{cases}$$

首先, 这个函数实际上是$2^x$的**perspective function**（参见[Boyd 教材](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf), P103, 3.2.6）, perspective function具有保凸性质, 而$2^x$为凸函数, 所以$y 2^{x/y}$是凸函数。

虽然这个函数是凸函数, 但是其形式并不能直接通过cvx表达式表示, 因为$\frac{x}{y}$是`{affine}./{affine}`违背了cvx的[DCP ruleset](http://cvxr.com/cvx/doc/dcp.html)。实际上在给定的定义域内$\frac{x}{y}$是convex的, 但是$y \cdot 2^{x/y}$ 为`{affine}.*{convex}`同样违背了DCP ruleset。总而言之, 这个函数不能直接应用于cvx的语境中。

## 解决方案

而cvx提供了增加自定义凸（凹）函数的方法, 在用户手册中以[Adding new functions to the atom library](http://web.cvxr.com/cvx/doc/advanced.html#adding-new-functions-to-the-atom-library)章节给出, 其中提供了两种方式, 一种比较直观, 通过符合DCP ruleset的函数或操作符的组合所形成的函数, 实际上这种方式是一种简单的封装；但在这里并不适合本函数, 原因已在之前给出。另外一种方式, 是把原问题转化为另一个凸（凹）问题, 转换后的问题符合DCP ruleset或借助cvx提供的若干函数, 诸如：`rel_entr`, 我理解这种方式写成的函数在新的cvx环境下就构成了cvx的嵌套。本函数可以通过第二种方式表达, 如下所示：

~~~
function cvx_optval = myFoo( x, y )
cvx_begin
    variables z;
    minimize( z );
    subject to
        {x * log(2), y, z} == exponential;
cvx_end
~~~
{: .language-matlab}

注意到, `myFoo`有两个输入参数`x`和`y`, 这两个参数实际上都是`cvx expressions`, 而非numerical inputs；另一方面, `{x * log(2), y, z} == exponential`表示的是`{x * log(2), y, z}`满足关系$y e^{\frac{x \ln (2)}{y}} \leq z, y>0$。因此, 通过`minimize z`同时将结果传递给`cvx_optval`就可以得到这个函数的结果了。具体用法如下[^1][^2]：

~~~
cvx_begin quiet
    variables x y
    minimize ( myFoo(x, y) )
    x >= 2; y<= 3;
cvx_end
~~~
{: .language-matlab}

本例中`myFoo`是作为目标函数给出, 同样的, 这个函数也可以出现在约束条件中, 如下：

~~~
cvx_begin quiet
    variables x y
    minimize ( x + y )
    x >= 1
    myFoo(x, y) <= 10;
cvx_end
~~~
{: .language-matlab}

综上, 我们就通过用户手册中给出的第二种方式添加了自定义的凸函数, 可以用于cvx的编程了。

[^1]: [Exponential perspective function on CVX](http://ask.cvxr.com/t/exponential-perspective-function-on-cvx/387)
[^2]: [How to add self-defined convex function to atom library?](http://ask.cvxr.com/t/how-to-add-self-defined-convex-function-to-atom-library/4624)