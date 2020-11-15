# ReplicationController
> ReplicationController 的工作时确保Pod的数量始终与其**标签选择器**匹配

![](https://itguang.oss-cn-beijing.aliyuncs.com/20201115201044.png)

* 获取所有 rc(ReplicationController简写) 信息
```
kubectl get rc
```

* 查看特定 rc 的相信信息

```
kubectl describe rc myapp-rc
```


## rc 通过创建一个新的 Pod 来响应 Pod 的删除

![](https://itguang.oss-cn-beijing.aliyuncs.com/20201115202959.png)

* 运行时给 rc 扩容

```
kubectl scale rc myapp-rc --replicas=5
```

* 删除 rc

```
kubectl delete rc myapp-rc
```
删除 rc 时保留 Pod

```
kubectl delete rc myapp-rc --csacade=false
```

## 使用 ReplicaSet

> ReplicationController: 只能选择与某个标签匹配的 Pod
>
>ReplicaSet: 标签选择器表达能力更强

两者的唯一差别就是 标签选择器的能力不同,仅此而已




