---
layout: article
key: pytorch-tutorial
title: "PyTorch基础教程"
author: Yuze Zou
show_author_profile: true
mathjax: false
tags: ["PyTorch", "Python", "Machine Learning"]
---

## From numpy to PyTorch nn

第一阶段, 从numpy写成的基础神经网络反向传播到PyTorch版本的神经网络。  
**Source**: [LEARNING PYTORCH WITH EXAMPLES](https://pytorch.org/tutorials/beginner/pytorch_with_examples.html)  
**GitHub repo**: [zouyu4524/pytorch-study](https://github.com/zouyu4524/pytorch-study)

### [Warmup: numpy](https://github.com/zouyu4524/pytorch-study/blob/master/01-warmup_numpy.py)

本示例中给出了一个由`numpy`写成的神经网络按照SGD更新的过程, 核心代码包括两部分:  
```
# Forward pass: compute predicted y
h = x.dot(w1)
h_relu = np.maximum(h, 0)
y_pred = h_relu.dot(w2)
```
{: .language-python}

一个隐藏层, 激活函数为`relu`, 包含的可训练的网络参数为`w1`和`w2`。  
```
# Backprop to compute gradients of w1 and w2 with respect to loss
grad_y_pred = 2.0 * (y_pred - y)
grad_w2 = h_relu.T.dot(grad_y_pred)
grad_h_relu = grad_y_pred.dot(w2.T)
grad_h = grad_h_relu.copy()
grad_h[h < 0] = 0
grad_w1 = x.T.dot(grad_h)
```
{: .language-python}

以上代码给出了反向传播计算Loss函数分别对网络参数`w1`和`w2`的梯度计算过程。计算准则可以参见[矩阵导数推导](derivatives-over-matrix.html)查阅详细的分析。其中Loss函数为MSE, 即`loss = np.square(y_pred - y).sum()`, 因此`grad_y_pred = 2.0 * (y_pred - y)`。  
最后, 单步的参数更新由如下方式给出:  
```
# Update weights
w1 -= learning_rate * grad_w1
w2 -= learning_rate * grad_w2
```
{: .language-python}

目标是最小化Loss, 为此将参数朝着**负梯度**方向更新, 更新步长为`learning_rate`。  

### [PyTorch tensors](https://github.com/zouyu4524/pytorch-study/blob/master/02-pytorch_tensors.py)

在本示例中, 与`numpy`写法几乎一致, 只是在PyTorch中参数的通过`Tensor`数据类型给出, 完全类似与`numpy`中的`ndarray`。相应地, 一些函数的名称有所差别, 对应关系如下表:  

| function | numpy | PyTorch |
| :---:    | :---  | :---    |
| 矩阵乘法  | `dot`  | `mm`   |
| 截断     | `maximum(x, 0)`  | `x.clamp(min=0)` |
| 平方     | `square` | `pow(2)` |
| 转置	  | `.T` 	 | `.t()` |

此外, 取出`Tensor`中的数值的方式为`.item()`。

### [PyTorch tensors and autograd](https://github.com/zouyu4524/pytorch-study/blob/master/03-pytorch_tensors_and_autograd.py)

`autograd`是PyTorch的核心功能之一, 将根据计算图创建的过程自动化以上示例中的计算梯度的过程(backprop)。使用该功能后, 以上的代码可以简化如下:  

```
w1 = torch.randn(D_in, H, device=device, dtype=dtype, requires_grad=True)
w2 = torch.randn(H, D_out, device=device, dtype=dtype, requires_grad=True)

y_pred = x.mm(w1).clamp(min=0).mm(w2)

loss = (y_pred - y).pow(2).sum()

loss.backward()

with torch.no_grad():
    w1 -= learning_rate * w1.grad
    w2 -= learning_rate * w2.grad

    # Manually zero the gradients after updating weights
    w1.grad.zero_()
    w2.grad.zero_()
```
{: .language-python}

首先在创建网络可训练参数`w1`和`w2`时, 设置了`requires_grad`属性为`True`, 告知`autograd`需要track这两个变量的计算图。接下来, `y_pred`的计算过程省去了中间变量的表示, 直接串联各步计算, 因为每一步计算的结果仍然为`Tensor`, 如此写法直观简便; 进一步给出`loss`的计算方式。以上两步中, `autograd`均会自动track标记了`requires_grad=True`变量的计算图, 以便后续自动计算目标函数(`loss`)对这些变量的梯度。  
通过`loss.backward()`, 将完成目标函数`loss`对所有`requires_grad=True`变量(例如: `w1`)的梯度, 并将计算结果分别存储于`var.grad`中(例如: `w1.grad`)。  
有了目标函数对网络可训练参数的梯度后, 就可以准备进行一步变量更新了。需要注意的是: 此时需要将梯度更新的操作封装于`torch.no_grad()`环境下, 即告知`autograd`不记录此环境下的计算过程。其中`w1`和`w2`均为`requires_grad=True`的变量, 若不如此, 则`autograd`将会继续记录此步中的操作, 并不是我们需要的。  
在更新完变量后, 再手动将`w1.grad`和`w2.grad`置零。

### [Define new autograd function](https://github.com/zouyu4524/pytorch-study/blob/master/04-pytorch_define_new_autograd_func.py)

本例演示了如何自定义符合autograd机制的函数。示例通过继承`torch.autograd.Function`实现`relu`函数功能。核心是实现`forward`和`backward`两个函数。

```
class MyReLU(torch.autograd.Function):

    @staticmethod
    def forward(ctx, input):
        ctx.save_for_backward(input)
        return input.clamp(min=0)

    @staticmethod
    def backward(ctx, grad_output):
        input, = ctx.saved_tensors
        grad_input = grad_output.clone()
        grad_input[input<0] = 0
        return grad_input
```
{: .language-python}

其中`ctx`为中间对象, 负责保存函数在`backward`中需要用到的变量, 这里需要用到的是`input`, 以作为`backward`中计算梯度是判断的依据。在`forward`中通过`save_for_backward`保存, 在`backward`中通过`saved_tensors`取出。如此, 便可以使得自定义的`relu`函数适配于autograd, 在应用于tensor计算时, 由autograd自动完成涉及该方法的计算图。

此外, 使用该方法时通过如下代码调用:  

```
relu = MyReLU.apply
y_pred = relu(x.mm(w1)).mm(w2)
```
{: .language-python}

**用`apply`方法(静态方法), 无需创建`MyReLU`对象。** 后续的操作就和前面的例子完全一致了。

### [Neural Network](https://github.com/zouyu4524/pytorch-study/blob/master/05-pytorch_nn.py)

接下来, 就可以正式进入神经网络的环节了。本例中构造了一个神经网络, 核心代码如下:  

```
model = torch.nn.Sequential(
    torch.nn.Linear(D_in, H),
    torch.nn.ReLU(),
    torch.nn.Linear(H, D_out),
)

loss_fn = torch.nn.MSELoss(reduction='sum')
```
{: .language-python}

以上代码创建的神经网络与前例中"手动"创建的网络功能一致(多了bias), `torch.nn`中提供了层, 如`Linear`, `ReLU`包含了对autograd机制的支持。另外, `MSELoss`定义了与前例中一致功能的loss函数。如此, 在PyTorch中也能简单直观地搭建网络。

```
y_pred = model(x)

loss = loss_fn(y_pred, y)

model.zero_grad()

loss.backward()

with torch.no_grad():
    for param in model.parameters():
        param -= learning_rate * param.grad
```
{: .language-python}

接下来的代码与前例中大同小异, 需要注意的是: 前例中分别为网络可训练参数调用了`zero_()`用于清空`.grad`中存放的梯度结果, 此处直接通过`model.zero_grad()`调用, 实际上是对逐一调用的封装。类似地, 单步参数更新时, 也通过循环搞定, `model.parameters()`返回模型中所有的可训练参数。

### [PyTorch Optim](https://github.com/zouyu4524/pytorch-study/blob/master/06-pytorch_optim.py)

本例中介绍了PyTorch中的优化器(`optim`), 前例中"手动"实现了SGD, 代码已经相对简单, 但是在引入PyTorch Optim后可以进一步简化, 如下:  

```
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

... # 与前例相同

optimizer.step()
```
{: .language-python}

借助`torch.optim`创建`Adam`优化器, 并将网络参数作为`Adam`的第一个参数。那么通过调用`optimizer.step()`即可对前例中的参数更新步骤进行封装, 这样的好处在于模块化, 可以方便地替换其他的优化器, 采取不同的参数更新策略。  
*至此, 教程逐步相对完善地给出了PyTorch中**构造网络, 定义Loss函数, 设置optimizer, 训练网络**的完整流程, 各个环节都进行了有效地封装, 模块化程度高。*

### [Custom neural network](https://github.com/zouyu4524/pytorch-study/blob/master/07-pytorch_custom_nn_modules.py)

本例中介绍了如何创建自定义的网络类。前例中通过`Sequential`构造的网络, 本例通过继承`torch.nn.Module`这个基类创建。只需要实现`__init__`和`forward`两个函数即可, 如下:  
```
class TwoLayerNet(torch.nn.Module):
    def __init__(self, D_in, H, D_out):
        """
        In the constructor we instantiate two nn.Linear modules and assign them as
        member variables.
        """
        super(TwoLayerNet, self).__init__()
        self.linear1 = torch.nn.Linear(D_in, H)
        self.linear2 = torch.nn.Linear(H, D_out)

    def forward(self, x):
        """
        In the forward function we accept a Tensor of input data and we must return
        a Tensor of output data. We can use Modules defined in the constructor as
        well as arbitrary operators on Tensors.
        """
        h_relu = self.linear1(x).clamp(min=0)
        y_pred = self.linear2(h_relu)
        return y_pred
``` 
{: .language-python}

在`__init__`中, 创建了两个operator, `linear1`和`linear2`, 用于定义`forward`函数, 在`forward`中定义了`Tensor`流。在该类中并不需要定义`backward`函数, 因为该函数将会由autograd机制自动完成。后续的操作与前例一致。

### [Control flow and weight sharing](https://github.com/zouyu4524/pytorch-study/blob/master/08-pytorch_controlflow_weight_sharing.py)

本例开始"炫技", 即动态构造计算图。以上的示例中无论哪种写法, 网络机构都是在**训练前**就确定了, 训练开始后, 网络结构不再变动, 可以理解为一个**"静态图"**。而本例中演示了如何花式创建**动态图**, 如下: 

```
def forward(self, x):
    h_relu = self.input_linear(x).clamp(min=0)
    for _ in range(random.randint(0, 3)):
        h_relu = self.middle_linear(h_relu).clamp(min=0)
    y_pred = self.output_linear(h_relu)
    return y_pred
```
{: .language-python}

以上`forward`代码中, 网络将随机产生0~3个中间层, 在update的过程中, 每一次调用`forward`都将随机生成图, 而相应地`backward`执行时也会根据`forward`中创建的图的结构计算对参数的梯度。这正是PyTorch的"魔力"。
