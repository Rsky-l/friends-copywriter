# 表达助手 - 微信云托管部署

FROM node:22-alpine

WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json ./

# 安装依赖
RUN npm ci --production

# 复制源码
COPY src/ ./src/

# 微信云托管默认端口 3000
EXPOSE 3000

CMD ["node", "src/index.js"]
