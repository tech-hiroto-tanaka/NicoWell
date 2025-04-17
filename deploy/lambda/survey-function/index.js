// アンケート回答を処理するLambda関数
// このバージョンではデータの保存部分を簡略化しています。実際の本番環境ではPostgreSQLなどのデータベースに接続して保存します。

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
    const { satisfaction, feasibility, email, userProfile, analysisResults } = requestBody;

    // 必須フィールドの検証
    if (satisfaction === undefined || feasibility === undefined) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '満足度と実現可能性の評価が必要です' })
      };
    }

    // ここで本来はデータベースに保存する処理を行いますが、
    // 簡略化のためにログに出力するだけにします。
    console.log('アンケート回答を受信:', {
      satisfaction,
      feasibility,
      email: email || '未提供',
      hasUserProfile: !!userProfile,
      hasAnalysisResults: !!analysisResults
    });

    // 実際のデータベース保存処理の例（コメントアウト）
    /*
    if (process.env.DATABASE_URL) {
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      
      await pool.query(
        `INSERT INTO survey_responses (satisfaction, feasibility, email, user_profile, analysis_results)
         VALUES ($1, $2, $3, $4, $5)`,
        [satisfaction, feasibility, email, JSON.stringify(userProfile), JSON.stringify(analysisResults)]
      );
    }
    */

    // 成功レスポンスの返却
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'アンケート回答を受け付けました。ありがとうございます。' 
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