import { serve } from 'https://deno.land/std@0.135.0/http/server.ts';
import { request } from './request.ts';

console.log('http://localhost:8000/');
serve(async (req) => {

  const { anmeldenContent } = await getAnmeldenResponse();
  const isLoggedInSession = await isLoggedIn(anmeldenContent);

  if (!isLoggedInSession) {
    console.log('logging in...');
    const loginResponse = await getLoginToken(anmeldenContent);
    const token = loginResponse.token;

    const uid = 'fischeversenker';
    const pwd = 'WdgbPxXECm!T5Vx';

    const { success, loggedInToken } = await login(uid, pwd, token);
    console.log({ success, loggedInToken })
  } else {
    console.log('is logged in');
  }

  const meineAnzeigen = await getMeineAnzeigen();
  console.dir(meineAnzeigen);

  return new Response('logged in');
}, { port: 8000 });

async function getAnmeldenResponse(): Promise<{ anmeldenContent: any }> {
  const response = await request('https://www.dhv.de/db3/service/gebrauchtmarkt/anmelden');
  const responseJson = await response.json();
  return { anmeldenContent: responseJson };
}

async function isLoggedIn(anmeldenContent: any) {
  return (anmeldenContent.success && anmeldenContent.user?.loggedIn) ?? false;
}

async function getLoginToken(anmeldenContent: any) {
  console.log({ anmeldenContent });
  const htmlContent = anmeldenContent.content;

  const loginToken = htmlContent.match(/<input type="hidden" name="token" value="(.*?)"/);

  if (!loginToken)
    throw new Error('Could not find login token');

  return { token: loginToken[1] };
}

async function login(uid: string, pwd: string, token: string) {
  const formData = new FormData();
  formData.append('uid', uid);
  formData.append('pwd', pwd);
  formData.append('pwd2', '');
  formData.append('token', token);

  const response = await request('https://service.dhv.de/api/login', { method: 'POST', body: formData });
  const responseJson = await response.json();
  if (!responseJson.success) {
    console.error(responseJson.message);
    throw new Error('Login failed');
  }
  return { success: responseJson.success, loggedInToken: responseJson.meta.token };
}

async function getMeineAnzeigen() {
  return await request('https://www.dhv.de/db3/service/gebrauchtmarkt/meineanzeigen').then(response => response.json());
}
