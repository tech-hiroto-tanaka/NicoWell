#!/bin/bash

# AWS Amplifyデプロイ後に実行されるスクリプト
echo "Amplify post-build script running..."

# データベースマイグレーションはスキップ（必要なら後で手動実行）
echo "Skipping database migrations during build phase."

# ビルド出力ディレクトリを確認
if [ ! -d "dist" ]; then
  echo "Error: dist directory not found"
  mkdir -p dist/public
fi

# サンプルの.env.localファイルを作成
echo "Creating sample .env.local file in dist directory..."
cat > dist/.env.local << EOL
# サーバー設定
PORT=5000

# API設定 (フロントエンドにはVITE_API_BASE_URLで設定済み)
# データベース設定
# DATABASE_URL=postgresql://user:password@localhost:5432/nicowell

# OpenAI API Key
# OPENAI_API_KEY=your_key_here
EOL

# 必要なフォルダ構造を確保
mkdir -p dist/public

# index.htmlが存在するか確認
if [ ! -f "dist/public/index.html" ]; then
  echo "Warning: index.html not found in dist/public directory."
fi

# 本番環境でのルーティング用のwebpack処理
echo "Setting up routing for production environment..."

# Procfileをdistディレクトリにコピー
cp Procfile dist/

echo "Setting up environment for production..."
echo "Post-build tasks completed."