// ローカル環境でLambda関数をテストするスクリプト
const analysisFunction = require('./analysis-function/index');
const chatFunction = require('./chat-function/index');
const surveyFunction = require('./survey-function/index');

// OpenAI APIキーを設定
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''; // 実際のAPIキーを環境変数から取得

// テスト用のユーザープロフィール
const sampleUserProfile = {
  ageRange: '30-40',
  lifestyle: 'デスクワーク中心の忙しい日々を送っています',
  sleepDuration: '6時間未満',
  exerciseFrequency: '週に1-2回',
  wellnessGoals: ['エネルギー向上', 'ストレス軽減', '集中力向上'],
  healthConcerns: ['睡眠の質', '慢性的な疲労']
};

// 分析関数のテスト
async function testAnalysisFunction() {
  console.log('========== 分析関数のテスト ==========');
  
  // Lambda関数のイベントオブジェクトを作成
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify({
      userProfile: sampleUserProfile
    })
  };
  
  try {
    // 関数を実行
    const response = await analysisFunction.handler(event);
    console.log('レスポンスステータス:', response.statusCode);
    console.log('レスポンスボディ:', response.body);
    
    // 成功した場合、分析結果を返す
    if (response.statusCode === 200) {
      return JSON.parse(response.body).data;
    }
    return null;
  } catch (error) {
    console.error('分析関数のテスト中にエラーが発生しました:', error);
    return null;
  }
}

// チャット関数のテスト
async function testChatFunction(analysisResult) {
  console.log('\n========== チャット関数のテスト ==========');
  
  // Lambda関数のイベントオブジェクトを作成
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify({
      userProfile: sampleUserProfile,
      analysisResult: analysisResult,
      message: '睡眠の質を改善するためのアドバイスをください'
    })
  };
  
  try {
    // 関数を実行
    const response = await chatFunction.handler(event);
    console.log('レスポンスステータス:', response.statusCode);
    console.log('レスポンスボディ:', response.body);
  } catch (error) {
    console.error('チャット関数のテスト中にエラーが発生しました:', error);
  }
}

// アンケート関数のテスト
async function testSurveyFunction(analysisResult) {
  console.log('\n========== アンケート関数のテスト ==========');
  
  // Lambda関数のイベントオブジェクトを作成
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify({
      satisfaction: 4,
      feasibility: 5,
      email: 'test@example.com',
      userProfile: sampleUserProfile,
      analysisResults: analysisResult
    })
  };
  
  try {
    // 関数を実行
    const response = await surveyFunction.handler(event);
    console.log('レスポンスステータス:', response.statusCode);
    console.log('レスポンスボディ:', response.body);
  } catch (error) {
    console.error('アンケート関数のテスト中にエラーが発生しました:', error);
  }
}

// メイン実行関数
async function runTests() {
  try {
    // OpenAI APIキーの確認
    if (!process.env.OPENAI_API_KEY) {
      console.error('エラー: OPENAI_API_KEYが設定されていません。');
      console.error('スクリプトを実行する前に、環境変数を設定してください：');
      console.error('export OPENAI_API_KEY=your_api_key_here');
      process.exit(1);
    }
    
    console.log('Lambda関数のローカルテストを開始します...');
    
    // 分析関数のテスト
    const analysisResult = await testAnalysisFunction();
    
    // 分析が成功した場合のみ、他の関数をテスト
    if (analysisResult) {
      await testChatFunction(analysisResult);
      await testSurveyFunction(analysisResult);
    }
    
    console.log('\nすべてのテストが完了しました。');
  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error);
  }
}

// テストを実行
runTests();