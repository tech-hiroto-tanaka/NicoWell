import { useNicoWell } from "@/hooks/use-nicowell-state";

export default function WelcomeScreen() {
  const { navigateTo } = useNicoWell();

  return (
    <section className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="w-full"></div>
      <div className="flex flex-col items-center text-center">
        <div className="w-40 h-40 rounded-full bg-primary/30 mb-6 flex items-center justify-center">
          <span className="material-icons-round text-primary-foreground text-6xl">spa</span>
        </div>
        <h1 className="font-rounded font-bold text-3xl mb-3 text-primary">NicoWell</h1>
        <p className="font-rounded text-xl mb-8">パーソナライズされたウェルネスの旅を発見しよう</p>
        <p className="text-muted-foreground mb-12 max-w-sm">
          あなたの生活スタイルに合わせた、やさしく持続可能なウェルネスのアドバイスをお届けします。たった3分でパーソナライズされたプランを作成します。
        </p>
      </div>
      <button 
        className="bg-primary w-full py-4 rounded-lg text-primary-foreground font-bold text-lg shadow-md mb-8 hover:bg-primary/90 transition-colors"
        onClick={() => navigateTo("question1")}
      >
        はじめる
      </button>
    </section>
  );
}
