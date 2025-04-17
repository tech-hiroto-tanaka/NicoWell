import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

// Initialize OpenAI API client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for generating analysis
  app.post("/api/analysis", async (req, res) => {
    try {
      const { userProfile } = req.body;
      
      if (!userProfile) {
        return res.status(400).json({ message: "ユーザープロフィールが必要です" });
      }

      // Convert user profile to JSON string for the prompt
      const userProfileJSON = JSON.stringify(userProfile, null, 2);

      // Call OpenAI API with system prompt
      const response = await openai.chat.completions.create({
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        model: "gpt-4o",
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
      
      // Parse the response JSON
      const content = response.choices[0].message.content || '{}';
      const analysisResult = JSON.parse(content);
      
      res.json(analysisResult);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: "分析の生成中にエラーが発生しました", error: String(error) });
    }
  });

  // API route for chat functionality
  app.post("/api/chat", async (req, res) => {
    try {
      const { userProfile, analysisResult, message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "メッセージが必要です" });
      }

      // Convert data to JSON strings for the prompt
      const userProfileJSON = JSON.stringify(userProfile, null, 2);
      const analysisResultJSON = analysisResult ? JSON.stringify(analysisResult, null, 2) : "分析結果はありません";

      // Call OpenAI API with system prompt
      const response = await openai.chat.completions.create({
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        model: "gpt-4o",
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
      
      // Get the response text
      const chatResponse = response.choices[0].message.content || '';
      
      res.json({ response: chatResponse });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "チャットレスポンスの生成中にエラーが発生しました", error: String(error) });
    }
  });

  // API route for survey submission
  app.post("/api/survey", async (req, res) => {
    try {
      const { satisfaction, feasibility, email, userProfile, analysisResults } = req.body;
      
      if (!satisfaction || !feasibility) {
        return res.status(400).json({ message: "満足度と実行可能性の評価が必要です" });
      }

      // データベースに保存
      const surveyData = {
        satisfaction,
        feasibility,
        email: email || null,
        profileData: userProfile ? JSON.stringify(userProfile) : null,
        analysisData: analysisResults ? JSON.stringify(analysisResults) : null,
      };
      
      await storage.createSurveyResponse(surveyData);
      
      // メールアドレスが提供された場合はユーザーも作成
      if (email) {
        await storage.createUser({ email });
      }
      
      console.log("Survey submission saved to database:", { satisfaction, feasibility, email });
      
      res.json({ message: "フィードバックを受け取りました。ありがとうございます！" });
    } catch (error) {
      console.error("Survey submission error:", error);
      res.status(500).json({ message: "アンケートの送信中にエラーが発生しました", error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
