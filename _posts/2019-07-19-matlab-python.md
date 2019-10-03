---
layout: article
key: python-matlab
title: 在Matlab中调用Python
author: Yuze Zou
show_author_profile: true
mathjax: true
tags: ["MATLAB", "Python"]
---
MATLAB自R2014b后可以在command窗口中调用Python[^1], 实现MATLAB与Python的相对深度的融合, 由此可以提供一定的桥梁作用。本文对此做一个简单的介绍。<!--more-->

### 设置/查看Python版本

```
pyversion("path/to/python/excutable/pythonw.exe") % or "python" in Linux
```
{: .language-matlab}

**该设置支持Anaconda下创建的Python虚拟环境**。  
在设置版本而未调用任何Python命令之前还可以修改定位到不同的Python环境, 而一旦调用了任意的Python命令, 在当前的MATLAB环境下的Pyton环境就确定了, 如需更改只能重新启动MATLAB[^2]。

### 导入Module

```
tf = py.importlib.module("tensorflow");
```
{: .language-matlab}

以上指令等效于Python下的`import tensorflow as tf`命令, 执行该命令后可以在MATLAB的command窗口中以`tf`访问该模块下的任意方法。需要注意的是, 相应的module务必需要在相应的Python环境下安装, 或者可以通过添加搜索路径的方式将需要导入的模块所在的路径包含进来。具体的操作方式可以参见[^2], 否则将会提示`Undefined variable "py" or function "py.command"`。

### 构造`kwargs`

Python函数的一大便利在于其键值对输入, 在MATLAB许多内建的函数同样有该特性, 但是在MATLAB中调用Python的函数并不能**直接**套用键值对参数输入的方式, 好在MATLAB也提供了相应的解决方案, 即`pyargs`[^3]。其用法很直观, 

> `kwa = pyargs(argKey,argValue)` creates one or more `pyargs` keyword arguments to pass to a Python® function.

### 另一种调用Python的方式

有了以上的三个步骤基本能够应对绝大多数情况下由MATLAB调用Python的情形。此外, Matlab还提供了一种调用Python的方式, 如下:

```
!ptyhon -c "python codes ... "
```
{: .language-matlab}

或者,   

```
!python -m python_module
```
{: .language-matlab}

但是, 需要注意的是, 这种调用方式与MATLAB本身并没有任何的“交互”, 仅仅是把command窗口当作一个命令行。 当然其Python的版本是由pyversion设定的。这两条指令的返回值也仅仅是flag, 以表示指令是否成功执行。

### HDF5冲突

如果导入的模块依赖HDF5模块, 例如: `tensorflow`, `keras`, 那么很有可能出现HDF5冲突问题, 从而导致MATLAB崩溃。具体的原因在于, MATLAB内建有对HDF5的支持, 但其版本可能与所引入Python模块的HDF5版本不一致, 而当遇到版本不匹配的情况时, MATLAB会abort, 导致崩溃[^4]。

**解决方案**: 参考[^4]中的方案, 可以试着安装与MATLAB内建HDF5一致的版本（可以通过`[majnum,minnum,relnum] = H5.get_libversion()`获取MATLAB的HDF5版本）, 但是可能造成Python模块的依赖问题, 总之并非一个完美的方案。而如果是Linux系统下的MATLAB, 则有一个完美的解决方案, 思路是`LD_PRELOAD`链接到与Python模块匹配的HDF5库, 从而绕开该问题。

```
>> RTLD_NOW = 2;
>> RTLD_DEEPBIND = 8;
>> flag = bitor(RTLD_NOW, RTLD_DEEPBIND); % RTLD_NOW | RTLD_DEEPBIND
>> py.sys.setdlopenflags(int32(flag));
>> py.importlib.import_module('tensorflow');
```
{: .language-matlab}

[^1]: [Mathworks, Python Libraries](https://www.mathworks.com/help/matlab/call-python-libraries.html)
[^2]: [Undefined variable "py" or function "py.command"](https://www.mathworks.com/help/matlab/matlab_external/undefined-variable-py-or-function-py-command.html)
[^3]: [Mathworks, pyargs](https://www.mathworks.com/help/matlab/ref/pyargs.html)
[^4]: [Importing custom python module fails](https://www.mathworks.com/matlabcentral/answers/265247-importing-custom-python-module-fails#comment_338642)