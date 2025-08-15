# 1) Сборка Vite+Tailwind
FROM node:20-alpine AS build
WORKDIR /app

# Сначала зависимости (лучше кешируется)
COPY package.json package-lock.json* ./
RUN npm ci || npm i

# Исходники
COPY . .

# Если хочешь пробросить адрес API при билде:
# ARG VITE_API_URL
# ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# 2) Runtime: Nginx со статикой и прокси на бэкенд
FROM nginx:alpine

# Статика фронта
COPY --from=build /app/dist /usr/share/nginx/html

# Конфиг nginx лежит в frontend/nginx.conf (см. ниже)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
