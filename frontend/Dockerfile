# # frontend/Dockerfile
# FROM node:20

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# # Assumindo que o .env.production será usado no mobile
# ARG MODE=development

# ENV NODE_ENV=$MODE

# RUN if [ "$MODE" = "production" ]; then cp .env.production .env; else cp .env.development .env; fi

# RUN npm run build

# FROM nginx:stable-alpine
# COPY --from=0 /app/dist /usr/share/nginx/html
# EXPOSE 5173
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
