// analysisFunction - OpenAI APIを使用して分析を実行する関数

const { OpenAI } = require('openai');

exports.handler = async (event) => {
  try {
    // リクエストボディの解析
    const body = JSON.parse(event.body);
    const { userProfile } = body;
    
    if (!userProfile) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
          "Access-Control-Allow-Methods": "POST,OPTIONS"
        },
        body: JSON.stringify({ message: "ユーザープロフィールが必要です" })
      };
    }

    // OpenAI APIクライアントの初期化
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // ユーザープロファイルをJSON文字列に変換
    const userProfileJSON = JSON.stringify(userProfile, null, 2);
    
    // OpenAI APIを呼び出し
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // 最新モデルを使用
      messages: [
        { 
          role: "system", 
          content: `あなたはNicoWellという、やさしく持続可能なウェルネス習慣を推奨するフレンドリーなウェルネスアシスタントです。以下のユーザープロフィールに基づいて、睡眠、栄養、ストレス、または運動の中からONE重点分野を特定してください。そして、彼らの状況に合わせたパーソナライズされた、実行しやすい具体的な推奨事項をONEつ提供してください。あなたの口調は暖かく、サポーティブで、前向きであるべきです。医学的なアドバイスや複雑な提案は避けてください。ユーザーが今日から始められるシンプルなアクションに焦点を当ててください。

ユーザープロフィール:
${userProfileJSON}

以下の形式でJSONレスポンスを返してください:
{
  "focusArea": "sleep|nutrition|stress|movement",
  "insightSummary": "彼らの特定の状況にこの分野が重要である理由を2-3文で説明",
  "recommendedAction": "1-2文で具体的かつ簡単な行動を説明",
  "benefitExplanation": "1-2文でメリットを説明"
}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // レスポンスの解析
    const content = response.choices[0].message.content || '{}';
    const analysisResult = JSON.parse(content);
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: JSON.stringify(analysisResult)
    };
    
  } catch (error) {
    console.error("Analysis error:", error);
    
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: JSON.stringify({ 
        message: "分析の生成中にエラーが発生しました", 
        error: error.message 
      })
    };
  }
};