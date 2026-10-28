# Finance (MM-FINPIVOT 内部作战台) —— TanStack Start SSR 站点
# 数据只存在浏览器本地，服务端不持有任何业务凭据。
FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

FROM node:22-slim AS runtime

LABEL org.opencontainers.image.source="https://github.com/HayesKung/Finance"
LABEL org.opencontainers.image.description="Finance MM-FINPIVOT desk (internal working board)"

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.mjs ./server.mjs

EXPOSE 3000

USER node
CMD ["node", "server.mjs"]
