#!/bin/bash

# API Gateway設定スクリプト
# このスクリプトはAmplifyデプロイ中に実行され、APIプロキシを設定します

echo "Setting up API Gateway for NicoWell application..."

# ビルド出力ディレクトリを作成
mkdir -p dist/server

# サーバーファイルをビルド
echo "Building server files..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server

# Procfileを作成（Amplifyがwebサーバーを起動するために使用）
echo "Creating Procfile for API server..."
echo "web: node dist/server/index.js" > dist/server/Procfile

echo "API setup completed successfully."