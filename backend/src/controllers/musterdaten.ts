import { Router } from '../deps.ts';
import { collectMusterdaten } from '../services/musterdaten.ts';
import { request } from '../services/request.ts';

export const musterdatenRouter = new Router().get('/', async (context) => {
  const offerTitle = context.request.url.searchParams.get('offerTitle');

  if (!offerTitle) {
    throw new Error('No offer title provided!');
  }

  // the official Google AI JS SDK doesn't work with Deno so we are using a manual fetch here
  const response = await request(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${
      Deno.env.get('GEMINI_API_KEY')
    }`,
    {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: `Zweck und Ziele:

* Extrahiere die korrekte Herstellerbezeichnung für Gleitschirme aus Anzeigentiteln.

* Stelle sicher, dass die extrahierte Bezeichnung exakt mit der üblichen Schreibweise übereinstimmt.

* Antworte ausschließlich mit der korrekten Herstellerbezeichnung oder mit 'ka' (keine Angabe), falls die Bezeichnung nicht eindeutig ermittelt werden kann.

* Vermeide jeglichen anderen Output oder zusätzliche Erklärungen.


Verhaltensregeln:

1) Eingabeinterpretation:

a) Analysiere den gegebenen Anzeigentitel präzise, um Hersteller und Modell zu identifizieren.

b) Berücksichtige verschiedene Schreibweisen und Abkürzungen, um die korrekte Bezeichnung zu finden.

c) Beachte die Größenangaben, falls vorhanden, und integriere sie in die korrekte Bezeichnung (z.B. 'Größe 23' wird bei manchen Herstellern zu '23').

d) Ignoriere irrelevante Informationen wie Farben, Gewichtsangaben oder zusätzliche Beschreibungen.

e) Gehe davon aus, dass der Nutzer die korrekte Herstellerbezeichnung wünscht.


2) Antwortgenerierung:

a) Wenn die Herstellerbezeichnung eindeutig ermittelt werden kann, gib diese exakt als Antwort aus.

b) Wenn die Herstellerbezeichnung nicht eindeutig ermittelt werden kann, antworte mit 'ka'.

c) Gib keine zusätzlichen Kommentare, Erklärungen oder Fragen aus.

d) Halte dich strikt an das Format der korrekten Herstellerbezeichnung (z.B. 'GIN Yeti 5 23', nicht 'GIN Yeti 5 Größe 23').

e) Bei unvollständigen Titeln, versuche die fehlenden Informationen zu ergänzen, falls dies eindeutig möglich ist (z.B. 'Skywal Arak Air L' -> 'Skywalk Arak Air L', 'Cumeo2 85' -> 'Skywalk Cumeo2 85').


Beispiele für die Interaktion:

Nutzer-Eingabe: 'GIN Yeti 5 Größe 23'
Deine Antwort: 'GIN Yeti 5 23'

Nutzer-Eingabe: 'Ozone Modell Alpina 3 Größe S'
Deine Antwort: 'Ozone Alpina 3 S'

Nutzer-Eingabe: 'GIN Modell GTO 3 Größe XS (18m²), 70 bis 85kg, Farbe rot'
Deine Antwort: 'GIN GTO 3 XS'

Nutzer-Eingabe: 'Skywal Arak Air L'
Deine Antwort: 'Skywalk Arak Air L'


Nutzer-Eingabe: 'Cumeo2 85'
Deine Antwort: 'Skywalk Cumeo2 85'

Nutzer-Eingabe: 'UP Lhotse2 24'
Deine Antwort: 'UP Lhotse2 24'


Nutzer-Eingabe: 'Unbekannter Schirm'
Deine Antwort: 'ka'`,
            },
          ],
        },
        contents: [
          {
            parts: [
              {
                text: offerTitle,
              },
            ],
          },
        ],
      }),
    },
  );
  const responseJson = await response.json();
  const aiOutput = responseJson.candidates[0].content.parts[0].text.trim();

  console.log(aiOutput);
  if (aiOutput === 'ka') {
    console.error('failed to find name for ' + offerTitle);
    context.response.body = {
      success: false,
    };
    context.response.status = 404;
    return;
  }

  console.log(`Used AI to turn '${offerTitle}' into '${aiOutput}' 🎉`);

  const dhvSearchUrl = 'https://service.dhv.de/db1/searchresultpage.php';

  try {
    const form = new FormData();
    form.append('str_Types_Designation', aiOutput);
    form.append('num_Types_isCertifiedDE', '-1');
    form.append('lang', 'DE');
    form.append('defaulttemplatesetid', '-1');
    form.append('reportType', 'Technic');
    form.append('sortflag', 'asc');
    form.append('orderbyfield', 'first');
    form.append('fil_Types_Designation', '2');

    const response = await request(dhvSearchUrl, {
      method: 'POST',
      body: form,
    });
    const data = await response.text();
    const musterData = await collectMusterdaten(data, dhvSearchUrl);
    if (!musterData) {
      context.response.body = {
        success: false,
      };
      context.response.status = 404;
      return;
    }

    context.response.body = { musterData, success: true };
  } catch (error) {
    console.error(error);
    context.response.body = { success: false };
    context.response.status = 500;
  }
});
