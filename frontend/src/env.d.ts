/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_PUSHER_INSTANCE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
