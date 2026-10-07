// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages（https://akm19gu.github.io/website/）で公開する前提の設定。
// 独自ドメインに移すときは site を書き換えて base を消す。
export default defineConfig({
  site: 'https://akm19gu.github.io',
  base: '/website',
});
