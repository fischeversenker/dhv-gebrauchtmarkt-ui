FROM denoland/deno:1.22.0

EXPOSE 8000

USER deno

COPY src/deps.ts src/deps.ts
RUN deno cache src/deps.ts

WORKDIR /app
COPY . .
RUN deno cache src/server.ts

CMD ["run", "--allow-net", "src/server.ts"]
