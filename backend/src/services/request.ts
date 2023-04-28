interface RequestOptions {
  method?: string;
  headers?: Headers;
  body?: BodyInit;
  sessionId?: string;
}

export async function request(
  url: string,
  options: RequestOptions = {},
): Promise<Response> {
  const method = options.method ?? 'GET';
  const headers = options.headers ?? new Headers();
  const body = options.body ?? null;
  const sessionId = options.sessionId ?? null;

  console.debug(`[DEBUG] requesting "${url}" with sessionId "${sessionId}"`);

  headers.append('Origin', 'https://www.dhv.de');
  headers.append('Referer', 'https://www.dhv.de/');
  headers.append('Cookie', `dhvsid=${sessionId}`);

  const requestOptions: RequestInit = {
    method: method,
    headers: headers,
    body: body,
    keepalive: true,
    cache: 'no-cache',
    redirect: 'follow',
  };
  const response = await fetch(url, requestOptions);
  console.debug(`[DEBUG] response for ${url}: ${response.status}`);
  return response;
}
