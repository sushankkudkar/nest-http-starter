FROM node:20-alpine as builder
WORKDIR /app
COPY . .
RUN apk add git make g++ alpine-sdk python3 py3-pip unzip
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm bundle

FROM node:20-alpine
RUN apk add zip unzip bash --no-cache
WORKDIR /app
COPY --from=builder /app/dist .
ENV TZ=Asia/Shanghai
EXPOSE 3333

CMD ["npm", "start:prod"]
