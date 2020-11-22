# Deployment - 声明式的升级应用
> 对于正在运行的 v1 版本的Pod, 现在有个 v2 版本的Pod 被开发出来,如何升级

* 第一种: 手动: 先删除 v1 版本的 Pod ,再创建 v2 版本的 Pod
![](https://itguang.oss-cn-beijing.aliyuncs.com/20201118223233.png)

如果你能接受从删除旧的 Pod 到启动新的 Pod 之间短暂的服务不可用,那么这就是更新一组 Pod 最简单的方式

* 第二种: 蓝绿部署: 从旧版本立即切换到新版本.
> 在 v1 版本的 pod 之上,启动一组 v2 版本的 Pod,然后通过修改 Service 的标签选择器,把流量瞬间切换到 v2 版本的 Pod
![](https://itguang.oss-cn-beijing.aliyuncs.com/20201118223821.png)

## 使用 ReplicaSetController 实现自动的滚动升级(已过时)

rs-deployment.yaml

使用 ReplicaSetController 实现滚动升级的命令:
```shell script
kubectl rolling-update kubia-vl kubia -v2 --image=luksa/kubia:v2
```
使用 ReplicaSetController 实现滚动升级的命令的执行步骤:

```shell script
Scaling kubia-v2 up to 1 
Scaling kub -v1 down to 2
 
Scaling kubia-v2 up to 2 
Scaling kub -v1 down to 1 

Scal ing kubia-v2 up to 3 
Scaling kubia - v1 down to 0 

Update succeeded. Deleting kubia-v1 
replicationcontroller "kubia-v1" rolling updated "kubia- v2"
```
说白了就是kubectl 帮我们一步步完成了需要手动升级的那些步骤.

但是有个问题,一旦中间步骤失败, rs 所控制的 Pod 状态就会不一致.

![](https://itguang.oss-cn-beijing.aliyuncs.com/20201119223319.png)

> k8S 推荐我们直接使用期望副本数来伸缩 Pod,而不是通过手动删除一个Pod 或者增加一个Pod.

## Deployment

> 在使用 Deployment 时,实际的 Pod 是由 ReplicaSet 创建和管理的
> ![](https://itguang.oss-cn-beijing.aliyuncs.com/20201120221420.png)

## 为什么要引入 Deployment 这种资源?

> 在前面小节,我们看到 通过 ReplicaSet 来滚动升级 Pod 时,需要两个 ReplicaSet ,
> 使它们根据彼此的状态不断修改, Deployment 就是用来协调这两个 ReplicaSet (控制器) 的.

使用 Deployment 可以更容易的更新应用程序,因为可以直接定义整个 Deployment 资源所要到达的状态,
并让 K8S 处理中间状态.

### 创建一个 Deployment 资源

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
spec:
  replicas: 3
  template:
    metadata:
      name: myapp
      labels:
        app: myapp
    spec:
      containers:
        - name: nodejs
          image: itguang/myapp
  selector:
    matchLabels:
      app: myapp
```

> Deployment 也是由标签选择器,期望副本数,和 Pod 模板组成的,其中 Pod 是通过 内部自动创建的一个 ReplicaSet
> 管理的.

* 创建 Deployment

```shell script
 k create -f myapp-deployment.yaml --record # --record 会记录历史版本号
```

```shell script
 » k get deployment
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
myapp-deployment   3/3     3            3           9m5s
```
* 查看部署状态

```shell script
 » k rollout status deployment myapp-deployment    
deployment "myapp-deployment" successfully rolled out # 表示部署成功
```

```shell script
 » k get po # 查看 Deployment 创建的所有 Pod

NAME                               READY   STATUS    RESTARTS   AGE
myapp-deployment-6ff55f48f-2w4bl   1/1     Running   0          15m
myapp-deployment-6ff55f48f-54jjq   1/1     Running   0          15m
myapp-deployment-6ff55f48f-v955h   1/1     Running   0          15m

 » k get rs # 查看 Deployment 创建的所欲 ReplicaSet
NAME                         DESIRED   CURRENT   READY   AGE
myapp-deployment-6ff55f48f   3         3         3       18m


```
> 可以可看到这 Pod 的名称都是由 Deployment 的名称加上一个随机字符串组成
> ReplicaSet 的名称也是 由 Deployment 的名称加上一个随机字符串组成

那么这个随机字符串到底是什么?

其实是 Deployment 模板的hash值,这样同一个版本的 Deployment 始终对给定版版本的 Pod 创建相同的 ReplicaSet

### 升级 Deployment

Deployment 的升级策略有两种:

* RollingUpdate: 滚动升级,新旧版本会同时存在
* Recreate: 先删除旧版本,再创建新版本,会出现Pod 短暂不可用状态

* 升级命令
```shell script
» k set image deployment myapp-deployment nodejs=itguang/myapp:v2 
deployment.apps/myapp-deployment image updated
```
> 滚动升级过程: 一个新的 ReplicaSet 会被创建然后慢慢扩容,同时之前版本的 ReplicaSet 会慢慢缩容至0.
> ![](https://itguang.oss-cn-beijing.aliyuncs.com/20201122172623.png)

滚动升级完成,发现 rs 会存在两个
```shell script
 » k get rs
NAME                         DESIRED   CURRENT   READY   AGE
myapp-deployment-6ff55f48f   0         0         0       35m
myapp-deployment-dd7c9c697   3         3         3       2m41s

```
> 旧的 rs 会在滚动升级结束后被删除
> 一般来说,我们不应该关心 这个 自动创建的 Deployment, Deployment为帮助我们管理,默认只保留最近的两个版本创建的rs.
> 可以通过 revisionHistoryLimit 属性来进行限制
> ![](https://itguang.oss-cn-beijing.aliyuncs.com/20201122174755.png)

* 回滚

```shell script
 » k rollout undo deployment myapp-deployment 
deployment.apps/myapp-deployment rolled back

```

#### 修改 Deployment 或其他 K8S 资源的几种方式:

![](https://itguang.oss-cn-beijing.aliyuncs.com/20201122172246.png)








