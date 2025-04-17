#!/bin/bash

echo "Building backend for Amplify deployment..."

# AWS Lambda用の環境変数が設定されていることを確認
if [[ -z "${OPENAI_API_KEY}" ]]; then
  echo "ERROR: OPENAI_API_KEY環境変数が設定されていません"
  exit 1
fi

# Lambda関数のディレクトリを作成
mkdir -p dist/functions/analysis-function
mkdir -p dist/functions/chat-function
mkdir -p dist/functions/survey-function

# Handlerファイルをコピー
cp amplify/analysis-function/handler.ts dist/functions/analysis-function/
cp amplify/chat-function/handler.ts dist/functions/chat-function/
cp amplify/survey-function/handler.ts dist/functions/survey-function/

echo "Backend build completed successfully!"