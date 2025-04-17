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
      "/api/analysis",
      { userProfile }
    );
    
    const data = await response.json();
    return data;
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
      "/api/chat", 
      { userProfile, analysisResult, message }
    );
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw new Error("メッセージの送信中にエラーが発生しました。もう一度お試しください。");
  }
}
