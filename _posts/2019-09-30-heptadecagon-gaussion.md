---
layout: article
key: Heptadecagon-Guassian
title: "尺寸作图与正十七边形"
author: Yuze Zou
show_author_profile: true
mathjax: true
mermaid: true
tags: ["Geometry", "Interests"]
---


李永乐老师的视频中简明扼要地说明了尺规作图**可作图**的概念以及尺规作图与**代数运算**的关系, 在此基础上说明了高斯通过尺规做出正十七边形的原理, 很有意思!  

<div>{%- include extensions/youtube.html id='I2pf3gjz5QU' -%}</div>

**简单总结如下**:  

尺规可画出的代数操作包括:  

- [x] 加、减、乘、除
- [x] 开方, $\sqrt{a}$


<div class="grid-container">
  <div class="grid grid--px-3">
    <div class="cell cell--4">
    	<div align="center">
    		<figure>
				<img src="..\..\..\assets\images\posts\2019-09-30\mul.svg" height="150">
				<figcaption>(a) 乘法演示: $a, b \rightarrow ab$ </figcaption>
			</figure>
		</div>
    </div>
    <div class="cell cell--4">
    	<div align="center">
    		<figure>
				<img src="..\..\..\assets\images\posts\2019-09-30\recip.svg" height="150">
				<figcaption>(b) 倒数演示: $a \rightarrow {1}/{a}$</figcaption>
			</figure>
		</div>
    </div>
    <div class="cell cell--4">
    	<div align="center">
    		<figure>
				<img src="..\..\..\assets\images\posts\2019-09-30\sqrt.svg" height="150">
				<figcaption>(c) 开方演示: $a \rightarrow \sqrt{a}$</figcaption>
			</figure>
		</div>
    </div>
  </div>
</div>

那么在此基础上, 通过尺规即可画出任意有理数以及根式(包括嵌套的根式)。而做一个圆内接正十七边形等效于做出一个圆周角的十七分之一, 也就是需要做出$\cos(\frac{2\pi}{17})$, 而实际上该值恰好可以表示为根式嵌套的形式如下[^1]:  

$$
\begin{aligned}
16 \cos(\frac{2\pi}{17}) =& -1 + \sqrt{17} + \sqrt{34-2\sqrt{17} } + \\
& 2\sqrt{ 17+3\sqrt{17} - \sqrt{34-2\sqrt{17} } - 2\sqrt{34+2\sqrt{17} } } \\
=& -1 + \sqrt{17} + \sqrt{34-2\sqrt{17} } + \\
& 2\sqrt{ 17 + 3\sqrt{17} - \sqrt{170 + 38\sqrt{17} } }.
\end{aligned}
$$

最后附上正十七边形作图的过程动画[^1]:  

<div align="center">
	<img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Regular_Heptadecagon_Inscribed_in_a_Circle.gif">
</div>

高斯真是个天才!
{: .success}

[^1]: [Heptadecagon](https://en.wikipedia.org/wiki/Heptadecagon)