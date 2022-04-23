import { request } from "./request.ts";

let userIsLoggedIn = false;
let currentLoginToken: string | undefined;

const SESSION_FILE_PATH = "./.cache/session.json";

interface User {
  loggedIn: boolean;
  Username: string;
  userID: number;
  FKAdresse: number;
}

export async function isUserLoggedIn() {
  if (userIsLoggedIn) {
    return true;
  }

  const loginFormContent = await getLoginFormResponse();

  const isLoggedIn = loginFormContent.user?.loggedIn ?? false;
  if (!isLoggedIn) {
    currentLoginToken = extractLoginToken(loginFormContent.content);
  }
  return isLoggedIn;
}

export async function login(uid: string, pwd: string) {
  if (!currentLoginToken) {
    const loginFormContent = await getLoginFormResponse();
    currentLoginToken = extractLoginToken(loginFormContent.content);
  }

  const formData = new FormData();
  formData.append("uid", uid);
  formData.append("pwd", pwd);
  formData.append("pwd2", "");
  formData.append("token", currentLoginToken!);

  const response = await request("https://service.dhv.de/api/login", {
    method: "POST",
    body: formData,
  }).then((res) => res.json());

  if (!response.success) {
    throw new Error(`Login failed: ${response.message}`);
  }

  currentLoginToken = undefined;
  userIsLoggedIn = response.success;

  return {
    success: response.success,
    loggedInToken: response.meta.token,
  };
}

export function getDHVSessionId(): string | undefined {
  try {
    const session = Deno.readTextFileSync(SESSION_FILE_PATH);
    if (session) {
      return JSON.parse(session).sessionId;
    }
    return undefined;
  } catch (_) {
    return undefined;
  }
}

export function setDHVSessionId(sessionId: string) {
  Deno.writeTextFileSync(SESSION_FILE_PATH, JSON.stringify({ sessionId }));
}

async function getLoginFormResponse(): Promise<
  { content: string; success: boolean; user: User }
> {
  const response = await request(
    "https://www.dhv.de/db3/service/gebrauchtmarkt/anmelden",
  );
  return await response.json();
}

function extractLoginToken(htmlContent: string) {
  const loginToken = htmlContent.match(
    /<input type="hidden" name="token" value="(.*?)"/,
  );

  if (!loginToken) {
    throw new Error("Could not find login token");
  }

  return loginToken[1];
}
