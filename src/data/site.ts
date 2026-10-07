// サイトに載せる内容はすべてここにまとめてある。
// 作品やリンクを足すときは、このファイルの配列に一件追加するだけでよい。
import type { ImageMetadata } from 'astro';
import hibizegengaku from '../assets/hibizegengaku.png';
import mikayaHab from '../assets/mikaya-hab.png';
import post251 from '../assets/post251.png';
import dawn from '../assets/dawn.png';
import originals from '../assets/originals.jpg';

export const profile = {
  name: 'なかむ',
  nameEn: 'Nakam',
  handle: 'akm19gu',
  catchphrase: 'Composer, Drummer, Writer',
  roles: ['ボカロP', 'ジャズドラマー', 'エッセイスト'],
  lead: 'ボーカロイドとジャズ音楽を合体させるため活動中。そのほか、様々に音楽を作る。',
  aboutJa: [
    '大分県出身、東京都在住。',
    'ボカロP、ジャズドラマー、エッセイスト。ボーカロイドとジャズ音楽を合体させるため活動中。そのほか、様々に音楽を作る。',
  ],
  aboutEn: [
    'Vocaloid music composer, jazz drummer and weekend essayist just planted.',
    'Feel free to talk to me — but please go easy on me, as English is my second language. I will try my best to understand you.',
  ],
};

export type Video = { id: string; title: string; note: string };

export const videos: Video[] = [
  { id: 'YlE6fyLyZ1g', title: 'エニシダ (Broom)', note: 'Vocaloid Original MV' },
  { id: 'dQ2eHhejetQ', title: '貝塚行に乗っちゃった', note: 'ド級の博多ローカルソング' },
  { id: 'G5aBacp9J0s', title: 'Giant Steps in 13 and 5', note: 'Giant Steps、クソ変拍子にしてみた' },
  { id: 'HqFP4MWw17s', title: 'Dawn Brigade Orchestral Project', note: 'Anime & Game Jazz Cover Music' },
];

// Spotify に埋め込みプレイヤーとして出すアルバム
export const spotifyAlbums = [
  { id: '27L4KpIXDBxGhRYx04dFwY', title: 'リボーン' },
  { id: '3JY5pafQJZpOFDHgWQJMHB', title: 'Post251' },
];

export type Release = { title: string; kind: string; year: number; with?: string; url?: string };

export const discography: Release[] = [
  { title: 'Reborn（リボーン）', kind: 'EP', year: 2025, url: 'https://open.spotify.com/album/27L4KpIXDBxGhRYx04dFwY' },
  { title: 'Post251', kind: 'EP', year: 2025, with: 'ぱみ (@pamiyummy)', url: 'https://open.spotify.com/album/3JY5pafQJZpOFDHgWQJMHB' },
  { title: 'The Boundary Wavers', kind: 'Album', year: 2024 },
  { title: 'Broom（エニシダ）', kind: 'Single', year: 2024, url: 'https://youtu.be/YlE6fyLyZ1g' },
  { title: 'Tunnel Lamps', kind: 'Single', year: 2024 },
  { title: 'When it rains in April', kind: 'Single', year: 2024 },
  { title: "Autumn Leaves but it's 'fast five'", kind: 'Single', year: 2024 },
];

export type Work = { title: string; description: string; url: string; image: ImageMetadata; tag: string };

export const works: Work[] = [
  {
    title: '日々是衒学',
    description: '毎日ひとつ、知ると世界の見え方が少し変わる言葉を届ける Web アプリ。ホーム画面に追加して使える。',
    url: 'https://hibizegengaku.akm7339gil.workers.dev/#today',
    image: hibizegengaku,
    tag: 'Web App',
  },
  {
    title: 'ミカヤとヒットアンドブロー',
    description: '対戦型ヒットアンドブロー！ Windows 対応。',
    url: 'https://akm19gu.booth.pm/items/7803251',
    image: mikayaHab,
    tag: 'Game',
  },
  {
    title: 'Post251',
    description: 'コンポーザーのぱみと結成した、実験的DTMジャズユニット「Post251」のウェブサイト。',
    url: 'https://post251.com',
    image: post251,
    tag: 'Unit / Web',
  },
  {
    title: '暁の楽団 (Dawn Brigade Orchestral Project)',
    description: 'アニメ・ゲーム音楽のジャズカバーバンド。1st single album。',
    url: 'https://dawnbrigadeorchestralproject.hearnow.com/',
    image: dawn,
    tag: 'Band',
  },
  {
    title: 'なかむのオリジナル曲',
    description: 'オリジナル曲をまとめた YouTube プレイリスト。',
    url: 'https://youtube.com/playlist?list=PLVEV0TxlFVZNUjISM50gPiXm3-yFpQHHo',
    image: originals,
    tag: 'Playlist',
  },
];

export const essays = [
  { title: '装備0で春先の山陰地方に野宿した話', note: 'さむかった……', url: 'https://note.com/nakambungo/n/n2c783c579d03' },
  { title: '日記を毎日書き続けて3年が経った話', note: 'なぜか続いた', url: 'https://note.com/nakambungo/n/n1ca3568fd415' },
];

export const timeline = [
  { year: '2019', text: '都内私立大学へ進学（政治学専攻）。大学からジャズドラムを始める。' },
  { year: '2022', text: 'イギリスへ学部交換留学（社会学）。' },
  { year: '2023', text: '帰国後、バンド「暁の楽団」を結成。' },
  { year: '2024', text: 'ボカロPとして活動開始。「暁の楽団」アルバムをリリースし、活動終了。' },
  { year: '2025', text: 'ぱみ (@pamiyummy) と実験的DTMジャズユニット「Post251」を結成。M3秋でEP「Post251」を頒布。' },
  { year: '2025', text: 'EP「リボーン」をリリース。ゲーム「ミカヤとヒットアンドブロー」をリリース。' },
];

export const links = [
  { label: 'YouTube', note: '音楽 / Music Videos', url: 'https://youtube.com/@akm19gu' },
  { label: 'Spotify', note: 'Original Releases', url: 'https://open.spotify.com/artist/0qRoYEntr6889CmpD25Cx7' },
  { label: 'Bandcamp', note: 'Get my tracks for support!', url: 'https://akm19gu.bandcamp.com/' },
  { label: 'X', note: '友達募集中 / Random Tweets', url: 'https://twitter.com/akm19gu' },
  { label: 'note', note: 'エッセイ / Essays (JP)', url: 'https://note.com/nakambungo' },
  { label: 'Blog', note: '作曲日記 / Behind the music scenes', url: 'https://akm19gu.wordpress.com/' },
  { label: 'BOOTH', note: 'Shop', url: 'https://akm19gu.booth.pm/' },
  { label: 'TikTok', note: '@akm19gu', url: 'https://www.tiktok.com/@akm19gu' },
];
