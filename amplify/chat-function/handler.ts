import { OpenAI } from 'openai';

// APIリクエストとレスポンスの型定義
interface ApiRequest {
  body: {
    userProfile: {
      ageRange: string;
      lifestyle: string;
      sleepDuration: string;
      exerciseFrequency: string;
      wellnessGoals: string[];
      healthConcerns: string[];
    };
    analysisResult?: {
      focusArea: "sleep" | "nutrition" | "stress" | "movement";
      insightSummary: string;
      recommendedAction: string;
      benefitExplanation: string;
    };
    message: string;
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
    const { userProfile, analysisResult, message } = event.body;
    
    if (!message) {
      return {
        statusCode: 400,
        headers: getCorsHeaders(),
        body: JSON.stringify({ message: "メッセージが必要です" })
      };
    }

    // OpenAI APIクライアントの初期化
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // データをJSON文字列に変換
    const userProfileJSON = JSON.stringify(userProfile, null, 2);
    const analysisResultJSON = analysisResult ? JSON.stringify(analysisResult, null, 2) : "分析結果はありません";
    
    // OpenAI APIを呼び出し
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // 最新モデルを使用
      messages: [
        { 
          role: "system", 
          content: `あなたはNicoWellという、やさしく持続可能なウェルネス習慣を推奨するフレンドリーなウェルネスアシスタントです。ユーザーの質問に対して、簡潔で役立つ回答を提供してください。医学的なアドバイスは避け、一般的なウェルネス情報と実践的なヒントに焦点を当ててください。あなたの口調は常に友好的で、励ましになるようにしてください。回答は3-4文程度の短いものにしてください。

ユーザープロフィール:
${userProfileJSON}

以前の分析結果:
${analysisResultJSON}

ユーザーの質問に日本語で応答してください。`
        },
        { role: "user", content: message }
      ]
    });
    
    // レスポンスの取得
    const chatResponse = response.choices[0].message.content || "申し訳ありませんが、回答を生成できませんでした。もう一度お試しください。";
    
    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: JSON.stringify({ response: chatResponse })
    };
    
  } catch (error) {
    console.error("Chat error:", error);
    
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({ 
        message: "チャットレスポンスの生成中にエラーが発生しました", 
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