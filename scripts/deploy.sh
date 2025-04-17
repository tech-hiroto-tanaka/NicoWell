#!/bin/bash

# NicoWellアプリのAWS Elastic Beanstalkへのデプロイスクリプト

echo "NicoWellアプリケーションのデプロイを開始します..."

# ビルド実行
echo "アプリケーションをビルドしています..."
npm run build

# デプロイ準備 - 必要なファイルをzipに固める
echo "デプロイパッケージを作成しています..."
mkdir -p deploy

# package.jsonとnpm lockファイルのコピー
cp package.json deploy/
cp package-lock.json deploy/

# ビルド済みファイルをコピー
cp -r dist deploy/

# AWS設定ファイルをコピー
cp -r .ebextensions deploy/
cp -r .elasticbeanstalk deploy/

# 現在のディレクトリに移動して圧縮
cd deploy
zip -r ../nicowell-deploy.zip *
cd ..

echo "デプロイパッケージが作成されました: nicowell-deploy.zip"
echo "次のコマンドでAWS Elastic Beanstalkにデプロイできます:"
echo "aws elasticbeanstalk create-application-version --application-name nicowell --version-label v1-$(date +%Y%m%d%H%M%S) --source-bundle S3Bucket=YOUR_S3_BUCKET,S3Key=nicowell-deploy.zip"
echo "aws elasticbeanstalk update-environment --environment-name nicowell-app --version-label v1-$(date +%Y%m%d%H%M%S)"

echo "デプロイスクリプト終了"