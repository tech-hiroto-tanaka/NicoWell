import { useNicoWell } from "@/hooks/use-nicowell-state";
import { useResultsAnimation } from "@/hooks/use-gsap-animation";
import gsap from "gsap";
import { useEffect } from "react";

// Map focus areas to Japanese
const focusAreaLabels: Record<string, string> = {
  "sleep": "睡眠",
  "nutrition": "栄養",
  "stress": "ストレス",
  "movement": "運動"
};

export default function ResultsScreen() {
  const { analysisResults, navigateTo } = useNicoWell();
  const { titleRef, insightBoxRef, actionBoxRef, buttonRef } = useResultsAnimation();

  // エラー状態でも円滑なアニメーション表示
  useEffect(() => {
    if (!analysisResults) {
      // エラー表示のアニメーション
      const errorElements = document.querySelectorAll('.error-container > *');
      gsap.fromTo(errorElements, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [analysisResults]);

  // アイコンのアニメーション
  const animateIcon = (iconElement: HTMLElement) => {
    gsap.fromTo(iconElement,
      { rotationY: 0, scale: 1 },
      { 
        rotationY: 360, 
        scale: 1.2,
        duration: 1.5, 
        ease: "elastic.out(1, 0.3)",
      }
    );
  };

  // アイコンのホバーアニメーション設定
  useEffect(() => {
    if (analysisResults) {
      const iconElements = document.querySelectorAll('.animate-icon');
      iconElements.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
          animateIcon(icon as HTMLElement);
        });
      });
      
      // クリーンアップ
      return () => {
        iconElements.forEach(icon => {
          icon.removeEventListener('mouseenter', () => {});
        });
      };
    }
  }, [analysisResults]);

  if (!analysisResults) {
    return (
      <section className="flex flex-col min-h-screen items-center justify-center p-6 error-container">
        <p>分析結果を読み込めませんでした。もう一度お試しください。</p>
        <button 
          className="bg-primary mt-4 px-6 py-2 rounded-lg text-primary-foreground"
          onClick={() => navigateTo("question1")}
        >
          やり直す
        </button>
      </section>
    );
  }

  const focusAreaJP = focusAreaLabels[analysisResults.focusArea] || analysisResults.focusArea;

  return (
    <section className="flex flex-col min-h-screen p-6">
      <h2 ref={titleRef} className="font-rounded font-bold text-2xl mb-6 text-center">あなたのNicoプラン</h2>
      
      <div ref={insightBoxRef} className="bg-primary/20 rounded-lg p-5 mb-6 overflow-hidden">
        <div className="flex items-center mb-4">
          <span className="material-icons-round text-primary mr-2 animate-icon">favorite</span>
          <h3 className="font-rounded font-bold text-xl">注目ポイント: {focusAreaJP}</h3>
        </div>
        <p className="text-foreground">
          {analysisResults.insightSummary}
        </p>
      </div>
      
      <div ref={actionBoxRef} className="bg-accent/30 rounded-lg p-5 shadow-md mb-6 overflow-hidden">
        <div className="flex items-start mb-4">
          <div className="w-16 h-16 rounded-lg mr-3 flex items-center justify-center">
            <span className="material-icons-round text-accent text-3xl animate-icon">
              {analysisResults.focusArea === "sleep" ? "bedtime" : 
               analysisResults.focusArea === "nutrition" ? "restaurant" :
               analysisResults.focusArea === "stress" ? "self_improvement" : "directions_run"}
            </span>
          </div>
          <div>
            <h3 className="font-rounded font-bold text-lg mb-1">おすすめの行動</h3>
            <p className="text-foreground">
              {analysisResults.recommendedAction}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground">
          {analysisResults.benefitExplanation}
        </p>
      </div>
      
      <button 
        ref={buttonRef}
        className="bg-primary w-full py-4 rounded-lg text-primary-foreground font-bold text-lg shadow-md mt-auto hover:bg-primary/90 transition-colors"
        onClick={() => navigateTo("chat")}
      >
        AIアシスタントに質問する
      </button>
    </section>
  );
}
