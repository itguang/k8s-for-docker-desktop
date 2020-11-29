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