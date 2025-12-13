/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_TITLE: string
  readonly VITE_SITE_TAGLINE: string
  readonly VITE_SITE_DESCRIPTION: string
  readonly VITE_COMPANY_NAME: string
  readonly VITE_CURRENT_YEAR: string
  readonly VITE_HERO_TITLE: string
  readonly VITE_GITHUB_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_FUNCTION_NAME: string
  readonly VITE_SUPABASE_PROJECT_ID: string
  readonly VITE_SUPABASE_PUBLIC_ANON_KEY: string
  readonly VITE_SUPABASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
