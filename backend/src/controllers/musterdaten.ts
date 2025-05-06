import { OpenAI, Router } from '../deps.ts';
import { request } from '../services/request.ts';

const client = new OpenAI();

export const musterdatenRouter = new Router().get('/', async (context) => {
  const offerTitle = context.request.url.searchParams.get('offerTitle');

  if (!offerTitle) {
    throw new Error('No offer title provided!');
  }

  const aiResponse = await client.responses.create({
    model: 'gpt-4.1-nano',
    instructions:
      'Es geht um Anzeigen über gebrauchte Gleitschirme. Ich versuche von dem Title einer Anzeige für einen Gleitschirm automatisch auf die korrekte Herstellerbezeichnung für diesen Schirm zu schließen. Beispiel: "GIN Yeti 5 Größe 23", die korrekte Herstellerbezeichnung ist "GIN Yeti 5 23". Weiteres Beispiel "Ozone Modell Alpina 3 Größe S" -> "Ozone Alpina 3 S". Ein weiteres Beispiel: "GIN Modell GTO 3 Größe XS (18m²), 70 bis 85kg, Farbe rot", die richtige Bezeichnung ist "GIN GTO 3 XS", eine falsche Bezeichnung dafür ist "GIN GTO 3 18". Du antwortest NUR mit der korrekten Herstellerbezeichnung oder mit "ka" wenn du es nicht eindeutig weißt. Vermeide jegliches anderes Output. Du bekommst den Titel einer Anzeige und antwortest mit der vermutlichen Bezeichnung des Herstellers.',
    input: offerTitle,
  });
  console.log(
    `Used AI to turn '${offerTitle}' into '${aiResponse.output_text}' 🎉`,
  );

  if (aiResponse.output_text === 'ka') {
    context.response.body = {
      success: false,
    };
    context.response.status = 400;
    return;
  }

  const dhvSearchUrl = 'https://service.dhv.de/db1/searchresultpage.php';

  try {
    const form = new FormData();
    form.append('str_Types_Designation', aiResponse.output_text);
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
    console.log(data);
    context.response.body = data;
  } catch (error) {
    console.error(error);
    context.response.body = { success: false };
    context.response.status = 500;
  }

  // TODO: extract the best matching link from the response and follow it to fetch the musterdaten
});
