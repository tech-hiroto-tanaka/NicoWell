import { useNicoWell } from "@/hooks/use-nicowell-state";
import WelcomeScreen from "@/components/welcome-screen";
import QuestionScreen from "@/components/question-screen";
import LoadingScreen from "@/components/loading-screen";
import ResultsScreen from "@/components/results-screen";
import ChatScreen from "@/components/chat-screen";
import ActionScreen from "@/components/action-screen";
import SurveyScreen from "@/components/survey-screen";
import ThankYouScreen from "@/components/thank-you-screen";

export default function Home() {
  const { currentScreen } = useNicoWell();

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-white shadow-md relative overflow-hidden">
      {currentScreen === "welcome" && <WelcomeScreen />}
      {currentScreen === "question1" && <QuestionScreen questionNumber={1} />}
      {currentScreen === "question2" && <QuestionScreen questionNumber={2} />}
      {currentScreen === "question3" && <QuestionScreen questionNumber={3} />}
      {currentScreen === "question4" && <QuestionScreen questionNumber={4} />}
      {currentScreen === "question5" && <QuestionScreen questionNumber={5} />}
      {currentScreen === "question6" && <QuestionScreen questionNumber={6} />}
      {currentScreen === "loading" && <LoadingScreen />}
      {currentScreen === "results" && <ResultsScreen />}
      {currentScreen === "chat" && <ChatScreen />}
      {currentScreen === "action" && <ActionScreen />}
      {currentScreen === "survey" && <SurveyScreen />}
      {currentScreen === "thankYou" && <ThankYouScreen />}
    </div>
  );
}
