import { Application, loadEnvVars, oakCors } from './deps.ts';
import { router } from './routes.ts';

loadEnvVars({ export: true });

const app = new Application();

const controller = new AbortController();
const { signal } = controller;

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.info(
    `[INFO] Listening on: ${secure ? 'https://' : 'http://'}${hostname ?? 'localhost'}:${port}`,
  );
});

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get('X-Response-Time');
  console.info(
    `[INFO] [${ctx.response.status}] ${ctx.request.method} ${ctx.request.url} - ${rt}`,
  );
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

app.use(
  oakCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173',
      'https://dhv-gebrauchtmarkt-ui.netlify.app',
    ],
    credentials: true,
  }),
);

app.use(router.routes());
app.use(router.allowedMethods());

const listenPromise = app.listen({
  port: 8000,
  signal,
  secure: Deno.env.get('PRODUCTION') === 'true',
});

// In order to close the sever...
// controller.abort();

// Listen will stop listening for requests and the promise will resolve...
await listenPromise;
