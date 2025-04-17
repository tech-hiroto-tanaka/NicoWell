// chatFunction - OpenAI APIを使用してチャットレスポンスを生成する関数

const { OpenAI } = require('openai');

exports.handler = async (event) => {
  try {
    // リクエストボディの解析
    const body = JSON.parse(event.body);
    const { userProfile, analysisResult, message } = body;
    
    if (!message) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
          "Access-Control-Allow-Methods": "POST,OPTIONS"
        },
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
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: JSON.stringify({ response: chatResponse })
    };
    
  } catch (error) {
    console.error("Chat error:", error);
    
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: JSON.stringify({ 
        message: "チャットレスポンスの生成中にエラーが発生しました", 
        error: error.message 
      })
    };
  }
};