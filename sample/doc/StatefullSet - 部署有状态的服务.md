# 了解 Statefulset

Pod : 宠物 Pod , 牛 Pod

有些Pod 就像工厂的牛一样, 挂掉后无所谓,再创建一个就是;
但是有些 Pod 就像宠物一样, 若一直宠物死掉,如何能买到一只一模一样的饿呢?

ReplicaSet 管理的 Pod 就像牛一样,是无状态的;

Statefulset 管理的 Pod 就像宠物一样,是有状态的,并且 Statefulset 创建的 Pod 副本,并不是完全一样的,
每个 Pod 可以有一组独立的数据卷,并且 Statefulset 创建的 Pod 的名字都是有规律的.

##创建 StatefulSet
```yaml
# Service
apiVersion: v1
kind: Service
metadata:
  name: kubia-svc
spec:
  clusterIP: None
  selector:
    app: kubia
  ports:
    - port: 80
      name: http
---
# StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: kubia
spec:
  serviceName: kubia-svc # 绑定到一个 Service
  replicas: 3
  template:
    metadata:
      labels:
        app: kubia # statefulSet 创建的 Pod 带有 app:kubia 标签
    spec:
      containers:
        - name: kubia
          image: luksa/kubia-pet
          ports:
            - containerPort: 8080
              name: http
          volumeMounts:
            - mountPath: /var/data #
              name: data
  volumeClaimTemplates: # 创建持久卷声明的模板
    - metadata:
        name: data
      spec:
        resources:
          requests:
            storage: 1Gi
        accessModes:
          - ReadWriteOnce
  selector:
    matchLabels:
      app: kubia

```

```shell script
 k get po
NAME      READY   STATUS    RESTARTS   AGE
kubia-0   1/1     Running   0          74s
kubia-1   1/1     Running   0          71s
kubia-2   1/1     Running   0          68s                           
```

* 查看生成的持久卷声明

```shell script
 k get pvc
NAME           STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
data-kubia-0   Bound    pvc-cc083785-5a53-479a-80ed-cb5f5e2aab16   1Mi        RWO            hostpath       13m
data-kubia-1   Bound    pvc-c0e6df19-7b44-438c-880e-81be1da45518   1Gi        RWO            hostpath       8m29s
data-kubia-2   Bound    pvc-9dd23441-f108-4c08-bbe4-245339a1d04c   1Gi        RWO            hostpath       8m26s  
```

* 本地调试时,把本机端口转发到 Pod 端口
```
 k port-forward myapp 8888:8080 # 把本机 8888 转发到 Pod 的 8080 端口
```