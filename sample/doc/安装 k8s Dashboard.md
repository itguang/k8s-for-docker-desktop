
# 

> https://medium.com/backbase/kubernetes-in-local-the-easy-way-f8ef2b98be68
* 启动 K8s

* 运行 dashboard 的 Pod

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-rc3/aio/deploy/recommended.yaml
```

* 启用本地端口转发到 Dashboard Pod 的 端口

```
kubectl proxy
```
> kubectl proxy creates a proxy server between your machine and Kubernetes API server. By default, it is only accessible locally (from the machine that started it).


访问: 地址

```http
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/login
```

需要登录,

使用下面命令获取 token

```
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | awk '/^deployment-controller-token-/{print $1}') | awk '$1=="token:"{print $2}'
```

把生成的 token 复制进去,点击登录即可


![](https://itguang.oss-cn-beijing.aliyuncs.com/20201115150138.png)
