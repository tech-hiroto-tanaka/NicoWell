// surveyFunction - アンケート結果を保存するための関数
// 実際の実装ではこのデータをAmazon DynamoDBに保存できます

exports.handler = async (event) => {
  try {
    // リクエストボディの解析
    const body = JSON.parse(event.body);
    const { satisfaction, feasibility, email, userProfile, analysisResults } = body;
    
    if (!satisfaction || !feasibility) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
          "Access-Control-Allow-Methods": "POST,OPTIONS"
        },
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
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: JSON.stringify({ message: "フィードバックを受け取りました。ありがとうございます！" })
    };
    
  } catch (error) {
    console.error("Survey error:", error);
    
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: JSON.stringify({ 
        message: "アンケートの送信中にエラーが発生しました", 
        error: error.message 
      })
    };
  }
};