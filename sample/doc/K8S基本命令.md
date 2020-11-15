# K8S


## Docker 基本命令

* 构建镜像
```
docker build -t getting-started .
---
docker build : docker 构建 image 的命令
-t :给 image 打标签,标签名为: getting-started
. 告知 Docker 应该 到 到当前目录寻找 Dockerfile 文件

```

* 运行镜像
```
docker run -dp 3000:3000 getting-started

docker run : 运行 docker 镜像的命令
-dp : -d -p 命令的缩写, -d :后台运行, -p: 端口映射 (主机端口:容器端口)

```
```
docker ps  查看运行的 docker container
docker stop <the-container-id>  # 停止 docker container
docker rm <the-container-id>  # 删除 container

docker rm -f <the-container-id> # 停止并删除 container

```

* docker 获取 container 日志

```
docker logs <container id>
```






* 上传镜像

分两步:

一:打标签
```
docker tag myapp itguang/myapp
```
二:  push

```
docker push itguang/myapp
```

## K8S 基本命令


* 根据 pod 模板创建 Pod

```
kubectl create -f myapp.yaml
```
* 查看所有pod

```
kubectl get pods

# 查看所有 pod 并显示标签信息
kubectl get pods --show-labels

# 使用标签选择器,筛选 Pod

kubectl get pods -l env=test # 列出 包含标签 env=test 的所有 Pod

kubectl get pods -l env # 列出包含标签 env 的所有 Pod

kubectl get pods -l '!env' $ 列出不包含标签 env 的所有 Pod
```

* 删除 pod

```
# 通过名称删除
kubectl delete pod myapp

# 通过标签删除
kubectl delete pod -l flag=itguang

# 同过删除整个命名空间删除 Pod
kubectl delete ns custom-namespace

# 删除当前命名空间的所有 Pod
kubectl delete pod --all

# 删除命名空间下的所有资源
kubectl delete all --all
```

* 获取 Pod 日志

```
kubectl logs <pod name>
```

* 本地调试时,把本机端口转发到 Pod 端口
```
 k port-forward myapp 8888:8080 # 把本机 8888 转发到 Pod 的 8080 端口
```



