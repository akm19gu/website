// @ts-check
import { defineConfig } from 'astro/config';

// Cloudflare Pages のビルドでは CF_PAGES=1 が入る。
// そのときは https://akm19gu.pages.dev/ の直下で、
// それ以外は GitHub Pages（https://akm19gu.github.io/website/）で公開する前提にする。
const onCloudflare = process.env.CF_PAGES === '1';

export default defineConfig(
  onCloudflare
    ? { site: 'https://akm19gu.pages.dev' }
    : { site: 'https://akm19gu.github.io', base: '/website' },
);
