FROM node:16-alpine3.11 as back-build
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci
COPY ./ ./
RUN npm run build

FROM node:16-alpine3.11
RUN apk update && apk add bash
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci --only=production
COPY ./ ./
RUN rm -rf src
COPY --from=back-build ["/app/dist", "./dist/"]
EXPOSE 5000
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
CMD ["yarn","start:dev"]
