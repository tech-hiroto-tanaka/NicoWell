#!/bin/bash

# AWS Amplifyデプロイ後に実行されるスクリプト
echo "Amplify post-build script running..."

# データベースマイグレーションはスキップ（必要なら後で手動実行）
echo "Skipping database migrations during build phase."

# ビルド出力ディレクトリを確認
if [ ! -d "dist" ]; then
  echo "Error: dist directory not found"
  mkdir -p dist
fi

# index.htmlが存在するか確認
if [ ! -f "dist/public/index.html" ]; then
  echo "Warning: index.html not found in dist/public directory. Copying from client/ folder..."
  # クライアントのindex.htmlをdistにコピー
  if [ -f "client/index.html" ]; then
    mkdir -p dist/public
    cp client/index.html dist/public/
    echo "index.html copied successfully."
  else
    echo "Error: client/index.html not found"
  fi
fi

# サーバーコードをビルド
echo "Building server code..."
mkdir -p dist/server
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server
cp Procfile dist/server/

# サーバーディレクトリにパッケージファイルをコピー
cp package.json dist/server/
cp package-lock.json dist/server/

echo "Setting up environment for production..."
echo "Post-build tasks completed."