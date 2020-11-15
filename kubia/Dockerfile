# 设置基础镜像
FROM node:12-alpine
# 设置工作目录
WORKDIR /app
# 拷贝主机的当前目录内容到容器的工作目录中
COPY . .
# 运行构建命令
# RUN yarn install --production
# 运行 node 程序
CMD ["node", "index.js"]


