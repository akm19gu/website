# なかむ (Nakam) — portfolio

Composer, Drummer, Writer。[Astro](https://astro.build/) で作った静的サイト。

## ローカルで動かす

Node.js 22.12 以上が必要。

```sh
npm install
npm run dev      # http://localhost:4321/website/ で確認
npm run build    # dist/ に書き出し
```

## 内容を更新する

載せている内容はほぼすべて `src/data/site.ts` にまとまっている。

- 動画を足す → `videos` に YouTube の動画 ID を追加
- 作品を足す → 画像を `src/assets/` に置いて、`works` に追加
- リリースを足す → `discography` に追加
- リンクを足す → `links` に追加

見た目は `src/pages/index.astro`（各セクション）と `src/layouts/Base.astro`（色・フォント）。

## 公開

### Cloudflare Pages（akm19gu.pages.dev）

Cloudflare Pages にこのリポジトリをつないで、`main` への push ごとにビルドする。

- Framework preset：Astro
- Build command：`npm run build`
- Build output directory：`dist`
- Node.js のバージョンは `.node-version` で指定している

Cloudflare のビルドでは `CF_PAGES=1` が入るので、`astro.config.mjs` がルート直下（`base` なし）向けに切り替わる。

### GitHub Pages（akm19gu.github.io/website）

`main` に push すると `.github/workflows/deploy.yml` がビルドして公開する。
Cloudflare Pages に移りきったら、このワークフローは消してよい。
