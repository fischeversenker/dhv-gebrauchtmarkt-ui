import { Router } from '../deps.ts';
import { collectOfferPreviews } from '../services/offers.ts';
import { request } from '../services/request.ts';

export const notificationsRouter = new Router().get('/', async (context) => {
  const offersResponse = await request(
    `https://www.dhv.de/db3/service/gebrauchtmarkt/anzeigen?rubrik=0&land=0&itemsperpage=5&order=1`,
  ).then((res) => res.json());

  const offers = collectOfferPreviews(offersResponse.content);

  const newOffers = offers.map((offer) => offer.id);
  if (newOffers.length === 0) {
    context.response.body = [];
    context.response.status = 200;
    return;
  }

  const pusherUrl = `https://${
    Deno.env.get(
      'PUSHER_INSTANCE_ID',
    )
  }.pushnotifications.pusher.com/publish_api/v1/instances/${
    Deno.env.get(
      'PUSHER_INSTANCE_ID',
    )
  }/publishes`;

  const headers = new Headers();
  headers.append(
    'Authorization',
    `Bearer ${Deno.env.get('PUSHER_PUBLIC_KEY')}`,
  );
  headers.append('Content-Type', 'application/json');

  const pusherBody = {
    interests: ['newOffers'],
    web: {
      data: {
        offers: newOffers,
      },
      notification: {
        hide_notification_if_site_has_focus: true,
      },
    },
  };

  const response = await request(pusherUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(pusherBody),
  });
  context.response.body = response.body;
  context.response.status = response.status;
});
