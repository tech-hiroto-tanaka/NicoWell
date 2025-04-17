import { useNicoWell } from "@/hooks/use-nicowell-state";

export default function ThankYouScreen() {
  const { resetApp } = useNicoWell();

  return (
    <section className="flex flex-col items-center justify-between min-h-screen p-6 text-center">
      <div className="w-full"></div>
      <div>
        <div className="w-24 h-24 mx-auto mb-6 bg-accent/30 rounded-full flex items-center justify-center">
          <span className="material-icons-round text-accent text-4xl">check_circle</span>
        </div>
        <h2 className="font-rounded font-bold text-2xl mb-4">ありがとうございました！</h2>
        <p className="text-muted-foreground mb-8">
          NicoWellのデモ体験をお楽しみいただけましたか？<br />
          ウェルネスの旅はこれからも続きます。<br />
          提案された行動から始めてみましょう。
        </p>
      </div>
      <div className="w-full">
        <p className="text-xs text-muted-foreground mb-3">
          ※この提案は医学的なアドバイスではありません。健康上の懸念がある場合は、医療専門家にご相談ください。
        </p>
        <button 
          className="bg-primary w-full py-4 rounded-lg text-primary-foreground font-bold text-lg shadow-md hover:bg-primary/90 transition-colors"
          onClick={resetApp}
        >
          もう一度体験する
        </button>
      </div>
    </section>
  );
}
