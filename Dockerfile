FROM node:18-alpine

RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app
COPY . .
ARG MONGO_URI
ARG AUTH_ORIGIN
ARG SECRET
ARG MAIL_USER
ARG MAIL_PASSWORD


ENV MONGO_URI=${MONGO_URI}
ENV SECRET=${SECRET}
ENV AUTH_ORIGIN=${AUTH_ORIGIN}
ENV MAIL_USER=${MAIL_USER}
ENV MAIL_PASSWORD=${MAIL_PASSWORD}

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build
ENV NODE_ENV production
ENV PORT 80

EXPOSE 80 

ENTRYPOINT ["node", ".output/server/index.mjs"]