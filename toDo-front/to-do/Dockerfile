FROM node:16-alpine
WORKDIR /app

COPY ./toDo-front/to-do/package.json .
RUN npm install --force
COPY ./toDo-front/to-do/. .
EXPOSE 3000
CMD ["npm", "run", "dev"]