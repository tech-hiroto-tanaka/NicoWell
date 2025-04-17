const { OpenAI } = require('openai');

// ユーザーメッセージを受け取り、チャットレスポンスを生成する関数
const generateChatResponse = async (userProfile, analysisResult, message) => {
  // OpenAIクライアントの初期化
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    // チャットの文脈を構築するためのプロンプト
    const systemPrompt = `あなたはニコ（NicoWell）という名前の日本語を話す健康アドバイザーです。
    ユーザーの健康とウェルネスに関するチャットサポートを行います。
    
    ユーザーのプロフィール情報とAI分析の結果を参考にして、個人に合ったアドバイスを提供してください。
    常に敬語で、励ましと理解を示しながら、短く具体的な回答を心がけてください。
    
    回答は必ず日本語でお願いします。

    ユーザープロフィール:
    ${JSON.stringify(userProfile, null, 2)}
    
    分析結果:
    ${JSON.stringify(analysisResult, null, 2)}`;

    // APIリクエストの実行
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 1000,
    });

    // レスポンスの解析
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API呼び出し中にエラーが発生しました:', error);
    throw new Error(`チャットレスポンスの生成に失敗しました: ${error.message}`);
  }
};

// Lambda関数ハンドラー
exports.handler = async (event) => {
  // CORSヘッダーの設定
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
  };

  // OPTIONSリクエスト（プリフライト）の処理
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' })
    };
  }

  try {
    // リクエストボディの解析
    const requestBody = JSON.parse(event.body);
    const { userProfile, analysisResult, message } = requestBody;

    // 必須フィールドの検証
    if (!userProfile || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'ユーザープロフィールとメッセージが必要です' })
      };
    }

    // チャットレスポンスの生成
    const chatResponse = await generateChatResponse(userProfile, analysisResult, message);

    // 成功レスポンスの返却
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        data: { response: chatResponse } 
      })
    };
  } catch (error) {
    console.error('エラーが発生しました:', error);
    
    // エラーレスポンスの返却
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message || 'リクエストの処理中に問題が発生しました' 
      })
    };
  }
};