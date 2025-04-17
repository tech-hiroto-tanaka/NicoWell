# NicoWell デプロイガイド

このガイドでは、NicoWellアプリケーションをAWSにデプロイする手順を説明します。フロントエンドはAWS Amplifyで、バックエンドはLambda関数としてデプロイします。

## 前提条件

- AWSアカウント
- AWS CLI（インストール済み、設定済み）
- Node.js v18以降

## バックエンドのデプロイ（Lambda + API Gateway）

### 1. Lambda関数のデプロイ

各Lambda関数を個別にデプロイします。

#### 共通準備手順

1. `/deploy/lambda` ディレクトリに移動
2. 依存関係をインストール:
   ```
   npm install
   ```

#### 分析関数のデプロイ

1. `analysis-function` ディレクトリに移動
2. 依存関係を含むzipパッケージを作成:
   ```
   zip -r analysis-function.zip ../node_modules index.js
   ```
3. AWS Lambda関数を作成:
   ```
   aws lambda create-function \
     --function-name NicoWell-Analysis \
     --runtime nodejs18.x \
     --handler index.handler \
     --zip-file fileb://analysis-function.zip \
     --role arn:aws:iam::<アカウントID>:role/lambda-execution-role
   ```
4. 環境変数の設定:
   ```
   aws lambda update-function-configuration \
     --function-name NicoWell-Analysis \
     --environment "Variables={OPENAI_API_KEY=<OpenAI APIキー>}"
   ```

#### チャット関数のデプロイ

1. `chat-function` ディレクトリに移動
2. 依存関係を含むzipパッケージを作成:
   ```
   zip -r chat-function.zip ../node_modules index.js
   ```
3. AWS Lambda関数を作成:
   ```
   aws lambda create-function \
     --function-name NicoWell-Chat \
     --runtime nodejs18.x \
     --handler index.handler \
     --zip-file fileb://chat-function.zip \
     --role arn:aws:iam::<アカウントID>:role/lambda-execution-role
   ```
4. 環境変数の設定:
   ```
   aws lambda update-function-configuration \
     --function-name NicoWell-Chat \
     --environment "Variables={OPENAI_API_KEY=<OpenAI APIキー>}"
   ```

#### アンケート関数のデプロイ

1. `survey-function` ディレクトリに移動
2. 依存関係を含むzipパッケージを作成:
   ```
   zip -r survey-function.zip ../node_modules index.js
   ```
3. AWS Lambda関数を作成:
   ```
   aws lambda create-function \
     --function-name NicoWell-Survey \
     --runtime nodejs18.x \
     --handler index.handler \
     --zip-file fileb://survey-function.zip \
     --role arn:aws:iam::<アカウントID>:role/lambda-execution-role
   ```
4. 環境変数の設定:
   ```
   aws lambda update-function-configuration \
     --function-name NicoWell-Survey \
     --environment "Variables={DATABASE_URL=<データベースURL>}"
   ```

### 2. API Gatewayの設定

1. RESTful APIを作成:
   ```
   aws apigateway create-rest-api --name "NicoWell-API" --description "NicoWell application API"
   ```

2. ルート（/）リソースIDを取得:
   ```
   aws apigateway get-resources --rest-api-id <API_ID>
   ```

3. 各エンドポイントのリソースを作成:
   ```
   aws apigateway create-resource --rest-api-id <API_ID> --parent-id <ROOT_RESOURCE_ID> --path-part "analyze"
   aws apigateway create-resource --rest-api-id <API_ID> --parent-id <ROOT_RESOURCE_ID> --path-part "chat"
   aws apigateway create-resource --rest-api-id <API_ID> --parent-id <ROOT_RESOURCE_ID> --path-part "survey"
   ```

4. 各リソースにPOSTとOPTIONSメソッドを追加

5. Lambda関数とAPI Gatewayメソッドを統合

6. CORSを有効化

7. APIをデプロイ:
   ```
   aws apigateway create-deployment --rest-api-id <API_ID> --stage-name prod
   ```

## フロントエンドの設定

1. AWS Amplifyコンソールで、環境変数を設定:
   - キー: `VITE_API_BASE_URL`
   - 値: `https://<API_ID>.execute-api.<リージョン>.amazonaws.com/prod`

2. ビルドを再実行

## テスト

1. デプロイされたフロントエンドURLにアクセス
2. アプリケーションが正常に動作することを確認
3. バックエンドとの通信が正常に行われることを確認

## トラブルシューティング

- Lambda関数のCloudWatchログを確認
- API Gatewayのアクセスログを確認
- CORSヘッダーが正しく設定されていることを確認