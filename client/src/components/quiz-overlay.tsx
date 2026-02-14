import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Brain, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, QuizQuestion } from "@/lib/api";

interface QuizOverlayProps {
  questions: QuizQuestion[];
  chapterId: string;
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function QuizOverlay({ questions, chapterId, userId, onComplete, onSkip }: QuizOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; explanation: string | null } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectAnswer = (index: number) => {
    if (result) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    setIsSubmitting(true);
    try {
      const submitResult = await api.submitQuizAnswer(userId, chapterId, currentQuestion.id, selectedAnswer);
      setResult(submitResult);
      if (submitResult.isCorrect) {
        setCorrectCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setResult(null);
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-card border-border shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-magenta/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-magenta" />
                </div>
                <div>
                  <CardTitle className="text-lg">Knowledge Check</CardTitle>
                  <p className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onSkip} className="text-muted-foreground" data-testid="button-skip-quiz">
                Skip
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg font-medium text-foreground" data-testid="text-quiz-question">
              {currentQuestion.question}
            </p>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = result && index === currentQuestion.correctAnswer;
                const isWrongAnswer = result && isSelected && !result.isCorrect;

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={result !== null}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                      isCorrectAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : isWrongAnswer
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : isSelected
                        ? "border-magenta bg-magenta/5"
                        : "border-border hover:border-magenta/50 hover:bg-muted/50"
                    }`}
                    whileTap={{ scale: result ? 1 : 0.98 }}
                    data-testid={`button-option-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCorrectAnswer
                          ? "bg-green-500 text-white"
                          : isWrongAnswer
                          ? "bg-red-500 text-white"
                          : isSelected
                          ? "bg-magenta text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {isCorrectAnswer ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : isWrongAnswer ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {result && result.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`p-4 rounded-xl ${
                    result.isCorrect 
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                      : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                  }`}
                >
                  <p className="text-sm font-medium mb-1">
                    {result.isCorrect ? "Correct!" : "Not quite right"}
                  </p>
                  <p className="text-sm text-muted-foreground">{result.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 pt-2">
              {!result ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null || isSubmitting}
                  className="flex-1"
                  data-testid="button-submit-answer"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Checking...</>
                  ) : (
                    "Submit Answer"
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex-1" data-testid="button-next-question">
                  {isLastQuestion ? (
                    <>Complete Quiz <CheckCircle className="w-4 h-4 ml-2" /></>
                  ) : (
                    <>Next Question <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              )}
            </div>

            <div className="flex justify-center gap-2 pt-2">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentIndex
                      ? "bg-magenta"
                      : idx < currentIndex
                      ? "bg-magenta/40"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
