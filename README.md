## Backend
- Runtime: Deno
- Framework: Oak
- Hosting: dash.deno.com
- Database: railway.app
- CronJob: cron-job.org
- Notifications: pusher.com

## Frontend
- Framework: SvelteKit
- CSS: Bulma
- Hosting: netlify.com

## Misc

### Trello Board
https://trello.com/b/c6ac7pnM/dhv-gebrauchtmarkt-20

### Login Flow
- Get Login Token from https://www.dhv.de/db3/service/gebrauchtmarkt/anmelden
  copy token from response at $.content
- Use Login Token in request to https://service.dhv.de/api/login
  body needs to be raw text with WebKitFormBoundary formatting with form-data for uid, pwd and token
  response will contain cookie with dhvsid
