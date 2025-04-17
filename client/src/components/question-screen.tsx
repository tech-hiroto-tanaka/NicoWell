import { Progress } from "@/components/ui/progress";
import { useNicoWell } from "@/hooks/use-nicowell-state";
import { useEffect, useState } from "react";

interface QuestionOption {
  id: string;
  value: string;
  label: string;
}

interface QuestionScreenProps {
  questionNumber: number;
}

export default function QuestionScreen({ questionNumber }: QuestionScreenProps) {
  const { userProfile, updateUserProfile, navigateTo, generateAnalysis } = useNicoWell();
  const [selected, setSelected] = useState<string[] | string>([]);

  // Define questions data
  const questions = [
    {
      title: "あなたの年齢を教えてください",
      fieldName: "ageRange",
      type: "radio",
      options: [
        { id: "age-18-25", value: "18-25", label: "18-25歳" },
        { id: "age-26-35", value: "26-35", label: "26-35歳" },
        { id: "age-36-45", value: "36-45", label: "36-45歳" },
        { id: "age-46-55", value: "46-55", label: "46-55歳" },
        { id: "age-56-plus", value: "56+", label: "56歳以上" },
      ],
    },
    {
      title: "あなたの生活スタイルは？",
      fieldName: "lifestyle",
      type: "radio",
      options: [
        { id: "lifestyle-desk", value: "desk", label: "デスクワーク中心" },
        { id: "lifestyle-active", value: "active", label: "アクティブな生活" },
        { id: "lifestyle-irregular", value: "irregular", label: "不規則な生活" },
      ],
    },
    {
      title: "平均睡眠時間はどのくらいですか？",
      fieldName: "sleepDuration",
      type: "radio",
      options: [
        { id: "sleep-less-5", value: "less-5", label: "5時間未満" },
        { id: "sleep-5-6", value: "5-6", label: "5〜6時間" },
        { id: "sleep-7-8", value: "7-8", label: "7〜8時間" },
        { id: "sleep-more-8", value: "more-8", label: "8時間以上" },
      ],
    },
    {
      title: "運動頻度はどのくらいですか？",
      fieldName: "exerciseFrequency",
      type: "radio",
      options: [
        { id: "exercise-none", value: "none", label: "ほとんどしない" },
        { id: "exercise-sometimes", value: "sometimes", label: "週1〜2回程度" },
        { id: "exercise-regular", value: "regular", label: "週3〜4回" },
        { id: "exercise-frequent", value: "frequent", label: "ほぼ毎日" },
      ],
    },
    {
      title: "ウェルネスの目標は？（複数選択可）",
      fieldName: "wellnessGoals",
      type: "checkbox",
      options: [
        { id: "goal-energy", value: "energy", label: "エネルギー向上" },
        { id: "goal-sleep", value: "sleep", label: "睡眠の質改善" },
        { id: "goal-stress", value: "stress", label: "ストレス軽減" },
        { id: "goal-fitness", value: "fitness", label: "体力向上" },
        { id: "goal-focus", value: "focus", label: "集中力アップ" },
      ],
    },
    {
      title: "気になる健康上の課題は？（複数選択可）",
      fieldName: "healthConcerns",
      type: "checkbox",
      options: [
        { id: "concern-fatigue", value: "fatigue", label: "慢性的な疲労" },
        { id: "concern-sleep", value: "sleep", label: "睡眠障害" },
        { id: "concern-stress", value: "stress", label: "ストレスと不安" },
        { id: "concern-focus", value: "focus", label: "集中力の低下" },
        { id: "concern-weight", value: "weight", label: "体重管理" },
        { id: "concern-none", value: "none", label: "特になし" },
      ],
    },
  ];

  const currentQuestion = questions[questionNumber - 1];
  const progressPercent = (questionNumber / questions.length) * 100;
  
  // Initialize selected value(s) from userProfile
  useEffect(() => {
    const fieldName = currentQuestion.fieldName as keyof typeof userProfile;
    const currentValue = userProfile[fieldName];
    
    if (currentValue !== undefined) {
      setSelected(currentValue);
    } else {
      // Initialize with empty array for checkboxes or empty string for radio
      setSelected(currentQuestion.type === "checkbox" ? [] : "");
    }
  }, [currentQuestion.fieldName, questionNumber, userProfile]);

  // Handle option selection
  const handleOptionChange = (value: string) => {
    if (currentQuestion.type === "checkbox") {
      const currentSelected = selected as string[];
      
      // Handle "None" option for checkboxes
      if (value === "none") {
        setSelected(["none"]);
      } else {
        // If selecting an option other than "None", remove "None"
        let newSelected = currentSelected.includes(value)
          ? currentSelected.filter(v => v !== value)
          : [...currentSelected.filter(v => v !== "none"), value];
        
        setSelected(newSelected);
      }
    } else {
      setSelected(value);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    const fieldName = currentQuestion.fieldName as keyof typeof userProfile;
    updateUserProfile({ [fieldName]: selected });
    
    if (questionNumber < questions.length) {
      navigateTo(`question${questionNumber + 1}`);
    } else {
      navigateTo("loading");
      generateAnalysis();
    }
  };

  const handleBack = () => {
    if (questionNumber > 1) {
      navigateTo(`question${questionNumber - 1}`);
    } else {
      navigateTo("welcome");
    }
  };

  // Determine if next button should be enabled
  const isNextEnabled = 
    (currentQuestion.type === "checkbox" && (selected as string[]).length > 0) || 
    (currentQuestion.type === "radio" && selected !== "");

  return (
    <section className="flex flex-col min-h-screen p-6">
      <div className="mb-6">
        <Progress value={progressPercent} className="h-2 bg-primary/20" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>質問 {questionNumber}/6</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
      </div>
      
      <h2 className="font-rounded font-bold text-2xl mb-8 mt-4">{currentQuestion.title}</h2>
      
      <div className="space-y-3 mb-auto">
        {currentQuestion.options.map((option: QuestionOption) => (
          <div key={option.id} className="option-container">
            <input
              type={currentQuestion.type}
              id={option.id}
              name={currentQuestion.fieldName}
              value={option.value}
              checked={
                currentQuestion.type === "checkbox"
                  ? (selected as string[]).includes(option.value)
                  : selected === option.value
              }
              onChange={() => handleOptionChange(option.value)}
              className="hidden peer"
            />
            <label
              htmlFor={option.id}
              className="block w-full text-center p-4 border-2 border-muted rounded-lg cursor-pointer hover:bg-muted transition-colors peer-checked:bg-accent peer-checked:border-accent-foreground"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-8">
        {questionNumber > 1 ? (
          <>
            <button
              className="px-6 py-3 bg-muted rounded-lg text-muted-foreground font-medium w-[48%]"
              onClick={handleBack}
            >
              戻る
            </button>
            <button
              className="px-6 py-3 bg-primary rounded-lg text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed w-[48%]"
              disabled={!isNextEnabled}
              onClick={handleNext}
            >
              {questionNumber < questions.length ? "次へ" : "分析する"}
            </button>
          </>
        ) : (
          <button
            className="px-6 py-3 bg-primary rounded-lg text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full"
            disabled={!isNextEnabled}
            onClick={handleNext}
          >
            次へ
          </button>
        )}
      </div>
    </section>
  );
}
