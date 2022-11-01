### Tricky things
- pusher JS SDK does not declare "type: module" in its package.json, so it's loaded as UMD. You need to add "type: module" to `frontend/node_modules/@pusher/push-notifications-web/package.json` to make it work
- requires two ENV vars to be present:
  - VITE_API_BASE
  - VITE_PUSHER_INSTANCE_ID
  add .env.local with VITE_API_BASE=http://localhost:8000 to work locally
- add `?dev` to the URL to enable development features
