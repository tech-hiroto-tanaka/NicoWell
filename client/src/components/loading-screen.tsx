export default function LoadingScreen() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-32 h-32 mb-8">
          <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <span className="material-icons-round text-6xl text-primary">spa</span>
          </div>
        </div>
        <h2 className="font-rounded font-bold text-2xl mb-4">パーソナライズされたウェルネスプランを作成中...</h2>
        <p className="text-muted-foreground mb-3 typing-animation">あなたのプロフィールを分析しています</p>
      </div>
    </section>
  );
}
