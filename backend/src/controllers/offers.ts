import { Router } from 'https://deno.land/x/oak@v10.5.1/mod.ts';
import { request } from '../services/request.ts';
import { collectOffers } from '../services/offers.ts';

export const offersRouter = new Router()
  .get('/', async (context) => {
    const offersResponse = await request(
      'https://www.dhv.de/db3/service/gebrauchtmarkt/anzeigen?suchbegriff=&rubrik=1&preismin=&preismax=&anbietertyp=0&land=0&plz=&itemsperpage=5&order=1',
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
