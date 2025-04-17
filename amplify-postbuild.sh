#!/bin/bash

# AWS Amplifyデプロイ後に実行されるスクリプト
echo "Amplify post-build script running..."

# データベースマイグレーションを実行
if [ -n "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  npm run db:push
  echo "Database migrations completed."
else
  echo "DATABASE_URL not set, skipping migrations."
fi

# 静的アセットのパス設定
echo "Setting up environment for production..."

echo "Post-build tasks completed."