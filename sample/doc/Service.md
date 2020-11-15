# K8S Service

K8S service 为一组功能相同的Pod 提供单一不变的接入点,即屏蔽易变的 Pod IP


## 创建服务

通过 yaml 模板创建

* 获取所有服务

```
kubectl get svc
```

```
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP   56d
myapp-svc    ClusterIP   10.99.22.236   <none>        80/TCP    6s
```

Service 的主要目标就是使集群内部的其他 Pod 可以访问当前这组 Pod

需要注意的是,Service 是集群内部的 IP, 只能在集群内部访问.

如果需要测试 Service ,可以登录到 Service 中的其中一个 Pod 内部,
然后执行: curl <cluster-IP> 

如果 Docker 容器 提示没有 curl 命令,可以先使用下面命令安装:
> docker 容器中安装 curl:
> 使用命令: apk add curl    

