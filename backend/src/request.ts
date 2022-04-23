import { getDHVSessionId, setDHVSessionId } from "./session.ts";

interface RequestOptions {
  method?: string;
  headers?: Headers;
  body?: BodyInit;
}

export async function request(
  url: string,
  options: RequestOptions = {},
): Promise<Response> {
  const method = options.method ?? "GET";
  const headers = options.headers ?? new Headers();
  const body = options.body ?? null;

  headers.append("Origin", "https://www.dhv.de");
  headers.append("Referer", "https://www.dhv.de/");
  const DHVSessionId = getDHVSessionId();
  if (DHVSessionId) {
    headers.append("Cookie", `dhvsid=${DHVSessionId}`);
  }

  const requestOptions: RequestInit = {
    method: method,
    headers: headers,
    body: body,
    keepalive: true,
    cache: "no-cache",
    redirect: "follow",
  };

  const response = await fetch(url, requestOptions);
  if (response.headers.has("Set-Cookie")) {
    const sessionId =
      response.headers.get("Set-Cookie")!.split(";")[0].split("=")[1];
    setDHVSessionId(sessionId);
  }
  return response;
}
