# NicoWell デプロイディレクトリ

NicoWellアプリケーションのデプロイに関するファイルとガイドライン

## ディレクトリ構造

- `lambda` - AWS Lambda関数のコード
  - `analysis-function` - 分析関数（ユーザープロフィール分析）
  - `chat-function` - チャット関数（対話処理）
  - `survey-function` - アンケート関数（フィードバック処理）
  - `package.json` - 依存関係定義
  - `create-deployment-packages.sh` - デプロイパッケージ作成スクリプト
  - `test-local.js` - ローカルテスト用スクリプト

## バックエンドデプロイプロセス

1. `DEPLOYMENT_GUIDE.md` の手順に従って、Lambda関数とAPI Gatewayをセットアップします。
2. 各Lambda関数に必要な環境変数を設定します:
   - すべての関数: `OPENAI_API_KEY`
   - アンケート関数: `DATABASE_URL`（オプション）

## フロントエンドデプロイ後の設定

1. AWS Amplifyコンソールで環境変数を設定:
   - キー: `VITE_API_BASE_URL`
   - 値: `https://<API_ID>.execute-api.<リージョン>.amazonaws.com/prod`

2. ビルドを再実行

## ローカルテスト

Lambda関数をローカルでテストするには:

```
cd lambda
npm install
export OPENAI_API_KEY=<あなたのOpenAI APIキー>
node test-local.js
```

## デプロイパッケージの作成

Lambda関数のデプロイパッケージを作成するには:

```
cd lambda
chmod +x create-deployment-packages.sh
./create-deployment-packages.sh
```

これにより、以下のZIPファイルが生成されます:
- `analysis-function.zip`
- `chat-function.zip`
- `survey-function.zip`

これらのZIPファイルをAWS Lambdaコンソールにアップロードしてデプロイできます。