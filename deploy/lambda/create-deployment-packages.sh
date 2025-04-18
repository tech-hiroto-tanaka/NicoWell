#!/bin/bash
# Lambda関数のデプロイパッケージを作成するスクリプト

echo "NicoWell Lambda関数のデプロイパッケージを作成します..."

# 現在のディレクトリを保存
CURRENT_DIR=$(pwd)

# スクリプトのディレクトリに移動
cd "$(dirname "$0")"

# 依存関係をインストール
echo "依存関係をインストールしています..."
npm install

# ZIP機能がない場合は手動でファイルをコピーする
echo "デプロイ用のディレクトリを作成しています..."

# 分析関数のデプロイディレクトリ作成
echo "分析関数のデプロイディレクトリを作成しています..."
mkdir -p deploy-packages/analysis-function/node_modules
cp -r analysis-function/index.js deploy-packages/analysis-function/
cp -r node_modules/* deploy-packages/analysis-function/node_modules/

# チャット関数のデプロイディレクトリを作成
echo "チャット関数のデプロイディレクトリを作成しています..."
mkdir -p deploy-packages/chat-function/node_modules
cp -r chat-function/index.js deploy-packages/chat-function/
cp -r node_modules/* deploy-packages/chat-function/node_modules/

# アンケート関数のデプロイディレクトリを作成
echo "アンケート関数のデプロイディレクトリを作成しています..."
mkdir -p deploy-packages/survey-function/node_modules
cp -r survey-function/index.js deploy-packages/survey-function/
cp -r node_modules/* deploy-packages/survey-function/node_modules/

echo "デプロイパッケージの作成が完了しました。"
echo "以下のディレクトリが生成されました："
ls -la deploy-packages/

# zipコマンドがあればZIPファイルを作成
if command -v zip &> /dev/null; then
  echo "ZIPファイルを作成しています..."
  
  # 各関数のZIPファイルを作成
  cd deploy-packages/analysis-function/
  zip -r ../analysis-function.zip .
  cd ../../
  
  cd deploy-packages/chat-function/
  zip -r ../chat-function.zip .
  cd ../../
  
  cd deploy-packages/survey-function/
  zip -r ../survey-function.zip .
  cd ../../
  
  echo "ZIPファイルが作成されました："
  ls -la deploy-packages/*.zip
else
  echo ""
  echo "注意: zipコマンドが利用できないため、ZIPファイルは作成されませんでした。"
  echo "各関数のデプロイには deploy-packages/ 内の各ディレクトリをZIPファイルに圧縮して利用してください。"
fi

# 元のディレクトリに戻る
cd "$CURRENT_DIR"