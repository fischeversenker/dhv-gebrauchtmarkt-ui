import { Router } from 'https://deno.land/x/oak/mod.ts';
import { request } from '../services/request.ts';

export const offersRouter = new Router()
  .get('/', async (ctx) => {
    const offers = await request(
      'https://www.dhv.de/db3/service/gebrauchtmarkt/anzeigen?suchbegriff=&rubrik=1&preismin=&preismax=&anbietertyp=0&land=0&plz=&itemsperpage=5&order=1',
    ).then((res) => res.json());
    ctx.response.body = offers;
  })
  .get('/mine', async (context) => {
    const sessionId = await context.cookies.get('dhvsid');
    const meineAnzeigen = await request(
      'https://www.dhv.de/db3/service/gebrauchtmarkt/meineanzeigen',
      { sessionId },
    ).then((response) => response.json());
    context.response.body = meineAnzeigen;
  });
