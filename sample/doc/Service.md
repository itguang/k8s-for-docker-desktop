# K8S Service

K8S service 为一组功能相同的Pod 提供单一不变的接入点,即屏蔽易变的 Pod IP
> Service 通过选择器选择一组 Pod 作为一个服务


## 创建服务

通过 yaml 模板创建
```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc # 创建一个 name 为 myapp-svc 的服务
spec:
  sessionAffinity: ClientIP # 会话亲和性, ClientIP:  一个客户端每次请求都访问同一个 Pod
  ports: # Service 多端口设置
    - name: http
      port: 80 # 服务在 80 端口接收请求,并路由到标签选择器为 app=myapp-rs 的 Pod 的 8080 上
      targetPort: 8080
    - name: https
      port: 443
      targetPort: 8080
  selector:
    app: myapp-rs # Service 通过选择器选择一组 Pod 作为一个服务
```

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

> 注意: 服务的 IP 是个虚拟IP,无法 ping 同

**如果 Docker 容器 提示没有 curl 命令,可以先使用下面命令安装:**
> docker 容器中安装 curl:
> 使用命令: apk add curl    

![](https://itguang.oss-cn-beijing.aliyuncs.com/20201115224716.png)

默认是以轮询的方式访问 Sservice 后面的一组 Pod.

可以设置 一个客户端值访问同一个 Pod

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc # 创建一个 name 为 myapp-svc 的服务
spec:
  sessionAffinity: ClientIP # 会话亲和性, ClientIP:  一个客户端每次请求都访问同一个 Pod
  ports:
    - port: 80 # 服务在 80 端口接收请求,并路由到标签选择器为 app=myapp-rs 的 Pod 的 8080 上
      targetPort: 8080
  selector:
    app: myapp-rs
```

### 多端口

### 端口命名

## 服务发现

有两种方式:
1. 环境变量
2. DNS

### 1.通过环境变量发现服务:
> ![](https://itguang.oss-cn-beijing.aliyuncs.com/20201115225704.png)

![](https://itguang.oss-cn-beijing.aliyuncs.com/20201115230151.png)

> 先创建 Service 再创建 Pod,再 Pod 中的环境变量中就能 获取 该 Service 的IP

### 2.通过 DNS 发现服务(在一个 Pod 中访问其他的 Service 资源):

> 每个Pod 都是用 kube-dns 这个 系统自带的Pod 作为 DNS 服务
> 运行在 Pod 上的 DNS 查询都会被 K8S 自身的这个 DNS 服务器响应,该服务指导系统中运行的所有服务.
> 每个 Service 运行的时候都会被 kube-dns 收集到 

在每个 Pod 中都可以通过 curl http://<service-name> 来访问 同一个 namespace 下的服务

如果不同的 namespace 下可以使用: curl http://<service-name>.<namespace> 来访问

* **K8S 在微服务架构下做服务注册中心的一种思路**

> 每个微服务 都在 K8S 中创建一个 Service ,名起名比如: user.xingren.host ,
> 然后,其他微服务只需要 配置好这个 K8s 中的 Service name 即可,
> 最后,只要这些微服务服务都在一个 k8S 集群中运行,便可省去注册中心与服务发现的这些微服务组件



## 如何将 K8S 集群内部的 Service 暴露给集群外部的网络访问?

* NodePort
* LoadBalance
* Ingress

### NodePort - 把 Node 的端口映射到 Node 内部的 Service 端口上

![](https://itguang.oss-cn-beijing.aliyuncs.com/20201116231646.png)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc-nodeport
spec:
  type: NodePort # 把 Service 设置为 NodePort 类型
  ports:
    - port: 80 # service 端口
      targetPort: 8080 # container 端口
      nodePort: 30001 # Node 节点端口: 必须范围: 30000-32767
  selector:
    app: myapp-rs # 标签选择器
```
**在本机可以通过 127.0.0.1:30001 来访问该 K8S 集群内部的 Service**

## LoadBalance 通过负载均衡器把 Service 暴露出来

> 将服务的类型设置为 LoadBalance ,该负载均衡器就会获得一个公开的独一无二的IP,并将所有的连接重定向到 Service,
> 可以通过负载均衡器的IP地址访问该服务.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc-loadbalance
spec:
  type: LoadBalancer # 创建一个 LoadBalance 类型的 Service
  ports:
    - port: 80 # loadBalance 暴露的端口
      targetPort: 8080
  selector:
    app: myapp-rs
```
```
macBook :: ~/k8s-for-docker-desktop/sample » k  get svc
NAME                    TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
kubernetes              ClusterIP      10.96.0.1        <none>        443/TCP        58d
myapp-svc-loadbalance   LoadBalancer   10.108.143.107   localhost     80:30851/TCP   7s
myapp-svc-nodeport      NodePort       10.105.38.239    <none>        80:30001/TCP   22h
```

![](https://itguang.oss-cn-beijing.aliyuncs.com/20201117215641.png)

> 可以把 Loadbalancer 看做一个特殊的 NodePort 类型的服务,
>LoadBalancer 会使用 LoadBalancer 所在节点的IP公开暴露服务(通过标签选择器选择 一组 Pod 作为Service)

此时,在浏览器中输入 localhost 就能访问到 这个服务了.

![](https://itguang.oss-cn-beijing.aliyuncs.com/20201117220117.png)

> 关于浏览器访问 时会话亲和性的设置
>![](https://itguang.oss-cn-beijing.aliyuncs.com/20201117220023.png)

![](https://itguang.oss-cn-beijing.aliyuncs.com/20201117220349.png)

### Ingress

为什么需要 Ingress? 

> 一个重要的原因就是 LoadBalancer 只能为一个服务提供 一个 公共IP,现实中我们有多个服务,每个服务都暴露一个公网 IP,
> 太浪费资源.
>
> 解决方案有两种: 
>
> 一: 创建一个 LoadBalancer 的 Service,这个Service 就是一个 GateWay 服务,用来进行 K8S 集群内部的 服务转发
> 我们知道,Service 在 K8S 集群内部是可以访问的.
>
> 二: 创建 Ingress 资源:
> Ingress 可以看做是一个 网关,可以根据 请求主机名和路径决定请求转发到哪个服务.
> ![](https://itguang.oss-cn-beijing.aliyuncs.com/20201117221143.png)


## 服务不能访问的故障排查思路

![](https://itguang.oss-cn-beijing.aliyuncs.com/20201117224319.png)