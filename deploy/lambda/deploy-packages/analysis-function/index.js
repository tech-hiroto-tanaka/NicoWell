const { OpenAI } = require('openai');

// ユーザープロフィールを受け取り、分析結果を生成する関数
const generateAnalysis = async (userProfile) => {
  // OpenAIクライアントの初期化
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    // 健康状態やライフスタイルに基づいて最も役立つ洞察を提供するプロンプト
    const systemPrompt = `あなたは個人の健康とウェルネスの専門家です。以下のユーザープロフィールを分析し、最も焦点を当てるべき健康領域を特定してください。
    焦点領域は「sleep」（睡眠）、「nutrition」（栄養）、「stress」（ストレス）、「movement」（運動）のいずれかである必要があります。
    
    分析結果はJSON形式で以下のフィールドを含めてください:
    - focusArea: 焦点を当てるべき主要領域（睡眠、栄養、ストレス、運動のいずれか）
    - insightSummary: 現在の状態に関する簡潔な洞察（最大100文字）
    - recommendedAction: 具体的で実行可能な推奨事項（最大120文字）
    - benefitExplanation: 推奨事項に従うことで得られる利点の説明（最大120文字）
    
    回答は必ず日本語でお願いします。`;

    // APIリクエストの実行
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(userProfile) }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    // レスポンスの解析
    const analysisResult = JSON.parse(completion.choices[0].message.content);
    return analysisResult;
  } catch (error) {
    console.error('OpenAI API呼び出し中にエラーが発生しました:', error);
    throw new Error(`分析の生成に失敗しました: ${error.message}`);
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
    const { userProfile } = requestBody;

    // 必須フィールドの検証
    if (!userProfile) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'ユーザープロフィールが必要です' })
      };
    }

    // 分析結果の生成
    const analysisResult = await generateAnalysis(userProfile);

    // 成功レスポンスの返却
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        data: analysisResult 
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