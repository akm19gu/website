# なかむ (Nakam) — portfolio

Composer, Drummer, Writer。[Astro](https://astro.build/) で作った静的サイト。

## ローカルで動かす

Node.js 22.12 以上が必要。

```sh
npm install
npm run dev      # http://localhost:4321/（日本語）と /en/（英語）で確認
npm run build    # dist/ に書き出し
```

## 内容を更新する

載せている内容はほぼすべて `src/data/site.ts` にまとまっている。
言語で変わる文は `{ ja: '…', en: '…' }` の形で、日本語と英語の両方を書く。

- 動画を足す → `videos` に YouTube の動画 ID を追加
- 作品を足す → 画像を `src/assets/` に置いて、`works` に追加
- リリースを足す → `discography` に追加
- リンクを足す → `links` に追加

ページは日本語が `/`、英語が `/en/`。どちらも中身は `src/components/Home.astro` で、言語だけを切り替えている。

- 各セクションの並びと見た目 → `src/components/Home.astro`
- 色・フォント・`<head>` のタグ → `src/layouts/Base.astro`

## 公開（Cloudflare Pages）

https://akm19gu.pages.dev/

Cloudflare Pages にこのリポジトリをつないであり、`main` への push ごとにビルドして公開する。

- Framework preset：Astro
- Build command：`npm run build`
- Build output directory：`dist`
- Node.js のバージョンは `.node-version` で指定している
