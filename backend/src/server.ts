import { Application, oakCors } from './deps.ts';
import { router } from './routes.ts';

const app = new Application();

const controller = new AbortController();
const { signal } = controller;

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? 'https://' : 'http://'}${
      hostname ??
        'localhost'
    }:${port}`,
  );
});

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get('X-Response-Time');
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

app.use(oakCors());

app.use(router.routes());
app.use(router.allowedMethods());

const listenPromise = app.listen({ port: 8000, signal });

// In order to close the sever...
// controller.abort();

// Listen will stop listening for requests and the promise will resolve...
await listenPromise;
