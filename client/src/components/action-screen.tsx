import { useNicoWell } from "@/hooks/use-nicowell-state";

// Map focus areas to icons
const focusAreaIcons: Record<string, string> = {
  "sleep": "bedtime",
  "nutrition": "restaurant",
  "stress": "self_improvement",
  "movement": "directions_run"
};

export default function ActionScreen() {
  const { analysisResults, navigateTo } = useNicoWell();

  if (!analysisResults) {
    return (
      <section className="flex flex-col min-h-screen items-center justify-center p-6">
        <p>アクション情報を読み込めませんでした。もう一度お試しください。</p>
        <button 
          className="bg-primary mt-4 px-6 py-2 rounded-lg text-primary-foreground"
          onClick={() => navigateTo("results")}
        >
          戻る
        </button>
      </section>
    );
  }

  // Get icon based on focus area
  const actionIcon = focusAreaIcons[analysisResults.focusArea] || "psychology";

  // Create action title based on recommended action (first 10 words or so)
  const actionTitleRaw = analysisResults.recommendedAction.split('。')[0];
  const actionTitle = actionTitleRaw.length > 20 
    ? actionTitleRaw.substring(0, 20) + "..." 
    : actionTitleRaw;

  return (
    <section className="flex flex-col min-h-screen p-6">
      <h2 className="font-rounded font-bold text-2xl mb-8 text-center">今日からのNicoアクション</h2>
      
      <div className="bg-accent/20 rounded-lg p-6 mb-8 text-center shadow-md">
        <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
          <span className="material-icons-round text-accent text-5xl">{actionIcon}</span>
        </div>
        <p className="text-foreground">
          {analysisResults.recommendedAction}
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-5 border border-input mb-auto">
        <h3 className="font-medium text-center mb-3">実践のポイント</h3>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>同じ時間に毎日実践すると効果的です</li>
          <li>小さく始めて徐々に習慣化していきましょう</li>
          <li>無理なく続けられる範囲から始めましょう</li>
          <li>1週間続けることを目標にしてみましょう</li>
        </ul>
      </div>
      
      <button 
        className="bg-primary w-full py-4 rounded-lg text-primary-foreground font-bold text-lg shadow-md mt-6 hover:bg-primary/90 transition-colors"
        onClick={() => navigateTo("survey")}
      >
        アンケートに進む
      </button>
    </section>
  );
}
