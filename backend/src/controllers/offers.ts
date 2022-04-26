import { Router } from 'https://deno.land/x/oak@v10.5.1/mod.ts';
import { request } from '../services/request.ts';
import { collectOffers } from '../services/offers.ts';

export const offersRouter = new Router()
  .get('/', async (context) => {
    const itemsPerPage = context.request.url.searchParams.get('itemsPerPage') || '10';
    const offset = context.request.url.searchParams.get('offset') || '0';
    const category = context.request.url.searchParams.get('category') || 0;
    const offersResponse = await request(
      `https://www.dhv.de/db3/service/gebrauchtmarkt/anzeigen?rubrik=${category}&land=0&itemsperpage=${itemsPerPage}&order=1&start=${offset}`,
    ).then((res) => res.json());
    const offersRawHtml = offersResponse.content;
    const offers = collectOffers(offersRawHtml);
    context.response.body = offers;
  })
  .get('/mine', async (context) => {
    const sessionId = await context.cookies.get('dhvsid');
    const meineAnzeigen = await request(
      'https://www.dhv.de/db3/service/gebrauchtmarkt/meineanzeigen',
      { sessionId },
    ).then((response) => response.json());
    const offersRawHtml = meineAnzeigen.content;
    const offers = collectOffers(offersRawHtml);
    context.response.body = offers;
  });
