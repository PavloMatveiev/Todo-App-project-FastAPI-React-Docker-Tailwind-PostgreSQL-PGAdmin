# 1) Building Vite+Tailwind
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm i
COPY . .

RUN npm run build

# 2) Nginx with static and proxy on the backend
FROM nginx:alpine

# Front statics
COPY --from=build /app/dist /usr/share/nginx/html

# The nginx config is located in frontend/nginx.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
