import { Router } from '../deps.ts';
import { request } from '../services/request.ts';

export const notificationsRouter = new Router().get('/', async (context) => {
  // check if there are new offers
  // if yes, push them to the devices 🙌
  // (this is intended to be called every x seconds, cron job)

  const url = `https://${Deno.env.get(
    'PUSHER_INSTANCE_ID'
  )}.pushnotifications.pusher.com/publish_api/v1/instances/${Deno.env.get(
    'PUSHER_INSTANCE_ID'
  )}/publishes`;

  const headers = new Headers();
  headers.append(
    'Authorization',
    `Bearer ${Deno.env.get('PUSHER_PUBLIC_KEY')}`
  );
  headers.append('Content-Type', 'application/json');

  const body = {
    interests: ['newOffers'],
    web: {
      notification: {
        title: 'Hello',
        body: 'Hello, world!',
      },
    },
  };

  const response = await request(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  context.response.body = response;
});
