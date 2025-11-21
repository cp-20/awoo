FROM denoland/deno:2.5.6

WORKDIR /app

COPY . .

RUN ["deno", "cache", "main.tsx"]

CMD ["deno", "run", "start"]
