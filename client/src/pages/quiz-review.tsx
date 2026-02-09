import { useAuth } from "@/lib/auth-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type QuizReviewQuestion, type QuizReviewData, type QuizQuestion } from "@/lib/api";
import { Nav } from "@/components/nav";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  CircleDashed,
  ArrowLeft,
  Trophy,
  Brain,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function QuizReviewPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<{
    chapterId: string;
    reviewQuestion: QuizReviewQuestion;
    fullQuestion: QuizQuestion;
  } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState<string | null>(null);

  const { data: reviewData, isLoading } = useQuery<QuizReviewData>({
    queryKey: ["quiz-review", user?.id],
    queryFn: () => api.getUserQuizReview(user!.id),
    enabled: !!user?.id,
  });

  const handleStartQuiz = async (chapterId: string, question: QuizReviewQuestion) => {
    setLoadingQuestion(question.questionId);
    try {
      const result = await api.getQuizForSlide(chapterId, question.slideIndex);
      const fullQ = result.questions.find((q) => q.id === question.questionId);
      if (fullQ) {
        setActiveQuiz({ chapterId, reviewQuestion: question, fullQuestion: fullQ });
        setSelectedAnswer(null);
        setShowResult(false);
      }
    } catch (error) {
      console.error("Failed to load question:", error);
    } finally {
      setLoadingQuestion(null);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!activeQuiz || selectedAnswer === null || !user) return;
    setSubmitting(true);
    try {
      await api.submitQuizAnswer(
        user.id,
        activeQuiz.chapterId,
        activeQuiz.fullQuestion.id,
        selectedAnswer
      );
      setShowResult(true);
      queryClient.invalidateQueries({ queryKey: ["quiz-review", user.id] });
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const isCorrect = selectedAnswer === activeQuiz?.fullQuestion.correctAnswer;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded" />
            <div className="h-48 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = reviewData
    ? reviewData.chapters.reduce((sum, c) => sum + c.unanswered + c.incorrect, 0)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4" data-testid="link-back-dashboard">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold" data-testid="text-quiz-review-title">Quiz Review</h1>
            <p className="text-sm text-muted-foreground">
              {pendingCount > 0
                ? `${pendingCount} quiz${pendingCount !== 1 ? "zes" : ""} to complete`
                : "All quizzes completed!"}
            </p>
          </div>
        </div>

        {reviewData && (
          <>
            <Card className="mb-6 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Overall Quiz Score</span>
                  </div>
                  <span
                    className={`text-lg font-bold ${
                      reviewData.meetsThreshold ? "text-green-600" : "text-amber-600"
                    }`}
                    data-testid="text-overall-score"
                  >
                    {reviewData.overallScore}%
                  </span>
                </div>
                <Progress
                  value={reviewData.overallScore}
                  className="h-2 mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {reviewData.totalCorrect} of {reviewData.totalQuestions} correct
                  </span>
                  <span>
                    {reviewData.meetsThreshold ? (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Meets 75% requirement
                      </span>
                    ) : (
                      <span className="text-amber-600 font-medium">
                        Need 75% for certification
                      </span>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {reviewData.chapters.map((chapter) => {
                const isExpanded = expandedChapter === chapter.chapterId;
                const allDone = chapter.incorrect === 0 && chapter.unanswered === 0;

                return (
                  <Card key={chapter.chapterId} className={allDone ? "border-green-200 dark:border-green-800" : ""}>
                    <button
                      className="w-full text-left p-4"
                      onClick={() =>
                        setExpandedChapter(isExpanded ? null : chapter.chapterId)
                      }
                      data-testid={`button-chapter-${chapter.chapterOrder}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold truncate">
                              {chapter.chapterTitle}
                            </span>
                            {allDone && (
                              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                              {chapter.correct}
                            </span>
                            <span className="flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-red-500" />
                              {chapter.incorrect}
                            </span>
                            <span className="flex items-center gap-1">
                              <CircleDashed className="w-3 h-3 text-muted-foreground" />
                              {chapter.unanswered}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`text-sm font-bold ${
                              chapter.scorePercent >= 75
                                ? "text-green-600"
                                : chapter.scorePercent > 0
                                ? "text-amber-600"
                                : "text-muted-foreground"
                            }`}
                            data-testid={`text-chapter-score-${chapter.chapterOrder}`}
                          >
                            {chapter.scorePercent}%
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <Progress
                        value={chapter.scorePercent}
                        className="h-1.5 mt-2"
                      />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-2 border-t pt-3">
                            {chapter.questions.map((q, idx) => (
                              <div
                                key={q.questionId}
                                className={`flex items-start gap-3 p-3 rounded-lg border ${
                                  q.status === "correct"
                                    ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                                    : q.status === "incorrect"
                                    ? "bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                                    : "bg-muted/30 border-border"
                                }`}
                                data-testid={`quiz-question-${chapter.chapterOrder}-${idx}`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {q.status === "correct" ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  ) : q.status === "incorrect" ? (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  ) : (
                                    <CircleDashed className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm leading-snug">
                                    {q.question}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Slide {q.slideIndex}
                                  </p>
                                </div>
                                {q.status !== "correct" && (
                                  <Button
                                    size="sm"
                                    variant={q.status === "incorrect" ? "destructive" : "default"}
                                    className="shrink-0 text-xs h-7"
                                    disabled={loadingQuestion === q.questionId}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartQuiz(chapter.chapterId, q);
                                    }}
                                    data-testid={`button-retake-${chapter.chapterOrder}-${idx}`}
                                  >
                                    {loadingQuestion === q.questionId ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : q.status === "incorrect" ? (
                                      <>
                                        <RefreshCw className="w-3 h-3 mr-1" />
                                        Retry
                                      </>
                                    ) : (
                                      "Answer"
                                    )}
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                );
              })}
            </div>

            {pendingCount === 0 && reviewData.meetsThreshold && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center"
              >
                <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-700 dark:text-green-400">
                  All quizzes passed!
                </p>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                  Your quiz average meets the 75% certification requirement.
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {activeQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => !submitting && setActiveQuiz(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-primary/5 border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">
                        {activeQuiz.reviewQuestion.status === "incorrect"
                          ? "Retry Quiz"
                          : "Knowledge Check"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Slide {activeQuiz.reviewQuestion.slideIndex}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveQuiz(null)}
                    disabled={submitting}
                    data-testid="button-close-quiz"
                  >
                    Close
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm font-medium mb-4" data-testid="text-quiz-modal-question">
                  {activeQuiz.fullQuestion.question}
                </p>

                <div className="space-y-2">
                  {activeQuiz.fullQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectAnswer =
                      showResult && index === activeQuiz.fullQuestion.correctAnswer;
                    const isWrongAnswer =
                      showResult && isSelected && !isCorrect;

                    return (
                      <button
                        key={index}
                        onClick={() => !showResult && setSelectedAnswer(index)}
                        disabled={showResult}
                        className={`w-full p-3 rounded-lg text-left transition-all border-2 ${
                          isCorrectAnswer
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : isWrongAnswer
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        data-testid={`button-quiz-option-${index}`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCorrectAnswer
                                ? "bg-green-500 text-white"
                                : isWrongAnswer
                                ? "bg-red-500 text-white"
                                : isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1 text-sm">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showResult && (
                  <div
                    className={`mt-4 p-3 rounded-lg text-sm ${
                      isCorrect
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                    }`}
                  >
                    <p className="font-medium text-sm">
                      {isCorrect ? "Correct!" : "Not quite."}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs text-muted-foreground mt-1">
                        The correct answer is:{" "}
                        {activeQuiz.fullQuestion.options[activeQuiz.fullQuestion.correctAnswer]}
                      </p>
                    )}
                    {activeQuiz.fullQuestion.explanation && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {activeQuiz.fullQuestion.explanation}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  {!showResult ? (
                    <Button
                      className="w-full"
                      disabled={selectedAnswer === null || submitting}
                      onClick={handleSubmitAnswer}
                      data-testid="button-submit-quiz-answer"
                    >
                      {submitting ? "Submitting..." : "Submit Answer"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => setActiveQuiz(null)}
                      data-testid="button-done-quiz"
                    >
                      Done
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
