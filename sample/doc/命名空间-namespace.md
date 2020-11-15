# K8S 命名空间

> 命名空间提供的隔离

命名空间只是将对象(资源)分到不同的组,只允许你对特定命名空间的对象进行操作;
但实际上,命名空间不提供对正在运行的的对象的任何隔离;

一个 namespace 内只允许一个 Pod, 不同namespace 内的 Pod ,是平等的,比如同一节点不同 namespace 的 Pod 可以相互通信

> 命名空间可允许不同团队使用同一集群,就像他们使用单独的 kubernetes 集群一样

* 获取所有命名空间
```
kubectl get ns
```

* 创建 Pod 时指定 命名空间

```
kubectl create -f myapp.yaml -n custom-namespace
```