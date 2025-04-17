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
  echo "Warning: index.html not found in dist/public directory."
fi

# Procfileをdistディレクトリにコピー
cp Procfile dist/

echo "Setting up environment for production..."
echo "Post-build tasks completed."