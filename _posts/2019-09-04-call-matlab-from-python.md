---
layout: article
key: call-matlab-from-python
title: Python中调用MATLAB
author: Yuze Zou
show_author_profile: true
mathjax: true
tags: [MATLAB, Python]
---

MATLAB对多线程的支持并不足够, 涉及循环的程序往往需要逐一执行而无法充分利用机器的算力导致执行时间过长。  
但好在MATLAB提供了Python的接口, 可以方便地从Python中启动MATLAB进程, 并调用相应的MATLAB程序。<!--more-->最为核心的在于MATLAB的Python接口在执行MATLAB程序时提供了`async`(异步)选项, 进而可以启动多个MATLAB进程从而实现并行运算, 大幅提高程序执行效率。

## 安装MATLAB engine

MATLAB自R2014b以后引入了MATLAB engine这一功能, 提供了对Python的支持, 安装方式如下[^install]: 

- **安装需要root权限(for Linux)\|管理员权限(for Windows)**
- **支持的Python版本与MATLAB的版本有关**

在控制台定位到MATLAB安装目录下的`extern/engines/python/`

```
cd matlabroot/extern/engines/python
```
{: .language-shell}

在该目录下包括如下内容:  
```
python
    |-- dist
    |-- setup.py
```
然后执行如下操作（此处需要获得root权限）:  
```
/absolute/path/to/your/python_envs/python setup.py install
```
*需要注意的是该安装是根据你调用`python`所在的环境(路径)将MATLAB engine相应的包添加至该环境下, 因此该方法同样适用由Anaconda创建的python环境。如果不指定`python`所在的绝对路径, 那么会将包安装至系统中`root`\|管理员用户所有的python环境下。*

**小结**: MATLAB engine可以视为一个pip包, 只不过不通过`pip install`安装, 而是`python setup.py install`安装。实际上, 安装后, 可以通过在相应的python环境下执行`pip list`查看发现如下的显示:  
```
$ pip list
Package               Version
--------------------- ----------
matlabengineforpython R2018a
```

## 调用MATLAB engine

```
import matlab.engine

eng = matlab.engine.start_matlab()
eng.sqrt([1.0, 4.0, 9.0, 16.0])
```
{: .language-python}

上述示例代码给出了Python中调用MATLAB engine的基本方法。需要引入的包名称为`matlab.engine`, 启动MATLAB进程的方法为`start_matlab`, 该方法返回MATLAB engine的对象, 此后便可以通过该对象调用MATLAB下的函数\|程序了。示例中调用了MATLAB下的`sqrt`函数。

- `-nojvm`是`start_matlab`的参数, 可以提升启动速度, 只要需要调用的程序不涉及java虚拟机即可配置该参数。（仅限Linux与macOS）

其他若干的参数可以参考`matlab.engine.start_matlab`文档[^params]以及启动选项[^startup]。

## 调用MATLAB函数

在调用MATLAB函数时, 传递的参数首先是该函数需要的若干参数, 以外, 还有若干`keyword`参数可以指定, 包括最重要的两个:  

- `nargout`: 指定被调用的函数的输出参数个数（默认为1） 
- `async`: 指定被调用的函数是否异步执行

由于MATLAB的函数支持多输出参数, 因此在Python中调用MATLAB的函数时务必根据使用情况显式设置输出的参数个数, 默认情况下`nargout=1`。这一点对于被调用的MATLAB函数无输出参数时尤其重要, 需要设置`nargout=0`, 否则将提示输出参数过多的错误。

而`async`参数是上述介绍到的实现并行运算的关键。一旦被调用的函数将`async=True`设置为真, 那么调用时返回值将不再是被执行MATLAB函数的返回值, 而是一个`matlab.engine.FutureResult`对象, 即该任务的一个句柄。为获取相应任务执行完毕后的返回值, 需要通过`result()`方法取得。示例如下:  

```
future = engine.sqrt([1.0, 4.0, 9.0, 16.0], async=True)
sq_root = future.result()
```
{: .language-python}

## 参数传递

有了以上的基础, 进一步我们只需要明确Python与MATLAB之间参数传递\|转换的操作即可以便利地从Python中调用MATLAB程序并获取执行的结果。

### Python $\rightarrow$ MATLAB

```
matlab.double([[1.0, 2.0], [2.0, 1.0]])
```
{: .language-python}

以上将Python中的`list`转换为MATLAB下的二维`double`矩阵[^array]: 

```
[1.0, 2.0;
 2.0, 1.0]
```
{: .language-matlab}

**注意**: 如果是`numpy`矩阵, 需要首先转换为`list`类型后再传入`matlab.double`。

### MATLAB $\rightarrow$ Python

对于多个返回值的函数, 返回值将被组合为`tuple`传递回Python。此外, MATLAB中的内建数据类型到Python数据类型的对应关系如下[^return]:  

| MATLAB | Python |
| :---  | :---    |
| `double` \| `single` | `float` |
| `int8` \| `unit8` \| ...  | `int`   |
| `NaN` | `float(nan)` |
| `Inf` | `float(inf)` |
| `Structure` | `dict` |

## Best Practice

实际上, MATLAB engine的启动相对是比较耗时的, 因此如果为被调用的程序频繁地启动\|关闭MATLAB engine显然是不划算的, 很有可能时间的消耗远远超过MATLAB程序本身的执行时间, 如此便得不偿失了。因此, 实际使用中, 最好是先启动若干MATLAB engine, 然后将可以并行执行的MATLAB程序通过`async`方式分配至这些engine, 当所有程序执行完毕后再关闭这些engine。如此便可以做到“一次启动, 重复使用”, 从而实现并行的目的。

**Tips**: `matlab.engine`对象是不可以被`pickle`的对象, 因此并不能结合`multiprocessing`这类库使用。不过, 由于其支持`async`调度, 因此实际上通过上述的方法也能够近似实现并行的目的。

[^install]: [Install MATLAB Engine API for Python](https://www.mathworks.com/help/matlab/matlab_external/install-the-matlab-engine-for-python.html)
[^params]: [Documentation for `matlab.engine.start_matlab`](https://www.mathworks.com/help/matlab/apiref/matlab.engine.start_matlab.html)
[^startup]: [Commonly Used Startup Options](https://www.mathworks.com/help/matlab/matlab_env/commonly-used-startup-options.html)
[^array]: [MATLAB Arrays as Python Variables](https://www.mathworks.com/help/matlab/matlab_external/matlab-arrays-as-python-variables.html)
[^return]: [Handle Data Returned from MATLAB to Python](https://www.mathworks.com/help/matlab/matlab_external/handle-data-returned-from-matlab-to-python.html)