FROM node:18-slim

WORKDIR /app

# 1) deps (deterministic)
COPY package.json package-lock.json ./
RUN npm ci

# 2) app
COPY . .

# 3) build (Next production)
RUN npm run build

ENV NODE_ENV=production
ENV PORT=7860
EXPOSE 7860

CMD ["npm","run","start","--","-p","7860","-H","0.0.0.0"]
