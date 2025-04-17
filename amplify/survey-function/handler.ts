// APIリクエストとレスポンスの型定義
interface ApiRequest {
  body: {
    satisfaction: number;
    feasibility: number;
    email?: string;
    userProfile?: Record<string, any>;
    analysisResults?: Record<string, any>;
  };
  headers?: Record<string, string>;
}

interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export const handler = async (event: ApiRequest): Promise<ApiResponse> => {
  try {
    // リクエストボディの解析
    const { satisfaction, feasibility, email, userProfile, analysisResults } = event.body;
    
    if (!satisfaction || !feasibility) {
      return {
        statusCode: 400,
        headers: getCorsHeaders(),
        body: JSON.stringify({ message: "満足度と実行可能性の評価が必要です" })
      };
    }

    // ここでDynamoDBなどにデータを保存する処理を追加
    // 簡略化のため、ここではログに出力するだけ
    console.log("Survey data received:", {
      satisfaction,
      feasibility,
      email: email || "提供されていません",
      userProfile: userProfile ? "提供されています" : "提供されていません",
      analysisResults: analysisResults ? "提供されています" : "提供されていません"
    });
    
    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: JSON.stringify({ message: "フィードバックを受け取りました。ありがとうございます！" })
    };
    
  } catch (error) {
    console.error("Survey error:", error);
    
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({ 
        message: "アンケートの送信中にエラーが発生しました", 
        error: error.message 
      })
    };
  }
};

// CORSヘッダーを生成するヘルパー関数
function getCorsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
  };
}