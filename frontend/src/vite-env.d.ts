/// <reference types="vite/client" />
/// <reference types="@google/model-viewer" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
