FROM node:lts-alpine 
# TODO create Predro's api image on dockerhub

WORKDIR /app

COPY ./package*.json ./

RUN npm ci --omit-dev

COPY . .