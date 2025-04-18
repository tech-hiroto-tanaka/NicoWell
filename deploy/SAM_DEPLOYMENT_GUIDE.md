# AWS SAMを使用したNicoWellバックエンドのデプロイガイド

このガイドでは、AWS SAM（Serverless Application Model）を使用してNicoWellアプリケーションのバックエンドをデプロイする方法を説明します。

## 前提条件

1. AWS CLIのインストールと設定
   ```
   pip install awscli
   aws configure
   ```

2. AWS SAM CLIのインストール
   ```
   pip install aws-sam-cli
   ```

3. Node.jsとnpmのインストール（v18以上推奨）

## デプロイ手順

### 1. デプロイパッケージの準備

Lambda関数のデプロイパッケージを作成します：

```bash
cd deploy/lambda
chmod +x create-deployment-packages.sh
./create-deployment-packages.sh
```

### 2. SAMパッケージのビルド

SAMテンプレートからデプロイパッケージをビルドします：

```bash
cd deploy
sam build -t sam-template.yaml
```

### 3. SAMパッケージのデプロイ

ビルドしたパッケージをAWSにデプロイします。初回実行時は`--guided`オプションを使用して対話式設定を行います：

```bash
sam deploy --guided
```

プロンプトに従って以下の情報を入力してください：

- **Stack Name**: `nicowell-backend` （任意のスタック名）
- **AWS Region**: デプロイするリージョン（例: `ap-northeast-1`）
- **Parameter OpenAIApiKey**: OpenAI APIキー
- **Confirm changes before deploy**: `Y`（変更の確認）
- **Allow SAM CLI IAM role creation**: `Y`（IAMロール作成の許可）
- **Disable rollback**: `N`（ロールバックを無効にしない）
- **Save arguments to samconfig.toml**: `Y`（設定の保存）

### 4. デプロイの確認

デプロイが完了すると、出力にAPI GatewayのエンドポイントURLが表示されます。このURLをメモしておきます。

```
---------------------------------------------------------------------------------------------------------
Outputs
---------------------------------------------------------------------------------------------------------
Key                 ApiUrl
Description         API Gateway エンドポイントURL
Value               https://xxxxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/prod
---------------------------------------------------------------------------------------------------------
```

### 5. フロントエンドの設定更新

AWS Amplifyコンソールで、環境変数を設定します：

- キー: `VITE_API_BASE_URL`
- 値: SAMデプロイの出力で表示されたAPI GatewayのURL

### 6. デプロイの更新

コードを変更した場合は、再度ビルドとデプロイを行います：

```bash
cd deploy
sam build -t sam-template.yaml
sam deploy
```

## トラブルシューティング

### CloudFormationスタックの削除

デプロイしたリソースを削除するには：

```bash
aws cloudformation delete-stack --stack-name nicowell-backend
```

### Lambda関数のログの確認

CloudWatchでLambda関数のログを確認するには：

```bash
aws logs get-log-events --log-group-name /aws/lambda/[Lambda関数名] --log-stream-name [ログストリーム名]
```

または、AWS Management Consoleの CloudWatch > Log Groups から確認できます。

### CORSの問題

ブラウザのコンソールでCORS関連のエラーが表示される場合は、API GatewayのCORS設定を確認してください。必要に応じて、SAMテンプレートのCORS設定を更新し、再デプロイします。