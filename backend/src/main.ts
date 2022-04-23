import { serve } from "https://deno.land/std@0.135.0/http/server.ts";
import { request } from "./request.ts";
import { isUserLoggedIn, login } from "./session.ts";

console.log("http://localhost:8000/");
serve(async (req: Request) => {
  if (!(await isUserLoggedIn())) {
    if (req.method === "POST") {
      const requestBody = await req.formData();
      if (requestBody.has("uid") && requestBody.has("pwd")) {
        console.log(`Logging in user "${requestBody.get("uid")}"`);
        await login(
          requestBody.get("uid")! as string,
          requestBody.get("pwd")! as string,
        );
      } else {
        console.error("No credentials provided.");
      }
    } else {
      console.error("Not logged in.");
    }
  } else {
    console.log("Already logged in.");
  }

  const meineAnzeigen = await getMeineAnzeigen();
  return new Response(JSON.stringify(meineAnzeigen));
}, { port: 8000 });

async function getMeineAnzeigen() {
  return await request(
    "https://www.dhv.de/db3/service/gebrauchtmarkt/meineanzeigen",
  ).then((response) => response.json());
}
