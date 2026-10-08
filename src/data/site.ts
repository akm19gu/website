// サイトに載せる内容はすべてここにまとめてある。
// 作品やリンクを足すときは、このファイルの配列に一件追加するだけでよい。
// 言語で変わる文は { ja, en } の形で両方書く。
import type { ImageMetadata } from 'astro';
import hibizegengaku from '../assets/hibizegengaku.png';
import micaiahHab from '../assets/micaiah-hab.png';
import post251 from '../assets/post251.png';
import dawn from '../assets/dawn.png';
import originals from '../assets/originals.jpg';

export type Lang = 'ja' | 'en';
export type Text = Record<Lang, string>;

export const langs: Lang[] = ['ja', 'en'];

// 各言語のページの置き場所（BASE_URL からの相対パス）
export const langPath: Record<Lang, string> = { ja: '', en: 'en/' };

// 見出しやボタンなど、画面の決まり文句
export const ui = {
  music: { ja: 'つくった音楽', en: 'Music I make' },
  works: { ja: 'いろいろ作った', en: 'Things I built' },
  essays: { ja: 'かいた', en: 'Things I wrote' },
  about: { ja: 'わたしについて', en: 'About me' },
  links: { ja: 'あちこちにいる', en: 'Find me around' },
  pageNav: { ja: 'ページ内リンク', en: 'Sections' },
  langNav: { ja: '言語', en: 'Language' },
  avatarAlt: { ja: 'なかむのアイコン', en: 'Nakam’s avatar' },
} satisfies Record<string, Text>;

export const profile = {
  name: { ja: 'なかむ', en: 'Nakam' },
  subName: { ja: 'Nakam', en: 'なかむ' },
  handle: 'akm19gu',
  catchphrase: 'Composer, Drummer, Writer',
  roles: {
    ja: 'ボカロP / ジャズドラマー / エッセイスト',
    en: 'Vocaloid producer / Jazz drummer / Essayist',
  },
  lead: {
    ja: 'ボーカロイドとジャズ音楽を合体させるため活動中。そのほか、様々に音楽を作る。',
    en: 'On a mission to fuse Vocaloid and jazz — and making all sorts of other music along the way.',
  },
  about: {
    ja: [
      '大分県出身、東京都在住。',
      'ボカロP、ジャズドラマー、エッセイスト。ボーカロイドとジャズ音楽を合体させるため活動中。そのほか、様々に音楽を作る。',
    ],
    en: [
      'Born in Oita, based in Tokyo.',
      'Vocaloid music composer, jazz drummer and weekend essayist just planted. I’m working on bringing Vocaloid and jazz together, and making all kinds of other music too.',
      'Feel free to talk to me — but please go easy on me, as English is my second language. I will try my best to understand you.',
    ],
  } satisfies Record<Lang, string[]>,
};

export type Video = { id: string; title: string; note: Text };

export const videos: Video[] = [
  { id: 'YlE6fyLyZ1g', title: 'エニシダ (Broom)', note: { ja: 'Vocaloid Original MV', en: 'Vocaloid Original MV' } },
  { id: 'dQ2eHhejetQ', title: '貝塚行に乗っちゃった', note: { ja: 'ド級の博多ローカルソング', en: 'A hyper-local song about Hakata' } },
  { id: 'G5aBacp9J0s', title: 'Giant Steps in 13 and 5', note: { ja: 'Giant Steps、クソ変拍子にしてみた', en: 'Giant Steps in ridiculous odd meters' } },
  { id: 'HqFP4MWw17s', title: 'Dawn Brigade Orchestral Project', note: { ja: 'Anime & Game Jazz Cover Music', en: 'Anime & Game Jazz Cover Music' } },
];

// Spotify に埋め込みプレイヤーとして出すアルバム
export const spotifyAlbums = [
  { id: '27L4KpIXDBxGhRYx04dFwY', title: 'リボーン' },
  { id: '3JY5pafQJZpOFDHgWQJMHB', title: 'Post251' },
];

// 2026年10月時点で Spotify・YouTube・hearnow から確認できたリリース（新しい順）。
// date は分かる範囲で 'YYYY-MM-DD'、年しか分からないものは 'YYYY'。
// 曲名は言語を問わず原題のまま出す。
export type Release = {
  title: string;
  kind: 'Album' | 'EP' | 'Single' | 'YouTube';
  date: string;
  artist?: string;
  with?: Text;
  url?: string;
};

export const discography: Release[] = [
  { title: '貝塚行に乗っちゃった (feat. 重音テト)', kind: 'Single', date: '2026-03-27', url: 'https://open.spotify.com/album/3l7oOFUomSVkehMK1dcUwx' },
  { title: '帰っちゃおうかな', kind: 'YouTube', date: '2026-02-19', url: 'https://www.youtube.com/watch?v=oC_r0DZLHdA' },
  { title: 'リボーン (Reborn)', kind: 'EP', date: '2025-11-04', url: 'https://open.spotify.com/album/27L4KpIXDBxGhRYx04dFwY' },
  { title: 'Post251', kind: 'EP', date: '2025-10-26', with: { ja: 'ぱみ', en: 'Pami' }, url: 'https://open.spotify.com/album/3JY5pafQJZpOFDHgWQJMHB' },
  { title: '地獄の沙汰もガチ金次第', kind: 'YouTube', date: '2025-08-25', url: 'https://www.youtube.com/watch?v=p8jzZRMyxzw' },
  { title: 'One minute before', kind: 'YouTube', date: '2025-03-27', url: 'https://www.youtube.com/watch?v=EecEE-qlePo' },
  { title: 'エニシダ (Broom)', kind: 'Single', date: '2024-12-29', url: 'https://open.spotify.com/album/51eNrpxEloNdviplFi5azM' },
  { title: "Autumn Leaves in 'fast five'", kind: 'YouTube', date: '2024-10-10', url: 'https://www.youtube.com/watch?v=4Hg9ceCR3C0' },
  { title: 'When It Rains in April', kind: 'YouTube', date: '2024-09-25', url: 'https://www.youtube.com/watch?v=2cs_fqDl6P8' },
  { title: 'The Boundary Wavers', kind: 'Album', date: '2024', artist: 'Dawn Brigade Orchestral Project', url: 'https://dawnbrigadeorchestralproject.hearnow.com/' },
];

export type Work = { title: Text; description: Text; url: string; image: ImageMetadata; tag: string };

export const works: Work[] = [
  {
    title: { ja: '日々是衒学', en: 'Hibi Kore Gengaku (日々是衒学)' },
    description: {
      ja: '毎日ひとつ、知ると世界の見え方が少し変わる言葉を届ける Web アプリ。ホーム画面に追加して使える。',
      en: 'A web app that serves one word a day — the kind that changes how you see the world a little. Can be added to your home screen. (Japanese)',
    },
    url: 'https://hibizegengaku.akm7339gil.workers.dev/#today',
    image: hibizegengaku,
    tag: 'Web App',
  },
  {
    title: { ja: 'ミカヤとヒットアンドブロー', en: 'Micaiah and Hit & Blow' },
    description: {
      ja: '対戦型ヒットアンドブロー！ Windows 対応。',
      en: 'A head-to-head Hit & Blow game! For Windows.',
    },
    url: 'https://akm19gu.booth.pm/items/7803251',
    image: micaiahHab,
    tag: 'Game',
  },
  {
    title: { ja: 'Post251', en: 'Post251' },
    description: {
      ja: 'コンポーザーのぱみと結成した、実験的DTMジャズユニット「Post251」のウェブサイト。',
      en: 'Website of Post251, an experimental DTM jazz unit I formed with composer Pami.',
    },
    url: 'https://post251.com',
    image: post251,
    tag: 'Unit / Web',
  },
  {
    title: { ja: '暁の楽団 (Dawn Brigade Orchestral Project)', en: 'Dawn Brigade Orchestral Project (暁の楽団)' },
    description: {
      ja: 'アニメ・ゲーム音楽のジャズカバーバンド。1st single album。',
      en: 'A jazz band covering anime and game music. 1st single album.',
    },
    url: 'https://dawnbrigadeorchestralproject.hearnow.com/',
    image: dawn,
    tag: 'Band',
  },
  {
    title: { ja: 'なかむのオリジナル曲', en: 'Original Songs' },
    description: {
      ja: 'オリジナル曲をまとめた YouTube プレイリスト。',
      en: 'A YouTube playlist of my original songs.',
    },
    url: 'https://youtube.com/playlist?list=PLVEV0TxlFVZNUjISM50gPiXm3-yFpQHHo',
    image: originals,
    tag: 'Playlist',
  },
];

// note のエッセイは日本語のみ
export const essays = [
  {
    title: { ja: '装備0で春先の山陰地方に野宿した話', en: 'Camping out in San’in in early spring with zero gear' },
    note: { ja: 'さむかった……', en: 'It was cold… (Japanese)' },
    url: 'https://note.com/nakambungo/n/n2c783c579d03',
  },
  {
    title: { ja: '日記を毎日書き続けて3年が経った話', en: 'Three years of writing a diary every single day' },
    note: { ja: 'なぜか続いた', en: 'Somehow I kept going (Japanese)' },
    url: 'https://note.com/nakambungo/n/n1ca3568fd415',
  },
];

export const timeline: { year: string; text: Text }[] = [
  {
    year: '2019',
    text: {
      ja: '都内私立大学へ進学（政治学専攻）。大学からジャズドラムを始める。',
      en: 'Entered a private university in Tokyo, majoring in political science. Started playing jazz drums.',
    },
  },
  {
    year: '2022',
    text: {
      ja: 'イギリスへ学部交換留学（社会学）。',
      en: 'Undergraduate exchange in the UK (sociology).',
    },
  },
  {
    year: '2023',
    text: {
      ja: '帰国後、バンド「暁の楽団」を結成。',
      en: 'Back in Japan, formed the band Dawn Brigade Orchestral Project (暁の楽団).',
    },
  },
  {
    year: '2024',
    text: {
      ja: 'ボカロPとして活動開始。「暁の楽団」アルバムをリリースし、活動終了。',
      en: 'Started out as a Vocaloid producer. Released an album with Dawn Brigade Orchestral Project, which then wrapped up.',
    },
  },
  {
    year: '2025',
    text: {
      ja: 'ぱみ (@pamiyummy) と実験的DTMジャズユニット「Post251」を結成。M3秋でEP「Post251」を頒布。',
      en: 'Formed the experimental DTM jazz unit Post251 with Pami (@pamiyummy). Released the EP “Post251” at M3 Autumn.',
    },
  },
  {
    year: '2025',
    text: {
      ja: 'EP「リボーン」をリリース。ゲーム「ミカヤとヒットアンドブロー」をリリース。',
      en: 'Released the EP “Reborn” and the game “Micaiah and Hit & Blow”.',
    },
  },
];

export const links: { label: string; note: Text; url: string }[] = [
  { label: 'YouTube', note: { ja: '音楽・MV', en: 'Music Videos' }, url: 'https://youtube.com/@akm19gu' },
  { label: 'Spotify', note: { ja: '配信リリース', en: 'Original Releases' }, url: 'https://open.spotify.com/artist/0qRoYEntr6889CmpD25Cx7' },
  { label: 'Bandcamp', note: { ja: '購入で応援できます', en: 'Get my tracks for support!' }, url: 'https://akm19gu.bandcamp.com/' },
  { label: 'X', note: { ja: '友達募集中', en: 'Random Tweets' }, url: 'https://twitter.com/akm19gu' },
  { label: 'note', note: { ja: 'エッセイ', en: 'Essays (Japanese)' }, url: 'https://note.com/nakambungo' },
  { label: 'Blog', note: { ja: '作曲日記', en: 'Behind the music scenes' }, url: 'https://akm19gu.wordpress.com/' },
  { label: 'BOOTH', note: { ja: 'ショップ', en: 'Shop' }, url: 'https://akm19gu.booth.pm/' },
  { label: 'TikTok', note: { ja: '@akm19gu', en: '@akm19gu' }, url: 'https://www.tiktok.com/@akm19gu' },
];
