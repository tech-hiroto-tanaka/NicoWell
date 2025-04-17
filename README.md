# NicoWell - パーソナライズされたウェルネスアドバイスアプリ

NicoWellは日本語で利用できるパーソナライズされたウェルネスアドバイスを提供するインタラクティブなウェブアプリケーションです。ユーザーの生活習慣やウェルネス目標に基づいて、睡眠、栄養、ストレス管理、運動などの分野で実践的なアドバイスを提供します。

## 機能

- 完全な日本語インターフェース
- ユーザーの生活習慣や健康目標に基づくパーソナライズされた分析
- GSAPを使用したモダンなアニメーションとインタラクション
- AIチャットボットによる詳細なアドバイスと質問対応
- レスポンシブなデザインで様々なデバイスに対応
- ユーザーフィードバックの収集と保存

## 技術スタック

- フロントエンド: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, GSAP
- バックエンド: Node.js, Express
- データベース: PostgreSQL, Drizzle ORM
- AI: OpenAI API (GPT-4o)
- デプロイ: AWS Amplify

## 開発環境のセットアップ

1. リポジトリのクローン:
```
git clone https://github.com/yourusername/nicowell.git
cd nicowell
```

2. 依存関係のインストール:
```
npm install
```

3. 環境変数の設定:
`.env.example`ファイルを`.env`としてコピーし、必要な環境変数を設定します:
```
cp .env.example .env
```
そして`.env`ファイルを編集して、以下の変数を設定してください:
- `DATABASE_URL`: PostgreSQLデータベースの接続URL
- `OPENAI_API_KEY`: OpenAI APIキー
- `PORT`: アプリケーションが実行されるポート（デフォルトは5000）

4. データベーススキーマの適用:
```
npm run db:push
```

5. 開発サーバーの起動:
```
npm run dev
```

## デプロイ (AWS Amplify)

1. AWS Amplifyコンソールで新しいアプリケーションを作成
2. GitHubリポジトリを接続
3. ビルド設定として、このリポジトリのamplify.ymlファイルを使用
4. 必要な環境変数を設定（DATABASE_URL, OPENAI_API_KEY）
5. デプロイを開始

## ライセンス

MIT

## 作者

NicoWell Team