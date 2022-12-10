FROM node
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN  npm install
COPY . ./
