import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useRoute, useLocation } from "wouter";
import {
  ArrowLeft, CheckCircle2, XCircle, ChevronRight, Zap,
  Flame, Heart, BookOpen, GripVertical, ArrowRight, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConceptCard {
  heading: string;
  bullets: string[];
  visual?: string;
}

interface Question {
  id: string;
  lessonId: string;
  type: string;
  prompt: string;
  options: any;
  correctAnswer: string;
  explanation: string;
  visual: any;
  orderIndex: number;
}

interface Lesson {
  id: string;
  unitId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  conceptCard: ConceptCard | null;
  conceptImageUrl: string | null;
  xpReward: number;
  questions: Question[];
}

type AnswerState = "unanswered" | "correct" | "incorrect";

export default function BasecampLessonPage() {
  const [, params] = useRoute("/basecamp/lesson/:slug");
  const [, setLocation] = useLocation();
  const { authToken } = useAuth();
  const token = authToken || localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const slug = params?.slug;

  const [step, setStep] = useState<"concept" | "quiz" | "results">("concept");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [hearts, setHearts] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer: string; correct: boolean }>>({});
  const [dragItems, setDragItems] = useState<string[]>([]);
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>({});
  const [matchLeft, setMatchLeft] = useState<string | null>(null);

  useEffect(() => {
    setStep("concept");
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswerState("unanswered");
    setHearts(3);
    setCorrectCount(0);
    setAnswers({});
    setDragItems([]);
    setMatchSelections({});
    setMatchLeft(null);
  }, [slug]);

  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: ["/api/basecamp/lessons", slug],
    queryFn: async () => {
      const res = await fetch(`/api/basecamp/lessons/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch lesson");
      return res.json();
    },
    enabled: !!slug,
  });

  const completeMutation = useMutation({
    mutationFn: async (data: { lessonId: string; score: number; xpEarned: number; answers: any }) => {
      const res = await fetch("/api/basecamp/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save progress");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/basecamp/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/basecamp/streak"] });
    },
  });

  const questions = lesson?.questions || [];
  const currentQuestion = questions[currentQ];
  const totalQuestions = questions.length;
  const progressPct = totalQuestions > 0 ? Math.round(((currentQ + (answerState !== "unanswered" ? 1 : 0)) / totalQuestions) * 100) : 0;

  useEffect(() => {
    if (currentQuestion?.type === "drag_order" && answerState === "unanswered") {
      const opts = Array.isArray(currentQuestion.options) ? [...currentQuestion.options] : [];
      setDragItems(opts);
    }
    if (currentQuestion?.type === "match_pairs" && answerState === "unanswered") {
      setMatchSelections({});
      setMatchLeft(null);
    }
  }, [currentQ, currentQuestion?.type, answerState]);

  const checkAnswer = useCallback(() => {
    if (!currentQuestion) return;
    let userAnswer = "";
    let isCorrect = false;

    if (currentQuestion.type === "drag_order") {
      userAnswer = dragItems.join(",");
      isCorrect = userAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "match_pairs") {
      const pairs = Object.entries(matchSelections).map(([l, r]) => `${l}:${r}`).join(",");
      userAnswer = pairs;
      isCorrect = userAnswer === currentQuestion.correctAnswer;
    } else {
      userAnswer = selectedAnswer || "";
      isCorrect = userAnswer === currentQuestion.correctAnswer;
    }

    setAnswerState(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setHearts((h) => Math.max(0, h - 1));

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { answer: userAnswer, correct: isCorrect },
    }));
  }, [currentQuestion, selectedAnswer, dragItems, matchSelections]);

  const nextQuestion = useCallback(() => {
    if (currentQ + 1 >= totalQuestions || hearts <= 0) {
      const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      const xp = lesson?.xpReward || 20;
      setStep("results");
      completeMutation.mutate({
        lessonId: lesson!.id,
        score,
        xpEarned: xp,
        answers,
      });
    } else {
      setCurrentQ((c) => c + 1);
      setSelectedAnswer(null);
      setAnswerState("unanswered");
    }
  }, [currentQ, totalQuestions, hearts, correctCount, lesson, answers]);

  const moveDragItem = (fromIdx: number, toIdx: number) => {
    const updated = [...dragItems];
    const [item] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, item);
    setDragItems(updated);
  };

  const handleMatchClick = (side: "left" | "right", value: string) => {
    if (side === "left") {
      setMatchLeft(value);
    } else if (matchLeft) {
      setMatchSelections((prev) => ({ ...prev, [matchLeft]: value }));
      setMatchLeft(null);
    }
  };

  if (isLoading || !lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (step === "concept" && lesson.conceptCard) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button
            onClick={() => setLocation("/basecamp")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            data-testid="button-back-basecamp"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Base Camp
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-5 w-5 text-[#0A66C2]" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Concept Card
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-4" data-testid="text-concept-heading">
              {lesson.conceptCard.heading}
            </h2>

            {lesson.conceptImageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="mb-6 rounded-xl overflow-hidden border border-border"
              >
                <img
                  src={lesson.conceptImageUrl}
                  alt={lesson.conceptCard.heading}
                  className="w-full h-auto object-cover"
                  data-testid="img-concept-visual"
                />
              </motion.div>
            )}

            <ul className="space-y-3 mb-8">
              {lesson.conceptCard.bullets.map((bullet, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-foreground"
                >
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-[#0A66C2]/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-[#0A66C2]" />
                  </span>
                  {bullet}
                </motion.li>
              ))}
            </ul>

            <button
              onClick={() => setStep("quiz")}
              className="w-full py-3 rounded-xl bg-[#0A66C2] text-white font-semibold hover:bg-[#004182] transition-colors flex items-center justify-center gap-2"
              data-testid="button-start-quiz"
            >
              Start Quiz <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (step === "results") {
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= 70;
    const xp = lesson.xpReward;

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {passed ? (
              <div className="w-24 h-24 rounded-full bg-[#0A66C2]/10 flex items-center justify-center mx-auto mb-6">
                <Star className="h-12 w-12 text-[#0A66C2]" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
            )}
          </motion.div>

          <h2 className="text-2xl font-display font-bold text-foreground mb-2" data-testid="text-results-title">
            {passed ? "Lesson Complete!" : "Keep Practicing!"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {passed
              ? `You scored ${score}% — great work!`
              : `You scored ${score}%. You need 70% to pass.`}
          </p>

          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{correctCount}/{totalQuestions}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            {passed && (
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-2xl font-bold text-yellow-500 flex items-center gap-1">
                  <Zap className="h-5 w-5" /> +{xp}
                </p>
                <p className="text-xs text-muted-foreground">XP Earned</p>
              </motion.div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setLocation("/basecamp")}
              className="py-3 rounded-xl bg-[#0A66C2] text-white font-semibold hover:bg-[#004182] transition-colors"
              data-testid="button-back-to-basecamp"
            >
              Back to Base Camp
            </button>
            {!passed && (
              <button
                onClick={() => {
                  setStep(lesson.conceptCard ? "concept" : "quiz");
                  setCurrentQ(0);
                  setSelectedAnswer(null);
                  setAnswerState("unanswered");
                  setHearts(3);
                  setCorrectCount(0);
                  setAnswers({});
                }}
                className="py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-card transition-colors"
                data-testid="button-retry-lesson"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => setLocation("/basecamp")}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-close-lesson"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex-1 h-2.5 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#0A66C2] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`h-4 w-4 transition-colors ${i < hearts ? "text-red-500 fill-red-500" : "text-border"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-8">
        {currentQuestion && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Question {currentQ + 1} of {totalQuestions}
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-6" data-testid="text-question-prompt">
                {currentQuestion.prompt}
              </h3>

              {(currentQuestion.type === "multiple_choice" ||
                currentQuestion.type === "scenario" ||
                currentQuestion.type === "fill_blank") && (
                <div className="space-y-3 flex-1">
                  {(currentQuestion.options as string[]).map((option, i) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectOption = option === currentQuestion.correctAnswer;
                    let optionClass = "border-border bg-card hover:border-[#0A66C2]/50";
                    if (answerState !== "unanswered") {
                      if (isCorrectOption) optionClass = "border-[#0A66C2] bg-[#0A66C2]/10";
                      else if (isSelected && !isCorrectOption) optionClass = "border-red-500 bg-red-500/10";
                      else optionClass = "border-border bg-card opacity-50";
                    } else if (isSelected) {
                      optionClass = "border-[#0A66C2] bg-[#0A66C2]/10";
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => answerState === "unanswered" && setSelectedAnswer(option)}
                        disabled={answerState !== "unanswered"}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${optionClass}`}
                        data-testid={`option-${i}`}
                      >
                        <span className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{
                          borderColor: answerState !== "unanswered" ? (isCorrectOption ? "#0A66C2" : isSelected ? "#ef4444" : "") : (isSelected ? "#0A66C2" : ""),
                        }}>
                          {answerState !== "unanswered" ? (
                            isCorrectOption ? <CheckCircle2 className="h-4 w-4 text-[#0A66C2]" /> :
                            isSelected ? <XCircle className="h-4 w-4 text-red-500" /> :
                            String.fromCharCode(65 + i)
                          ) : String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm text-foreground">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === "drag_order" && (
                <div className="space-y-2 flex-1">
                  {dragItems.map((item, idx) => (
                    <div
                      key={item}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        answerState !== "unanswered"
                          ? currentQuestion.correctAnswer.split(",")[idx] === item
                            ? "border-[#0A66C2] bg-[#0A66C2]/10"
                            : "border-red-500 bg-red-500/10"
                          : "border-border bg-card"
                      }`}
                    >
                      <span className="text-xs font-bold text-muted-foreground w-5">{idx + 1}.</span>
                      <span className="text-sm text-foreground flex-1">{item}</span>
                      {answerState === "unanswered" && (
                        <div className="flex flex-col gap-0.5">
                          {idx > 0 && (
                            <button
                              onClick={() => moveDragItem(idx, idx - 1)}
                              className="p-0.5 text-muted-foreground hover:text-foreground"
                              data-testid={`drag-up-${idx}`}
                            >
                              <ChevronRight className="h-3.5 w-3.5 -rotate-90" />
                            </button>
                          )}
                          {idx < dragItems.length - 1 && (
                            <button
                              onClick={() => moveDragItem(idx, idx + 1)}
                              className="p-0.5 text-muted-foreground hover:text-foreground"
                              data-testid={`drag-down-${idx}`}
                            >
                              <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {currentQuestion.type === "match_pairs" && (
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Match from:</p>
                      {(currentQuestion.options as any).pairs.map((pair: any) => {
                        const isMatched = matchSelections[pair.left] !== undefined;
                        const isActive = matchLeft === pair.left;

                        return (
                          <button
                            key={pair.left}
                            onClick={() => answerState === "unanswered" && handleMatchClick("left", pair.left)}
                            disabled={answerState !== "unanswered"}
                            className={`w-full text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all ${
                              answerState !== "unanswered"
                                ? matchSelections[pair.left] === pair.right
                                  ? "border-[#0A66C2] bg-[#0A66C2]/10"
                                  : matchSelections[pair.left]
                                  ? "border-red-500 bg-red-500/10"
                                  : "border-border"
                                : isActive
                                ? "border-[#0A66C2] bg-[#0A66C2]/10"
                                : isMatched
                                ? "border-[#0A66C2]/30 bg-[#0A66C2]/5"
                                : "border-border bg-card hover:border-[#0A66C2]/50"
                            }`}
                            data-testid={`match-left-${pair.left}`}
                          >
                            {pair.left}
                            {isMatched && answerState === "unanswered" && (
                              <span className="text-xs text-muted-foreground ml-1">
                                → {matchSelections[pair.left]}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Match to:</p>
                      {(currentQuestion.options as any).pairs.map((pair: any) => {
                        const isUsed = Object.values(matchSelections).includes(pair.right);

                        return (
                          <button
                            key={pair.right}
                            onClick={() => answerState === "unanswered" && matchLeft && handleMatchClick("right", pair.right)}
                            disabled={answerState !== "unanswered" || !matchLeft}
                            className={`w-full text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all ${
                              answerState !== "unanswered"
                                ? "border-border"
                                : isUsed
                                ? "border-[#0A66C2]/30 bg-[#0A66C2]/5 opacity-50"
                                : matchLeft
                                ? "border-border bg-card hover:border-[#0A66C2]/50 cursor-pointer"
                                : "border-border bg-card opacity-50"
                            }`}
                            data-testid={`match-right-${pair.right}`}
                          >
                            {pair.right}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {answerState !== "unanswered" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-xl border-2 ${
                      answerState === "correct"
                        ? "border-[#0A66C2]/30 bg-[#0A66C2]/5"
                        : "border-red-500/30 bg-red-500/5"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {answerState === "correct" ? (
                        <CheckCircle2 className="h-5 w-5 text-[#0A66C2]" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`font-semibold text-sm ${answerState === "correct" ? "text-[#0A66C2]" : "text-red-500"}`}>
                        {answerState === "correct" ? "Correct!" : "Not quite"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground" data-testid="text-explanation">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        )}

        <div className="mt-6 pt-4 border-t border-border">
          {answerState === "unanswered" ? (
            <button
              onClick={checkAnswer}
              disabled={
                (currentQuestion?.type === "match_pairs" &&
                  Object.keys(matchSelections).length < ((currentQuestion?.options as any)?.pairs?.length || 0)) ||
                ((currentQuestion?.type === "multiple_choice" ||
                  currentQuestion?.type === "scenario" ||
                  currentQuestion?.type === "fill_blank") &&
                  !selectedAnswer)
              }
              className="w-full py-3 rounded-xl bg-[#0A66C2] text-white font-semibold hover:bg-[#004182] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              data-testid="button-check-answer"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="w-full py-3 rounded-xl bg-[#0A66C2] text-white font-semibold hover:bg-[#004182] transition-colors flex items-center justify-center gap-2"
              data-testid="button-next-question"
            >
              {currentQ + 1 >= totalQuestions || hearts <= 0 ? "See Results" : "Next Question"}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
