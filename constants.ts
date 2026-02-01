/*
 * -------------------------------------------------------------------------
 * HOW TO UPDATE CONTENT:
 * 1. Go to the site, press Ctrl+Shift+E to open the editor.
 * 2. Edit text and upload images in the CMS.
 * 3. Click "COPY JSON" in the top right.
 * 4. Paste the copied code below, replacing "export const DEFAULT_CONTENT = ...".
 * -------------------------------------------------------------------------
 */

import { SiteContent } from './types';

// Noise texture as inline data URI (shared across components)
export const NOISE_TEXTURE_SVG = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

export const DEFAULT_IMAGES = [
  "https://picsum.photos/id/1/800/450",
  "https://picsum.photos/id/26/800/450",
  "https://picsum.photos/id/48/800/450",
  "https://picsum.photos/id/58/800/450"
];

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    nameJa: "鈴木 智久",
    nameEn: "Suzuki Tomohisa",
    title: "選択肢を整理し、後悔しにくい決断をつくる",
    subtitle: "データサイエンス × 意思決定デザイン",
    images: DEFAULT_IMAGES
  },
  intro: {
    title: "はじめまして",
    body: `こんにちは、鈴木智久です。\nデータサイエンティストとして、AI・データ分析・生成AIを活用した\n意思決定支援や業務設計に携わっています。\n\n技術そのものよりも、\n\n「人が迷う場面で、どうすれば判断しやすくなるか」\n\nを考える時間がいちばん長いタイプです。`,
    highlight: "「人が迷う場面で、どうすれば判断しやすくなるか」"
  },
  whatIDo: {
    title: "何をしている人？",
    items: [
      "データやAIを使った意思決定・業務改善の設計",
      "生成AI（LLM）を活用した実務向けアプリケーションや仕組みづくり",
      "人や組織の「感覚・経験・暗黙知」を構造・指標・言葉に翻訳すること"
    ],
    note: "「AIを入れること」よりも、\u201C何を決めたいのかを整理すること\u201Dを大切にしています。"
  },
  stance: {
    title: "考え方のスタンス",
    items: [
      "正解は一つとは限らない",
      "だからこそ、条件を明確にする",
      "いきなり大きく決めず、小さく試す"
    ],
    conclusion: "結論は、だいたい条件つき。\n意思決定は、比較できる形にすると楽になると考えています。"
  },
  skills: {
    title: "得意なこと",
    items: [
      "複雑な話を、整理して見える化する",
      "感情的・抽象的な議論を、構造で翻訳する",
      "技術とビジネス、思考と実装の橋渡し",
      "「何をやらないか」を含めて設計すること"
    ]
  },
  values: {
    title: "仕事で大切にしていること",
    items: [
      "断言しすぎない",
      "でも、曖昧なまま放置しない",
      "失敗したときの\u201Cやめどき\u201Dを先に決める",
      "後悔しにくい選択肢を増やすことが、良い意思決定につながると考えています。"
    ]
  },
  personality: {
    title: "少しだけ人となり",
    items: [
      "ロジックは好きですが、冷たい判断は好みません",
      "便利さの裏にある「失われた前提」を考えがちです",
      "難しい話を、できるだけわかりやすく伝えたいタイプです"
    ]
  },
  copy: {
    main: "正解を押しつけるより、後悔しにくい選択肢を整える。",
    sub: [
      "比較できれば、決断は少し楽になる",
      "結論は条件つき。その方が、現実に強い",
      "迷いは才能不足ではなく、設計の問題かもしれません"
    ]
  },
  footer: {
    message: ""
  }
};
