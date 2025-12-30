FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV PORT=7860
EXPOSE 7860

CMD ["npm","run","start","--","-p","7860","-H","0.0.0.0"]
