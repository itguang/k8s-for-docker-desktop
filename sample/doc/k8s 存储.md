# 存储
 分为两半部分:
 
 * Pod 卷
 * 持久化卷 - PV 和 PVC
 
 
## 创建 基于本地文件系统的 PV(本地测试)

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-local
spec:
  capacity:
    storage: 1Gi
  volumeMode: Filesystem # 文件系统
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local:
    path: /Users/itguang/k8s-for-docker-desktop/data  # docker-desktop 节点上的目录
  nodeAffinity: # 亲和性设置
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: kubernetes.io/hostname
              operator: In
              values:
                - docker-desktop
```

## 创建 Pod 通过 PVC 使用 PV

## 调试 - 把本机端口转发到内部的Pod网络

* 本地调试时,把本机端口转发到 Pod 端口
```
 k port-forward myapp 8888:8080 # 把本机 8888 转发到 Pod 的 8080 端口
```