import { useState } from "react";
import { useNicoWell } from "@/hooks/use-nicowell-state";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SurveyScreen() {
  const { navigateTo, userProfile, analysisResults } = useNicoWell();
  const { toast } = useToast();
  const [satisfaction, setSatisfaction] = useState<string>("");
  const [feasibility, setFeasibility] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!satisfaction || !feasibility) {
      toast({
        title: "入力エラー",
        description: "すべての質問に回答してください",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/survey", {
        satisfaction,
        feasibility,
        email: email || null,
        userProfile,
        analysisResults,
      });

      toast({
        title: "送信完了",
        description: "フィードバックをありがとうございます！",
      });

      navigateTo("thankYou");
    } catch (error) {
      console.error("Survey submission error:", error);
      toast({
        title: "送信エラー",
        description: "フィードバックの送信中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col min-h-screen p-6">
      <h2 className="font-rounded font-bold text-2xl mb-8 text-center">サービス改善のためのアンケート</h2>
      
      <div className="space-y-6 mb-auto">
        <div>
          <h3 className="font-medium mb-3">今回の体験はいかがでしたか？</h3>
          <div className="flex justify-between gap-2">
            {[
              { value: "very-good", icon: "sentiment_very_satisfied", label: "とても良い" },
              { value: "good", icon: "sentiment_satisfied", label: "良い" },
              { value: "neutral", icon: "sentiment_neutral", label: "普通" },
              { value: "bad", icon: "sentiment_dissatisfied", label: "不満" }
            ].map((option) => (
              <label key={option.value} className="flex-1 text-center">
                <input 
                  type="radio" 
                  name="satisfaction" 
                  value={option.value} 
                  checked={satisfaction === option.value}
                  onChange={() => setSatisfaction(option.value)}
                  className="hidden peer" 
                />
                <div className="p-3 border-2 border-input rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/20 flex flex-col items-center">
                  <span className="material-icons-round mb-1">{option.icon}</span>
                  <span className="text-sm">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">提案された行動は実行可能だと思いますか？</h3>
          <div className="space-y-2">
            {[
              { value: "very-feasible", label: "とても実行しやすい" },
              { value: "feasible", label: "実行しやすい" },
              { value: "neutral", label: "どちらとも言えない" },
              { value: "difficult", label: "実行が難しい" }
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border-2 border-input rounded-lg cursor-pointer hover:bg-muted transition-colors">
                <input 
                  type="radio" 
                  name="feasibility" 
                  value={option.value} 
                  checked={feasibility === option.value}
                  onChange={() => setFeasibility(option.value)}
                  className="mr-3" 
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">最新情報を受け取りますか？</h3>
          <input 
            type="email" 
            placeholder="メールアドレス（任意）" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-input rounded-lg p-3 focus:outline-none focus:border-primary" 
          />
          <p className="text-xs text-muted-foreground mt-2">※入力いただくとより詳細な「あなただけの健康プラン」をPDFファイルでお届けします。</p>
        </div>
      </div>
      
      <button 
        className="bg-primary w-full py-4 rounded-lg text-primary-foreground font-bold text-lg shadow-md mt-6 hover:bg-primary/90 transition-colors disabled:opacity-50"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "送信中..." : "送信する"}
      </button>
    </section>
  );
}
