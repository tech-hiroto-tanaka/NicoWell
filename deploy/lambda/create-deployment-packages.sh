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

# 分析関数のデプロイパッケージを作成
echo "分析関数のデプロイパッケージを作成しています..."
cd analysis-function
zip -r ../analysis-function.zip ../node_modules index.js
cd ..

# チャット関数のデプロイパッケージを作成
echo "チャット関数のデプロイパッケージを作成しています..."
cd chat-function
zip -r ../chat-function.zip ../node_modules index.js
cd ..

# アンケート関数のデプロイパッケージを作成
echo "アンケート関数のデプロイパッケージを作成しています..."
cd survey-function
zip -r ../survey-function.zip ../node_modules index.js
cd ..

echo "デプロイパッケージの作成が完了しました。"
echo "以下のファイルが生成されました："
ls -la *.zip

# 元のディレクトリに戻る
cd "$CURRENT_DIR"