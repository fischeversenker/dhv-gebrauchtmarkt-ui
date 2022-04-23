import { request } from './request.ts';

export interface User {
  loggedIn: boolean;
  Username: string;
  userID: number;
  FKAdresse: number;
}

export async function isUserLoggedIn(sessionId?: string) {
  const loginFormContent = await getLoginFormResponse(sessionId);

  return loginFormContent.user?.loggedIn ?? false;
}

export async function login(
  uid: string,
  pwd: string,
  sessionId?: string,
): Promise<string> {
  let loginFormContent = await getLoginFormResponse(sessionId);
  const userLoginToken = extractLoginToken(loginFormContent.content);

  const formData = new FormData();
  formData.append('uid', uid);
  formData.append('pwd', pwd);
  formData.append('pwd2', '');
  formData.append('token', userLoginToken);

  const response = await request('https://service.dhv.de/api/login', {
    method: 'POST',
    body: formData,
    sessionId,
  });

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw new Error(`Login failed: ${responseJson.message}`);
  }

  const newSessionId: string = response.headers.get('set-cookie')!.split(';')[0].split('=')[1];

  loginFormContent = await getLoginFormResponse(newSessionId);
  if (!loginFormContent.user?.loggedIn) {
    throw new Error(`Login failed: ${loginFormContent.message}`);
  }

  return newSessionId;
}

async function getLoginFormResponse(sessionId?: string): Promise<
  { content: string; success: boolean; user: User; message?: string }
> {
  const response = await request(
    'https://www.dhv.de/db3/service/gebrauchtmarkt/anmelden',
    { sessionId: sessionId },
  );
  return await response.json();
}

function extractLoginToken(htmlContent: string) {
  const loginToken = htmlContent.match(
    /<input type="hidden" name="token" value="(.*?)"/,
  );

  if (!loginToken) {
    throw new Error('Could not find login token');
  }

  return loginToken[1];
}
