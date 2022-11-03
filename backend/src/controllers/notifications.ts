import { PostgresClient, Router } from '../deps.ts';
import { collectOfferPreviews } from '../services/offers.ts';
import { request } from '../services/request.ts';

export const notificationsRouter = new Router().get('/', async (context) => {
  const postgresClient = new PostgresClient(Deno.env.get('POSTGRES_URL'));
  await postgresClient.connect();

  await postgresClient.queryArray(`CREATE TABLE IF NOT EXISTS latest_offers (
  id integer PRIMARY KEY
);`);

  const databaseResultRaw = await postgresClient.queryArray('SELECT id FROM latest_offers');
  const databaseResult = databaseResultRaw.rows.flat();

  const offersResponse = await request(
    `https://www.dhv.de/db3/service/gebrauchtmarkt/anzeigen?rubrik=0&land=0&itemsperpage=5&order=1`,
  ).then((res) => res.json());

  const offers = collectOfferPreviews(offersResponse.content);

  const newOffers = offers.filter((offer) => !databaseResult.includes(offer.id))
    .map((offer) => offer.id);
  if (newOffers.length === 0) {
    context.response.status = 200;
    return;
  }

  await postgresClient.queryArray(`INSERT INTO latest_offers(id)
VALUES ${newOffers.map((offer) => `(${offer})`).join(',')};`);

  await postgresClient.end();

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
      notification: {
        title: 'Neue Angebote',
        body: `Es gibt ${
          newOffers.length === 1 ? '1 neues Angebot' : `${newOffers.length} neue Angebote`
        } im DHV Gebrauchtmarkt`,
        icon: 'https://www.dhv.de/dbresources/dhv/images/dhvheader2011/dhv_logo.png',
        deep_link: `https://dhv-gebrauchtmarkt-ui.netlify.app/${
          newOffers.length === 1 ? `offers/${newOffers[0]}` : ''
        }`,
      },
    },
  };

  const response = await request(pusherUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(pusherBody),
  });
  context.response.body = response;
});
