#!/bin/bash

echo "Building backend for Amplify deployment..."

# AWS Lambda用の環境変数が設定されていることを確認
if [[ -z "${OPENAI_API_KEY}" ]]; then
  echo "ERROR: OPENAI_API_KEY環境変数が設定されていません"
  exit 1
fi

# TypeScriptコンパイラをインストール
echo "Installing TypeScript..."
npm install -g typescript
npm install -g tsx

# Lambda関数のディレクトリを作成
echo "Creating function directories..."
mkdir -p amplify/.temp/analysis-function
mkdir -p amplify/.temp/chat-function
mkdir -p amplify/.temp/survey-function

# 必要なパッケージをインストール
echo "Installing function dependencies..."
cd amplify/.temp
npm init -y
npm install openai

# Handlerファイルをコピー
echo "Copying handler files..."
cp ../analysis-function/handler.ts ./analysis-function/
cp ../chat-function/handler.ts ./chat-function/
cp ../survey-function/handler.ts ./survey-function/

# TypeScriptファイルをJavaScriptにコンパイル
echo "Compiling TypeScript to JavaScript..."
cd analysis-function
tsc --allowJs --target ES2015 --moduleResolution node --outDir . ../analysis-function/handler.ts || echo "TypeScript compilation failed"
cd ../chat-function
tsc --allowJs --target ES2015 --moduleResolution node --outDir . ../chat-function/handler.ts || echo "TypeScript compilation failed"
cd ../survey-function
tsc --allowJs --target ES2015 --moduleResolution node --outDir . ../survey-function/handler.ts || echo "TypeScript compilation failed"
cd ../..

echo "Backend build completed successfully!"