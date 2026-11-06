# ------------------------------------------------------------
# 1) build - Vite 정적 파일 생성
# ------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ------------------------------------------------------------
# 2) run - nginx 로 dist 서비스
#    실행 모드(dev / prd)는 docker-compose 의 MODE 로 /api-config.js 를 덮어써서 결정합니다.
# ------------------------------------------------------------
FROM nginx:1.27-alpine
RUN apk add --no-cache curl
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
