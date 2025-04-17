# NicoWell アプリケーション

パーソナライズされたウェルネスアドバイスを提供するインタラクティブなウェブアプリケーション。
すべての機能が日本語で提供されています。

## 機能

- ユーザープロフィールに基づいたパーソナライズされたウェルネス分析
- OpenAI APIを使用したチャットボット機能
- GSAPによるモダンなアニメーション
- PostgreSQLデータベースによるデータ保存

## 環境変数

Amplifyにデプロイする際には、以下の環境変数を設定してください：

### 必須の環境変数

- `OPENAI_API_KEY`: OpenAI APIキー（GPT-4oモデルを使用可能なもの）
- `DATABASE_URL`: PostgreSQLデータベースの接続URL

### データベース関連の環境変数

以下は`DATABASE_URL`から自動的に分解されますが、明示的に設定することもできます：

- `PGHOST`: PostgreSQLホスト名
- `PGPORT`: PostgreSQLポート番号
- `PGUSER`: PostgreSQLユーザー名
- `PGPASSWORD`: PostgreSQLパスワード
- `PGDATABASE`: PostgreSQLデータベース名

## デプロイ手順

1. GitHubリポジトリにコードをプッシュ
2. AWS Amplifyコンソールでリポジトリを接続
3. ビルド設定は`amplify.yml`を使用
4. 環境変数を設定
5. デプロイを開始

## 開発環境の準備

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# データベースマイグレーションの実行
npm run db:push
```