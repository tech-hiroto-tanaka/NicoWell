import { apiRequest } from "./queryClient";

// Types for OpenAI API responses
export interface AnalysisResult {
  focusArea: "sleep" | "nutrition" | "stress" | "movement";
  insightSummary: string;
  recommendedAction: string;
  benefitExplanation: string;
}

export interface UserProfile {
  ageRange: string;
  lifestyle: string;
  sleepDuration: string;
  exerciseFrequency: string;
  wellnessGoals: string[];
  healthConcerns: string[];
}

// Function to get analysis from OpenAI API
export async function generateAnalysis(userProfile: UserProfile): Promise<AnalysisResult> {
  try {
    const response = await apiRequest(
      "POST",
      "/analyze", // AWSデプロイしたAPIのパス
      { userProfile }
    );
    
    const data = await response.json();
    
    // Lambda関数のレスポンス形式に合わせて処理
    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.error || "分析の生成中にエラーが発生しました");
    }
  } catch (error) {
    console.error("Error generating analysis:", error);
    throw new Error("分析の生成中にエラーが発生しました。もう一度お試しください。");
  }
}

// Function to get chat response from OpenAI API
export async function getChatResponse(
  userProfile: UserProfile,
  analysisResult: AnalysisResult | null,
  message: string
): Promise<string> {
  try {
    const response = await apiRequest(
      "POST", 
      "/chat", // AWSデプロイしたAPIのパス
      { userProfile, analysisResult, message }
    );
    
    const data = await response.json();
    
    // Lambda関数のレスポンス形式に合わせて処理
    if (data.success && data.data) {
      return data.data.response;
    } else {
      throw new Error(data.error || "メッセージの送信中にエラーが発生しました");
    }
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw new Error("メッセージの送信中にエラーが発生しました。もう一度お試しください。");
  }
}

// アンケート回答を送信する関数
export async function submitSurveyResponse(
  satisfaction: number,
  feasibility: number,
  email?: string,
  userProfile?: UserProfile,
  analysisResults?: AnalysisResult
): Promise<void> {
  try {
    const response = await apiRequest(
      "POST",
      "/survey", // AWSデプロイしたAPIのパス
      { 
        satisfaction, 
        feasibility, 
        email,
        userProfile,
        analysisResults
      }
    );
    
    const data = await response.json();
    
    // Lambda関数のレスポンス形式に合わせて処理
    if (!data.success) {
      throw new Error(data.error || "アンケート送信中にエラーが発生しました");
    }
  } catch (error) {
    console.error("Error submitting survey:", error);
    throw new Error("アンケートの送信中にエラーが発生しました。もう一度お試しください。");
  }
}
