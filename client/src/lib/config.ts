// アプリケーション設定
const config = {
  // APIのベースURL
  // 開発環境では相対パスを使用し、本番環境では絶対URLを設定
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://0n315z23g8.execute-api.ap-southeast-2.amazonaws.com/prod",
  
  // その他の設定を追加可能
};

export default config;