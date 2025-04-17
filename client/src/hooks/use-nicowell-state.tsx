import { createContext, useContext, useState, ReactNode } from "react";
import { generateAnalysis, type UserProfile, type AnalysisResult } from "@/lib/openai";

export type ScreenType =
  | "welcome"
  | "question1"
  | "question2"
  | "question3"
  | "question4"
  | "question5"
  | "question6"
  | "loading"
  | "results"
  | "chat"
  | "action"
  | "survey"
  | "thankYou";

interface NicoWellContextType {
  currentScreen: ScreenType;
  userProfile: UserProfile;
  analysisResults: AnalysisResult | null;
  navigateTo: (screen: ScreenType) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  generateAnalysis: () => Promise<void>;
  resetApp: () => void;
}

const defaultUserProfile: UserProfile = {
  ageRange: "",
  lifestyle: "",
  sleepDuration: "",
  exerciseFrequency: "",
  wellnessGoals: [],
  healthConcerns: [],
};

const NicoWellContext = createContext<NicoWellContextType | undefined>(undefined);

export function NicoWellProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("welcome");
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const generateAnalysisFromAPI = async () => {
    try {
      const results = await generateAnalysis(userProfile);
      setAnalysisResults(results);
      navigateTo("results");
    } catch (error) {
      console.error("Error generating analysis:", error);
      // Handle error case - could navigate to an error screen or back to questions
      navigateTo("question1");
    }
  };

  const resetApp = () => {
    setUserProfile(defaultUserProfile);
    setAnalysisResults(null);
    navigateTo("welcome");
  };

  return (
    <NicoWellContext.Provider
      value={{
        currentScreen,
        userProfile,
        analysisResults,
        navigateTo,
        updateUserProfile,
        generateAnalysis: generateAnalysisFromAPI,
        resetApp,
      }}
    >
      {children}
    </NicoWellContext.Provider>
  );
}

export function useNicoWell() {
  const context = useContext(NicoWellContext);
  if (context === undefined) {
    throw new Error("useNicoWell must be used within a NicoWellProvider");
  }
  return context;
}
