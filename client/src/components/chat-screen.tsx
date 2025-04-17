import { useEffect, useRef, useState } from "react";
import { useNicoWell } from "@/hooks/use-nicowell-state";
import { getChatResponse } from "@/lib/openai";

type Message = {
  text: string;
  isUser: boolean;
};

export default function ChatScreen() {
  const { userProfile, analysisResults, navigateTo } = useNicoWell();
  const [messages, setMessages] = useState<Message[]>([
    { text: "こんにちは！NicoWellアシスタントです。" + 
      (analysisResults ? `${analysisResults.focusArea === "sleep" ? "睡眠" : 
                          analysisResults.focusArea === "nutrition" ? "栄養" :
                          analysisResults.focusArea === "stress" ? "ストレス" : "運動"}の質向上について、何か質問はありますか？` : 
                         "ウェルネスについて、何か質問はありますか？"), 
      isUser: false }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage = { text, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      const response = await getChatResponse(userProfile, analysisResults, text);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "申し訳ありません。メッセージの送信中にエラーが発生しました。もう一度お試しください。", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = async (text: string) => {
    await handleSendMessage(text);
  };

  const getPlaceholderSuggestions = () => {
    if (!analysisResults) return [];
    
    switch (analysisResults.focusArea) {
      case "sleep":
        return [
          "眠りが浅い場合はどうすれば？",
          "瞑想の始め方を教えて",
          "寝る前のルーティンのおすすめは？"
        ];
      case "nutrition":
        return [
          "朝食に何を食べるべき？",
          "健康的な間食のおすすめは？",
          "食事のタイミングは重要？"
        ];
      case "stress":
        return [
          "職場でのストレス対処法は？",
          "簡単なリラックス方法を教えて",
          "ストレスと睡眠の関係は？"
        ];
      case "movement":
        return [
          "デスクワーク中の簡単な運動は？",
          "毎日の運動を習慣化するコツは？",
          "運動と睡眠の関係は？"
        ];
      default:
        return [
          "健康的な習慣を作るコツは？",
          "ウェルネスを改善する簡単な方法は？",
          "毎日の小さな変化のアイデアは？"
        ];
    }
  };

  const suggestions = getPlaceholderSuggestions();

  return (
    <section className="flex flex-col min-h-screen">
      <div className="bg-primary p-4 flex items-center">
        <button className="mr-2" onClick={() => navigateTo("results")}>
          <span className="material-icons-round text-white">arrow_back</span>
        </button>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
            <span className="material-icons-round text-primary text-sm">psychology</span>
          </div>
          <h2 className="font-rounded font-bold text-lg text-white">NicoWellアシスタント</h2>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-background">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`chat-bubble fade-in ${message.isUser ? 'user-bubble' : 'assistant-bubble'}`}
          >
            <p>{message.text}</p>
          </div>
        ))}
        
        {isLoading && (
          <div className="chat-bubble assistant-bubble typing-animation">
            返答を入力中
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-muted">
        <p className="text-sm text-muted-foreground mb-2">質問の例：</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((suggestion, index) => (
            <button 
              key={index}
              className="bg-white px-3 py-2 rounded-full text-sm border border-muted hover:bg-muted transition-colors"
              onClick={() => handleSuggestion(suggestion)}
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 border border-input rounded-l-lg p-3 focus:outline-none focus:border-primary"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            disabled={isLoading}
          />
          <button 
            className="bg-primary p-3 rounded-r-lg text-white disabled:opacity-50"
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
          >
            <span className="material-icons-round">send</span>
          </button>
        </div>
      </div>

      <button 
        className="bg-accent mx-4 mb-4 py-3 rounded-lg text-accent-foreground font-bold shadow-md hover:bg-accent/90 transition-colors"
        onClick={() => navigateTo("action")}
      >
        アクションステップに進む
      </button>
    </section>
  );
}
