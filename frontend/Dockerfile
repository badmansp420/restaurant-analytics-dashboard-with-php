FROM node:22-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

EXPOSE 5173

# Run dev server
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
