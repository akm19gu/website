// @ts-check
import { defineConfig } from 'astro/config';

// Cloudflare Pages のビルドでは CF_PAGES=1 が入る。
// そのときはルート直下（https://○○.pages.dev/）で、
// それ以外は GitHub Pages（https://akm19gu.github.io/website/）で公開する前提にする。
const onCloudflare = process.env.CF_PAGES === '1';

export default defineConfig(
  onCloudflare
    ? { site: process.env.CF_PAGES_URL }
    : { site: 'https://akm19gu.github.io', base: '/website' },
);
