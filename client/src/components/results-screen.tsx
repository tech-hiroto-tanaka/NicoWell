import { useNicoWell } from "@/hooks/use-nicowell-state";

// Map focus areas to Japanese
const focusAreaLabels: Record<string, string> = {
  "sleep": "睡眠",
  "nutrition": "栄養",
  "stress": "ストレス",
  "movement": "運動"
};

export default function ResultsScreen() {
  const { analysisResults, navigateTo } = useNicoWell();

  if (!analysisResults) {
    return (
      <section className="flex flex-col min-h-screen items-center justify-center p-6">
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
      <h2 className="font-rounded font-bold text-2xl mb-6 text-center">あなたのNicoプラン</h2>
      
      <div className="bg-primary/20 rounded-lg p-5 mb-6">
        <div className="flex items-center mb-4">
          <span className="material-icons-round text-primary mr-2">favorite</span>
          <h3 className="font-rounded font-bold text-xl">注目ポイント: {focusAreaJP}</h3>
        </div>
        <p className="text-foreground">
          {analysisResults.insightSummary}
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-5 shadow-md mb-6">
        <div className="flex items-start mb-4">
          <div className="w-16 h-16 bg-accent/30 rounded-lg mr-3 flex items-center justify-center">
            <span className="material-icons-round text-accent text-3xl">
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
        className="bg-primary w-full py-4 rounded-lg text-primary-foreground font-bold text-lg shadow-md mt-auto hover:bg-primary/90 transition-colors"
        onClick={() => navigateTo("chat")}
      >
        AIアシスタントに質問する
      </button>
    </section>
  );
}
