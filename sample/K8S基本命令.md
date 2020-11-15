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
```

* 删除 pod

```
kubectl delete pod myapp
```
