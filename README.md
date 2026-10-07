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

## 公開（GitHub Pages）

`main` ブランチに push すると `.github/workflows/deploy.yml` がビルドして公開する。
初回だけ、リポジトリの Settings → Pages → Build and deployment の Source を「GitHub Actions」にしておく。

公開先は `https://akm19gu.github.io/website/`。独自ドメインに移すときは `astro.config.mjs` の `site` を書き換え、`base` を消す。
