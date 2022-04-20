let lastKnownDhvSessionId: string | undefined = undefined;
// lastKnownDhvSessionId = 'ad7ff27e7113d28260c6d6942b7210ad';

interface RequestOptions {
  method?: string;
  headers?: Headers;
  body?: BodyInit;
}

export function request(url: string, options: RequestOptions = {}): Promise<Response> {
  const method = options.method ?? 'GET';
  const headers = options.headers ?? new Headers();
  const body = options.body ?? null;

  headers.append('Origin', 'https://www.dhv.de');
  headers.append('Referer', 'https://www.dhv.de/');
  if (lastKnownDhvSessionId) {
    headers.append('Cookie', `dhvsid=${lastKnownDhvSessionId}`);
  }

  const requestOptions: RequestInit = {
    method: method,
    headers: headers,
    body: body,
    keepalive: true,
    cache: 'no-cache',
    redirect: 'follow',
  };

  return fetch(url, requestOptions).then(response => {
    if (response.headers.has('Set-Cookie')) {
      lastKnownDhvSessionId = response.headers.get('Set-Cookie')!.split(';')[0].split('=')[1];
    }
    return response;
  });
}
