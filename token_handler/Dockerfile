FROM node:18-alpine as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . ./
RUN yarn build

FROM node:18-alpine
COPY --from=build-deps /usr/src/app/dist ./
COPY --from=build-deps /usr/src/app/node_modules ./node_modules
EXPOSE 8080
CMD ["node", "dist/index.js"]
