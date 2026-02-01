// This script adds the initial 3 projects to Firestore
// Run once from browser console after logging in to /admin

const initialProjects = [
    {
        title: 'AIナレッジチャット',
        description: 'PDF、Excel、Word、画像などのファイルをアップロードするだけで、その内容に基づいた回答を提供するRAGシステムです。TF-IDFとキーワードマッチングを組み合わせたハイブリッド検索により、日本語に最適化された高精度な情報検索を実現。回答には引用元ファイル名と信頼度スコアを明示し、ハルシネーションを抑制します。社内ヘルプデスク、契約書レビュー、学習アシスタントなど幅広い用途に対応。高価なVector DBを使わず、FirestoreとTF-IDFの組み合わせで完全無料での運用を実現した、コスト効率の高い設計が特徴です。',
        url: 'https://rag-search-c85d8.web.app',
        imageUrl: '/プロジェクト_RAGチャット/RAG①.jpg',
        tags: ['RAG', 'Gemini 2.5', 'Firebase', 'Python'],
        published: true,
        createdAt: '2025-12-01T00:00:00.000Z'
    },
    {
        title: '経営コックピット',
        description: '企業の経営データを一元管理・可視化するBIダッシュボードです。解約防止（ChurnGuard）、研修記録（CoachFlow）、サポート管理（CS Mate）、顧客360°ビュー、LINEマーケティングのABテスト、請求消込（ReconcileAI）など複数の専門モジュールを統合。経営会議でのKPI確認、カスタマーサクセスチームの日次業務、マーケティングキャンペーンの最適化、経理チームの月次決算など、様々な経営課題に対応します。AI分析機能でデータに基づいた意思決定を支援します。',
        url: 'https://company-board-2760c.web.app',
        imageUrl: '/プロジェクト_経営ダッシュボード/ダッシュボード①.jpg',
        tags: ['BI', 'Firebase Auth', 'Gemini API', 'React'],
        published: true,
        createdAt: '2025-11-15T00:00:00.000Z'
    },
    {
        title: 'Scholar AI',
        description: '最先端のAI技術を活用し、研究トレンドの調査・論文分析・アイデア創出を支援する研究支援アプリです。1回のキーワード入力で、メタ分析、基礎研究、応用研究を幅広く収集し、分野全体の「現状」「強み」「課題」「推奨読書順序」をAIが総合的に分析・提示。各論文への〇×評価、検索結果のコンテキストを保持したAIチャット、高機能な履歴管理パネルを搭載。技術的な深掘りからアナロジー思考によるアイデア創出まで、研究者の知的作業を強力にサポートします。',
        url: 'https://dissertation-research-9946c.web.app',
        imageUrl: '/プロジェクト_論文検索/論文検索①.jpg',
        tags: ['AI Research', 'Gemini 2.5', 'TypeScript', 'Vite'],
        published: true,
        createdAt: '2025-10-20T00:00:00.000Z'
    }
];

// Usage: 
// 1. Go to /admin and log in with Google
// 2. Open browser DevTools console
// 3. Paste and run this script
// 
// The projects will be added via the existing useWebApps hook
// Or use Firebase Console to add them directly

console.log('Initial projects to add:', initialProjects);
console.log('Add these manually via /admin interface or Firebase Console');
