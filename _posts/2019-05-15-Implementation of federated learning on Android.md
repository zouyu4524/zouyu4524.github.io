---
layout: article
key: federated-learning-android-implementation
title: 联合学习之安卓实现
author: Yuze Zou
show_author_profile: true
mathjax: true
tags: [Android, "Deep Learning", "Federated Learning", Java]
---

## 前言

时隔一年之久再次更新博文。😅记录近来的项目经历，留作以后参考，也希望能够帮到有需要的人。<!--more-->

本项目的需求如下：搭建实际的联合学习（Federated Learning）场景，主要包括两个组成部分：**服务器**与**客户端**。两者的角色分别是：

- 服务器：集中处理由客户端上传的更新后的机器学习模型之权重，并将汇集后的新模型传输至客户端，更新客户端的模型。
- 客户端：利用本地存储的数据对机器学习模型进行训练，并将更新后的模型权重上传至服务器。

联合学习的主要优势在于保障客户数据隐私的同时能够进行大规模的机器学习，获得不亚于传统集中式的机器学习模型的表现。联合学习的概念最早于2016年由Google Brian团队推出，截至近日，Google已经正式发布了相关的[平台](https://arxiv.org/pdf/1902.01046.pdf)。Google已经将该技术应用于自家产品Gboard之中，利用客户资源（输入数据）增强Gboard输入预测的能力，优化客户的使用体验。联合学习系统中，一般会由服务器向客户端下发一个基础的模型；在此之上，各个客户端再结合本地数据对模型进一步的训练，将训练后的模型权重上传至服务器；服务器根据客户端上传的模型权重，综合得到新的模型权重。如此往复，联合学习系统可以实现在保障用户数据隐私的情况下，精进机器学习模型的性能，提高用户的体验。有关联合学习的详细介绍可以参考以下[博文](https://federated.withgoogle.com/)。基于以上的观察，实验室打算做联合学习的相关研究，自然地，需要先把台子搭起来。

## TL;DR

项目地址：[Federated learning on Android](https://github.com/zouyu4524/fl-android)

## 平台选择

随着机器学习与深度学习的大热，机器学习平台也井喷式发展。目前最为热门的两大平台分别是Tensorflow于PyTorch。平台热门意味着踩坑的概率小，即便采坑了能够解决的可能性也很高。但是这里有一个问题在于，联合学习中模型训练（Training）的过程发生在终端设备上，例如手机。而实际上，模型训练是一个非常消耗计算资源的过程，这两大平台并未过多关注于终端设备上的训练，相应的文档几乎没有；更多考虑的情形是在服务器或PC上训练好模型后，将存储的模型移植到终端，在终端只“使用”（Inference）模型。在进行一番调研后发现，我们倾向于使用[DL4J](https://deeplearning4j.org/)作为开发平台。DL4J是Deep Learning for Java的缩写，顾名思义，是一个由Java写成的深度学习平台。作为Python当道的机器学习领域，Java的确有些小众，但好在其文档相对完善（虽然没法和“两大”相比），学习成本不高，并且已有现成的[项目](https://github.com/mccorby/PhotoLabeller)介绍实现了与我们基本相同的需求。更为关键的一点是，我们选定了Android作为移动端的开发环境，而Java作为Android的原生开发语言与DL4J刚好匹配。

## 应用选择

联合学习的主要应用场景在于数据敏感的应用，例如用户的输入内容、照片、医疗数据等。在此，我们主要是做一个Proof-of-Can（PoC）的工作，选择相对容易的应用，与此同时还要贴合移动场景，最终选择了：姿态识别（Human Activity Recognition, HAR）应用。该应用可以通过采集用户设备中传感器，如加速度计、陀螺仪的数据，对用户当前的姿态做实时的判定。另一方面，也可以通过用户主动对当前姿态的标记存储新的训练集于终端，并进行本地训练。用于训练基础模型的数据集来自于[WISDM](http://www.cis.fordham.edu/wisdm/dataset.php)实验室，该数据集标定了“Jogging，Walking，Upstairs，Downstairs，Sitting，Standing”共计6种姿态。此数据集包含来自加速度计的数据（x,y,z三个方向），在其最初的[论文](http://www.cis.fordham.edu/wisdm/includes/files/sensorKDD-2010.pdf)中，作者通过组合原始数据构造、提取了共计43个维度的特征，再用于模型训练。除此以外，有关HAR的数据集还有[Human Activity Recognition Using Smartphones Data Set](https://archive.ics.uci.edu/ml/datasets/human+activity+recognition+using+smartphones)，该数据集除了加速度计还包括陀螺仪的数据，数据集样本更多。简便起见，我们选择了WISDM的数据集。

### 数据集预处理

原始的数据集每一条记录如下所示：

~~~
33,Jogging,49105962326000,-0.6946377,12.680544,0.50395286;
~~~

分别记录了用户ID，姿态类型，时间戳以及三个方向的加速度值。我们根据[此博文](http://aqibsaeed.github.io/2016-11-04-human-activity-recognition-cnn/)中给出方法对原始数据进行封装，构成我们需要的数据集。具体而言，以90为窗口大小，将连续的90条记录组合为一条新的记录，将这些记录中出现次数最多的姿态标签定义为组合后的记录标签。此外，以窗口大小的一半（即45）为步长，滑动窗口进而构造下一条数据记录。如此一来，我们可以构造新的监督式机器学习模型的数据集，该数据集的输入为具有270个特征的向量，输出为维度为6的向量，对应6种姿态的概率。至此，就得到了我们需要的数据集。值得注意的是，原始数据集种存在若干无效数据，在实际处理过程中，将无效数据直接跳过。另一方面，由于不同用户可能存在差异，所以各个用户的数据也通过ID的区别相互分离，分别从每个用户的数据中提取构建新的数据集。新的数据集中一条记录形如：

~~~
1,5.63,7.86,0.31,2.53,12.98,1.04,...(共计 270 个特征)
~~~

其中第一个数字表示姿态的编号，剩余的270个数字来自同一ID下连续有效的90条原始记录。

数据预处理的过程由MATLAB实现，具体的代码可以参见[项目地址](https://github.com/zouyu4524/fl-android/tree/master/preprocess)。

## 模型选择

简便起见，我们选择了基本的Neural Network，包含一个Hidden Layer，神经元数量为1000。通过DL4J构建所需的神经网络语法与Keras十分相似，较为直观。示例代码如下：

~~~
MultiLayerConfiguration conf = new NeuralNetConfiguration.Builder()
        .seed(seed)
        .weightInit(WeightInit.XAVIER)
        .updater(new Nesterovs(learningRate, 0.9))
        .list()
        .layer(new DenseLayer.Builder().nIn(numInputs).nOut(numHiddenNodes)
            .activation(Activation.RELU)
            .build())
        .layer(new DenseLayer.Builder().nIn(numHiddenNodes).nOut(numHiddenNodes)
            .activation(Activation.RELU)
            .build())
        .layer(new OutputLayer.Builder(LossFunctions.LossFunction.NEGATIVELOGLIKELIHOOD)
            .activation(Activation.SOFTMAX)
            .nIn(numHiddenNodes).nOut(numOutputs).build())
        .build();
~~~
{: .language-java}

以上代码构建了上述的神经网络模型。在DL4J的[教程](https://deeplearning4j.org/docs/latest/deeplearning4j-quickstart)中对模型构建有做入门的介绍。

## 通信方式

作为实际的联合学习系统，少不了客户端与服务器间的通信。客户端与服务器之间需要交换更新的模型权重，具体而言就是文件的传输。这一点可以通过RESTful框架实现。此处介绍一个更为偷懒的方式，借助Dropbox实现。由于，项目的出发点更多在于PoC，通信方式的实现暂且略过。在客户端安装[Dropbox](https://play.google.com/store/apps/details?id=com.dropbox.android)+[DropSync](https://play.google.com/store/apps/details?id=com.ttxapps.dropsync&hl=en_US)两个App，登陆同一账号；在服务器端安装[Dropbox](https://www.dropbox.com/downloading)，登陆同一账号即可实现简易版的通信环境。Dropbox在服务器端会自动同步Dropbox同步文件夹中的内容，如此可以下载由客户端更新后的模型。而客户端也可以通过DropSync链接到Dropbox并设置自动（双向）同步的文件夹，如此，将客户端更新后的模型存储于该文件夹中即可自动上传至Dropbox服务器。为了解决文件冲突的问题，各个客户端可以在存储更新后的模型时为文件名添加设备ID作为区分。（当然，这样处理的弊端是，每个设备都会同步其他设备本地训练的模型，当设备数量增加时，此项开销是相当可观且完全没有必要的；仍然，由于是PoC，暂且忽略。）

## 模型存储与加载

上述提到，客户端与服务器之间更新模型的必要步骤是存储与加载模型。在DL4J中，这一点的实现也给了明确的说明，示例代码如下：

~~~
// 存储模型
File locationToSave = new File("Trained_HAR_NN.zip");
ModelSerializer.writeModel(model, locationToSave, saveUpdate);

// 加载模型
File locationToLoad = new File("Trained_HAR_NN.zip");
MultiLayerNetwork model = ModelSerializer.restoreMultiLayerNetwork(locationToLoad, false);
~~~
{: .language-java}

其中`writeModel`与`restoreMultiLayerNetwork`分别用于存储、加载模型。需要注意的是，这两个函数都有一个额外的`boolean`类型参数，设置是否需要保存、加载模型的`updater`。机器学习模型在学习过程中一般会动态调整一些控制参数，例如：`learning rate`，该功能通过`updater`实现。在DL4J中，将`updater`独立于优化方法，提高了灵活性。如果该参数设为`false`，那么将不会存储`updater`的状态。相应的在Android中模型的存储于加载过程也是完全一致的，需要注意的是Android中需要在`AndroidManifest.xml`中声明读取权限，如下所示：

~~~
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
~~~
{: .language-java}

此外，Android[开发者文档](https://developer.android.com/training/permissions/requesting)中也给出了申请读写权限的代码块。

## 客户端（App）

客户端的功能需求包括：

- 实时采集、绘制传感器（加速度计）数据；
- 用户主动式标记姿态；
- 本地模型训练；
- 更新机器学习模型；
- 用户姿态检测。

为了实现以上功能，App界面设计包括：Chart控件（第三方）、`Button`、`Progress Bar`。其中Chart控件采用[`MPAndroidChart`](https://github.com/PhilJay/MPAndroidChart)，是一个成熟的第三方绘图控件。为标记（labeling）、训练（training）、检测（inference）、更新模型（updating）等功能分别设置Button控件，只需实现`onClick`方法，在其中对应调用相应的功能代码即可。而`Progress Bar`的存在主要是因为，模型训练、更新以及标记等功能相对比较耗时，通过`Progress Bar`的显示可以提示用户当前正在执行操作。

### 传感器数据采集与绘制

Android[开发者文档](https://developer.android.com/guide/topics/sensors/sensors_overview)中详细介绍了传感器数据采集的方法，在此不做赘述。有了数据以后，我们还需要将其展示出来，`MPAndroidChart`是一个简便的方式。油管上有一个[视频](https://www.youtube.com/watch?v=QEbljbZ4dNs)展示了如何实现这一点。其中关键的步骤包括：

~~~
data.notifyDataChanged();
mChart.notifyDataSetChanged();
~~~
{: .language-java}

MPChart中的几个关键概念包括：Chart/DataSet/Data，可以这样类比：Chart是画板，DataSet是画板上画的所有的图的集合，而Data是这些图中的一个，例如一条线。因此得依次由data通知其值的变化、通知DataSet的变化才能获得数据更新事件的通知，从而更新画板。（这一点在视频中写漏了，底下的评论指出了错误。😅）

### AsyncTask类

上述提到模型训练等过程相对比较耗时，那么一个比较好的办法是借助`AsyncTask`类将比较耗时的操作放置于后台完成。有关`AsyncTask`的用法，这篇[博文](https://blog.csdn.net/liuhe688/article/details/6532519)介绍得非常清晰详尽，值得一看。该类包括如下几个方法：

一个异步任务的执行一般包括以下几个步骤：

    1.execute(Params... params)，执行一个异步任务，需要我们在代码中调用此方法，触发异步任务的执行。
    2.onPreExecute()，在execute(Params... params)被调用后立即执行，一般用来在执行后台任务前对UI做一些标记。
    3.doInBackground(Params... params)，在onPreExecute()完成后立即执行，用于执行较为费时的操作，此方法将接收输入参数和返回计算结果。在执行过程中可以调用publishProgress(Progress... values)来更新进度信息。
    4.onProgressUpdate(Progress... values)，在调用publishProgress(Progress... values)时，此方法被执行，直接将进度信息更新到UI组件上。
    5.onPostExecute(Result result)，当后台操作结束时，此方法将会被调用，计算结果将做为参数传递到此方法中，直接将结果显示到UI组件上。

借助`AsyncTask`类，我们就可以将模型训练、模型更新、标记等功能封装于异步过程之中。

## 服务器

在联合学习系统中，服务器负责收集来自客户端更新的模型权重，再对这些权重进行聚合，一般采用平均的方式。实现这一功能，在DL4J中也比较直接。ND4J是之于DL4J就如同Tensor之于Tensorflow，是DL4J中多维矩阵的实现。DL4J的模型参数通过一个Map存储，Map的键-值对为<层名称，权重>，可以通过`model.paramTable()`方法获得该Map。需要注意的是，对于神经网络，DL4J中每一层分别包含权重以及Bias，存储于`paramTable`中时，默认的名称分别是`x_W`以及`x_b`，其中`x`表示层序号，从0开始。如下给出服务器端平均权重的函数实现：

~~~
public static void AverageWeights(List<File> files, File originModel, int layer, double alpha) {
    /*
        files indicates locations that mobile device uploaded model
        originModel is the model maintained by the server
        layerName is the layer to be averaged
        alpha is a coefficient indicates the weight of original model for the updated model
        currently, we just do transfer learning on the devices and we assume that it happens only at
        the last layer (i.e., the output layer) and keep other layers friezed. Therefore, we just need
        to average weights over the last layer.
     */
    // load original model
    MultiLayerNetwork model = null;
    try {
        model = ModelSerializer.restoreMultiLayerNetwork(originModel, false);
    } catch (IOException e) {
        e.printStackTrace();
    }
    Map<String, INDArray> paramTable = model.paramTable();
    INDArray weight = paramTable.get(String.format("%d_W", layer));
    INDArray bias = paramTable.get(String.format("%d_b", layer));
    INDArray avgWeights = weight.mul(alpha);
    INDArray avgBias = bias.mul(alpha);

    // average weights over mobile devices' models
    int len = files.size();
    for (int i = 0; i < len; i++) {
        try {
            model = ModelSerializer.restoreMultiLayerNetwork(files.get(i), false);
        } catch (IOException e) {
            e.printStackTrace();
        }
        paramTable = model.paramTable();
        weight = paramTable.get(String.format("%d_W", layer));
        avgWeights = avgWeights.add(weight.mul(1.0-alpha).div(len));
        bias = paramTable.get(String.format("%d_b", layer));
        avgBias = avgBias.add(bias.mul(1.0-alpha).div(len));
    }
    model.setParam(String.format("%d_W", layer), avgWeights);
    model.setParam(String.format("%d_b", layer), avgBias);
    try {
        ModelSerializer.writeModel(model, "res/model/trained_har_nn_updated.zip", false);
    } catch (IOException e){
        e.printStackTrace();
    }
}
~~~
{: .language-java}

## Transfer Learning

最后，考虑到模型训练过程相当消耗资源，如果在移动端训练完整、复杂的模型基本是不现实的。而借助Transfer Learning技术能够有效解决这一问题。简而言之，Transfer Learning可以固定模型中的若干层，而仅仅训练剩余的层。如此，可以在保有模型深度的同时，减小训练的规模（参数减少），提高训练的速度，降低能耗，非常适合移动端场景。相应的，DL4J中也提供了Transfer Learning的API与[教程](https://deeplearning4j.org/docs/latest/deeplearning4j-nn-transfer-learning)。示例如下：

~~~
transferred_model = new TransferLearning.Builder(model)
        .fineTuneConfiguration(fineTuneConf)
        .setFeatureExtractor(1)
        .build()
~~~
{: .language-java}

其中关键的是`setFeatureExtractor(x)`这一方法，将模型位于第“x+1”层以前（含）的层全部设为`Frozen`状态。如此，新的模型在获得原模型前“x+1”层的权重的同时，将这些权重固定下来，新的模型将只会训练“x+2”及以后的层。需要注意的是，该方法只计算未处于`Frozen`状态的层数，一旦模型的中的某层被设为`Frozen`状态，那么该方法计数时将跳过该层。举例而言，对于一个三层的模型，首次调用`setFeatureExtractor(1)`得到的模型中前两层均被设置为`Frozen`，如果再次调用`setFeatureExtractor(1)`将得到错误信息，因为此时该模型已经只剩一层未处于`Frozen`状态，而该方法不能将模型所有的层均设为`Frozen`。

## 结语

综上，整理了联合学习之安卓实现的项目点滴。由于对Java与Android了解不多，代码组织上有许多可以精进之处，以后有机会再做改进。此外，目前Google已经将Kotlin设为Android开发的首选语言，上述提到的主要参考[项目](https://github.com/mccorby/PhotoLabeller)也是用该语言开发，将来可以考虑将项目用Kotlin重构。