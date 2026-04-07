import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { BrainCircuit, Loader2, ChevronRight, X } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import api from "../../services/api";
import { cn } from "../../lib/utils";
import BadgeMedalSvg from "../../components/dashboard/BadgeMedalSvg";

type QuizDifficulty = "easy" | "medium" | "hard";

interface SubjectOption {
  id: string;
  name: string;
  slug: string;
}

interface TopicOption {
  id: string;
  name: string;
  slug: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  difficulty: QuizDifficulty;
}

interface GeneratedQuiz {
  quizNumber: string;
  title: string;
  category: string;
  topic: string;
  type: string;
  difficulty: QuizDifficulty;
  questions: QuizQuestion[];
}

interface GenerateQuizResponse {
  quiz?: GeneratedQuiz;
}

interface QuizRewards {
  xpCoins: number;
  coins: number;
  badge: string;
  percentage: number;
  streakDays: number;
  totalXp?: number;
  totalCoins?: number;
  currentBadge?: string;
  freePaperUnlocks?: number;
  newlyUnlockedPapers?: number;
  nextUnlockXp?: number | null;
}

interface CompleteQuizResponse {
  alreadyClaimed?: boolean;
  rewards?: QuizRewards;
}

interface QuizSummaryResponse {
  totalXp: number;
  totalCoins: number;
  currentBadge: string;
  freePaperUnlocks: number;
  nextUnlockXp: number | null;
  streakDays: number;
}

interface QuizAttemptItem {
  id: string;
  quizNumber: string;
  title: string;
  category: string;
  topic: string;
  type: string;
  difficulty: string;
  questionCount: number;
  status: string;
  score: number | null;
  totalQuestions: number | null;
  percentage: number | null;
  generatedAt: string;
  attemptedAt: string | null;
}

interface QuizAttemptsResponse {
  attempts: QuizAttemptItem[];
}

function computeLocalRewards(
  score: number,
  totalQuestions: number,
): QuizRewards {
  const safeTotal = Math.max(1, totalQuestions);
  const safeScore = Math.max(0, Math.min(score, safeTotal));
  const percentage = Math.round((safeScore / safeTotal) * 100);

  const badge =
    percentage >= 90
      ? "Quiz Champion"
      : percentage >= 75
        ? "Gold Scholar"
        : percentage >= 60
          ? "Silver Solver"
          : percentage >= 40
            ? "Bronze Builder"
            : "Rising Learner";

  return {
    xpCoins:
      20 +
      safeScore * 8 +
      (percentage >= 90
        ? 30
        : percentage >= 75
          ? 20
          : percentage >= 60
            ? 10
            : 0),
    coins:
      5 +
      safeScore * 2 +
      (percentage >= 90 ? 10 : percentage >= 75 ? 7 : percentage >= 60 ? 5 : 0),
    badge,
    percentage,
    streakDays: 0,
  };
}

export default function DashboardQuiz() {
  const [quizSubjects, setQuizSubjects] = useState<SubjectOption[]>([]);
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string>("");
  const [quizTopics, setQuizTopics] = useState<TopicOption[]>([]);
  const [selectedTopicName, setSelectedTopicName] = useState<string>("");
  const [topicLoading, setTopicLoading] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [activeQuiz, setActiveQuiz] = useState<GeneratedQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizRewards, setQuizRewards] = useState<QuizRewards | null>(null);
  const [rewardLoading, setRewardLoading] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [quizSummary, setQuizSummary] = useState<QuizSummaryResponse | null>(
    null,
  );
  const [quizAttempts, setQuizAttempts] = useState<QuizAttemptItem[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const loadQuizAttempts = useCallback(() => {
    api
      .get<QuizAttemptsResponse>("/quiz/attempts")
      .then((res) => {
        const attempts = Array.isArray(res.data?.attempts)
          ? res.data.attempts
          : [];
        setQuizAttempts(attempts);
      })
      .catch(() => setQuizAttempts([]));
  }, []);

  useEffect(() => {
    api
      .get<QuizSummaryResponse>("/quiz/summary")
      .then((res) => setQuizSummary(res.data))
      .catch(() => setQuizSummary(null));

    loadQuizAttempts();

    api
      .get("/prep/subjects")
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : [];
        const mapped = raw
          .map((s: { id?: string; name?: string; slug?: string }) => ({
            id: s.id || "",
            name: s.name || "",
            slug: s.slug || "",
          }))
          .filter((s: SubjectOption) => s.id && s.name && s.slug);

        setQuizSubjects(mapped);
        if (mapped.length > 0) {
          setSelectedSubjectSlug(mapped[0].slug);
        }
      })
      .catch(() => {
        setQuizSubjects([]);
      });
  }, [loadQuizAttempts]);

  useEffect(() => {
    if (!selectedSubjectSlug) {
      setQuizTopics([]);
      setSelectedTopicName("");
      return;
    }

    setTopicLoading(true);
    api
      .get(`/prep/subjects/${selectedSubjectSlug}/topics`)
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : [];
        const mapped = raw
          .map((t: { id?: string; name?: string; slug?: string }) => ({
            id: t.id || "",
            name: t.name || "",
            slug: t.slug || "",
          }))
          .filter((t: TopicOption) => t.id && t.name && t.slug);

        setQuizTopics(mapped);
        setSelectedTopicName(mapped[0]?.name || "");
      })
      .catch(() => {
        setQuizTopics([]);
        setSelectedTopicName("");
      })
      .finally(() => setTopicLoading(false));
  }, [selectedSubjectSlug]);

  const activeSubjectName =
    quizSubjects.find((s) => s.slug === selectedSubjectSlug)?.name ||
    "General 11+";

  const startTopicQuiz = async () => {
    if (!selectedSubjectSlug || !selectedTopicName) {
      setQuizError("Please select both a category and a topic first.");
      return;
    }

    setQuizError("");
    setGenerating(true);

    try {
      const response = await api.post<GenerateQuizResponse>("/quiz/generate", {
        title: `${activeSubjectName} - ${selectedTopicName}`,
        category: activeSubjectName,
        topic: selectedTopicName,
        type: "Topic Practice",
        difficulty: "medium",
        questionCount: 10,
      });

      const generatedQuiz = response.data?.quiz;
      if (!generatedQuiz || !Array.isArray(generatedQuiz.questions)) {
        throw new Error("Invalid quiz payload");
      }

      setActiveQuiz(generatedQuiz);
      setCurrentQuestionIndex(0);
      setSelectedAnswers(new Array(generatedQuiz.questions.length).fill(-1));
      setIsQuizSubmitted(false);
      setQuizRewards(null);
      setAlreadyClaimed(false);
      setIsPreviewOpen(true);
    } catch (error) {
      const apiMessage = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      setQuizError(
        apiMessage ||
          "We could not generate your topic quiz right now. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const currentQuestion = activeQuiz?.questions[currentQuestionIndex] ?? null;
  const hasSelectedCurrent =
    currentQuestionIndex >= 0 && selectedAnswers[currentQuestionIndex] >= 0;
  const allAnswered =
    selectedAnswers.length > 0 && selectedAnswers.every((value) => value >= 0);

  const quizScore =
    activeQuiz && isQuizSubmitted
      ? activeQuiz.questions.reduce((acc, question, index) => {
          return (
            acc + (selectedAnswers[index] === question.answerIndex ? 1 : 0)
          );
        }, 0)
      : 0;

  const quizScorePercent =
    activeQuiz && activeQuiz.questions.length > 0
      ? Math.round((quizScore / activeQuiz.questions.length) * 100)
      : 0;

  const formatAttemptDate = (iso: string | null) => {
    if (!iso) return "-";
    const value = new Date(iso);
    if (Number.isNaN(value.getTime())) return "-";
    return value.toLocaleString();
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;

    setIsQuizSubmitted(true);
    setRewardLoading(true);

    const localRewards = computeLocalRewards(
      quizScore,
      activeQuiz.questions.length,
    );

    try {
      const response = await api.post<CompleteQuizResponse>("/quiz/complete", {
        quizNumber: activeQuiz.quizNumber,
        title: activeQuiz.title,
        score: quizScore,
        totalQuestions: activeQuiz.questions.length,
        topic: activeQuiz.topic,
        category: activeQuiz.category,
        type: activeQuiz.type,
        difficulty: activeQuiz.difficulty,
        selectedAnswers,
      });

      const mergedRewards = {
        ...localRewards,
        ...(response.data?.rewards || {}),
      };

      setAlreadyClaimed(Boolean(response.data?.alreadyClaimed));
      setQuizRewards(mergedRewards);

      if (
        typeof mergedRewards.totalXp === "number" &&
        typeof mergedRewards.totalCoins === "number" &&
        typeof mergedRewards.freePaperUnlocks === "number"
      ) {
        setQuizSummary({
          totalXp: mergedRewards.totalXp,
          totalCoins: mergedRewards.totalCoins,
          currentBadge: mergedRewards.currentBadge || mergedRewards.badge,
          freePaperUnlocks: mergedRewards.freePaperUnlocks,
          nextUnlockXp:
            typeof mergedRewards.nextUnlockXp === "number"
              ? mergedRewards.nextUnlockXp
              : null,
          streakDays:
            typeof mergedRewards.streakDays === "number"
              ? mergedRewards.streakDays
              : 0,
        });
      }
    } catch {
      setAlreadyClaimed(false);
      setQuizRewards(localRewards);
    } finally {
      loadQuizAttempts();
      setRewardLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 pt-10">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
          <BrainCircuit size={12} className="text-pink-400" />
          <span>Dashboard Quiz</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
          AI Quiz <span className="text-white/40">Section.</span>
        </h1>
        <p className="text-white/50 max-w-2xl">
          Select a category and topic to generate 10 questions in 11+ GL
          Assessment style.
        </p>
      </motion.header>

      <Card className="border-white/10 bg-white/[0.02] rounded-[2rem]">
        <CardContent className="p-6 md:p-8 space-y-5">
          {quizSummary && (
            <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200/70 mb-2 font-black">
                Your Quiz Wallet
              </p>
              <div className="flex items-center gap-3 mb-3">
                <BadgeMedalSvg badgeName={quizSummary.currentBadge} size={52} />
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-amber-100/80">
                    Current Level
                  </p>
                  <p className="text-lg font-black text-amber-50 leading-tight">
                    {quizSummary.currentBadge}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-wider">
                <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100">
                  Total XP: {quizSummary.totalXp}
                </span>
                <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100">
                  Total Coins: {quizSummary.totalCoins}
                </span>
                <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100">
                  Badge: {quizSummary.currentBadge}
                </span>
                <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100">
                  Free Premium Papers: {quizSummary.freePaperUnlocks}
                </span>
                {typeof quizSummary.nextUnlockXp === "number" && (
                  <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100">
                    Next Free Paper: {quizSummary.nextUnlockXp} XP
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={selectedSubjectSlug}
              onChange={(e) => setSelectedSubjectSlug(e.target.value)}
              aria-label="Quiz category"
              className="px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl text-white text-sm font-medium outline-none focus:border-white/20"
            >
              {quizSubjects.length === 0 ? (
                <option value="" className="bg-black text-white">
                  No categories available
                </option>
              ) : (
                quizSubjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.slug}
                    className="bg-black text-white"
                  >
                    {subject.name}
                  </option>
                ))
              )}
            </select>

            <select
              value={selectedTopicName}
              onChange={(e) => setSelectedTopicName(e.target.value)}
              aria-label="Quiz topic"
              className="px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl text-white text-sm font-medium outline-none focus:border-white/20"
              disabled={topicLoading || quizTopics.length === 0}
            >
              {topicLoading ? (
                <option value="" className="bg-black text-white">
                  Loading topics...
                </option>
              ) : quizTopics.length === 0 ? (
                <option value="" className="bg-black text-white">
                  No topics for this category
                </option>
              ) : (
                quizTopics.map((topic) => (
                  <option
                    key={topic.id}
                    value={topic.name}
                    className="bg-black text-white"
                  >
                    {topic.name}
                  </option>
                ))
              )}
            </select>

            <Button
              onClick={() => {
                void startTopicQuiz();
              }}
              disabled={
                generating || !selectedSubjectSlug || !selectedTopicName
              }
              className="h-12 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold"
            >
              {generating ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate 10-Question Quiz"
              )}
            </Button>
          </div>

          {quizError && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-red-200 text-sm">
              {quizError}
            </div>
          )}

          {activeQuiz && !isPreviewOpen && (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-sm text-emerald-100/90">
                A generated quiz is ready to attempt in the preview window.
              </p>
              <Button
                onClick={() => setIsPreviewOpen(true)}
                className="h-10 rounded-xl bg-emerald-400 text-black font-bold"
              >
                Open Quiz Preview
              </Button>
            </div>
          )}

          {quizAttempts.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3 font-black">
                Saved Quiz Attempts
              </p>
              <div className="space-y-2">
                {quizAttempts.slice(0, 8).map((attempt) => (
                  <div
                    key={attempt.id}
                    className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <p className="text-sm text-white font-semibold">
                        {attempt.title}
                      </p>
                      <p className="text-xs text-white/50">
                        {attempt.category} - {attempt.topic} - {attempt.type}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-black">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full border",
                          attempt.status === "attempted"
                            ? "border-emerald-400/40 text-emerald-200"
                            : "border-amber-300/40 text-amber-100",
                        )}
                      >
                        {attempt.status}
                      </span>
                      <span className="px-2 py-1 rounded-full border border-white/20 text-white/70">
                        {attempt.score ?? 0}/
                        {attempt.totalQuestions ?? attempt.questionCount}
                      </span>
                      <span className="px-2 py-1 rounded-full border border-white/20 text-white/70 normal-case tracking-normal font-medium">
                        {formatAttemptDate(
                          attempt.attemptedAt || attempt.generatedAt,
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {activeQuiz &&
        currentQuestion &&
        isPreviewOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 md:p-8 overflow-y-auto"
            onClick={() => setIsPreviewOpen(false)}
          >
            <div
              className="mx-auto w-full max-w-4xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Card className="border-white/10 bg-black/80 rounded-[2rem]">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-white">
                        {activeQuiz.title}
                      </h2>
                      <p className="text-sm text-white/50 mt-1">
                        {activeQuiz.category} - {activeQuiz.topic} -{" "}
                        {activeQuiz.questions.length} Questions
                      </p>
                      <p className="text-xs text-white/40 uppercase tracking-[0.2em] mt-1">
                        Quiz Number: {activeQuiz.quizNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(false)}
                      className="h-10 w-10 rounded-full border border-white/20 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center"
                      aria-label="Close quiz preview"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {!isQuizSubmitted ? (
                    <>
                      <div className="flex items-center justify-between mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                        <span>
                          Question {currentQuestionIndex + 1} of{" "}
                          {activeQuiz.questions.length}
                        </span>
                        <span>{activeQuiz.difficulty}</span>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">
                          {currentQuestion.question}
                        </h3>
                      </div>

                      <div className="grid gap-3 mb-8">
                        {currentQuestion.options.map((option, optionIndex) => {
                          const isSelected =
                            selectedAnswers[currentQuestionIndex] ===
                            optionIndex;
                          return (
                            <button
                              key={`${currentQuestionIndex}-${optionIndex}`}
                              onClick={() => {
                                setSelectedAnswers((prev) => {
                                  const next = [...prev];
                                  next[currentQuestionIndex] = optionIndex;
                                  return next;
                                });
                              }}
                              className={cn(
                                "w-full text-left p-4 rounded-xl border transition-all",
                                isSelected
                                  ? "border-pink-400/60 bg-pink-500/10 text-white"
                                  : "border-white/10 bg-white/[0.02] text-white/80 hover:border-white/30",
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50 leading-6 shrink-0">
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                                <span className="text-base font-semibold leading-6 text-white/95 whitespace-normal break-words">
                                  {option || "Option text unavailable"}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <Button
                          onClick={() =>
                            setCurrentQuestionIndex((prev) =>
                              Math.max(0, prev - 1),
                            )
                          }
                          disabled={currentQuestionIndex === 0}
                          className="h-12 px-6 rounded-xl bg-white/5 text-white hover:bg-white/10 disabled:opacity-40"
                        >
                          Previous
                        </Button>

                        {currentQuestionIndex <
                        activeQuiz.questions.length - 1 ? (
                          <Button
                            onClick={() =>
                              setCurrentQuestionIndex((prev) =>
                                Math.min(
                                  activeQuiz.questions.length - 1,
                                  prev + 1,
                                ),
                              )
                            }
                            disabled={!hasSelectedCurrent}
                            className="h-12 px-6 rounded-xl bg-white text-black disabled:opacity-40"
                          >
                            Next
                            <ChevronRight size={14} className="ml-1" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              void submitQuiz();
                            }}
                            disabled={!allAnswered}
                            className="h-12 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white disabled:opacity-40"
                          >
                            Submit Quiz
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-6">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">
                          Final Score
                        </p>
                        <p className="text-3xl font-black text-white">
                          {quizScore}/{activeQuiz.questions.length}
                        </p>
                        <p className="text-sm text-white/60">
                          {quizScorePercent}% correct
                        </p>
                      </div>

                      <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 mb-6">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200/70 mb-2 font-black">
                          Rewards Unlocked
                        </p>
                        {alreadyClaimed && (
                          <p className="text-xs text-amber-100/80 mb-3">
                            Rewards for this quiz were already claimed before,
                            so no additional XP or coins were added this time.
                          </p>
                        )}
                        {rewardLoading && !quizRewards ? (
                          <p className="text-sm text-amber-100/80">
                            Calculating rewards...
                          </p>
                        ) : (
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100 text-xs font-black uppercase tracking-wider">
                              Badge: {quizRewards?.badge || "Rising Learner"}
                            </span>
                            <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100 text-xs font-black uppercase tracking-wider">
                              XP: +{quizRewards?.xpCoins || 0}
                            </span>
                            <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100 text-xs font-black uppercase tracking-wider">
                              Coins: +{quizRewards?.coins || 0}
                            </span>
                            <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100 text-xs font-black uppercase tracking-wider">
                              Level Badge:{" "}
                              {quizRewards?.currentBadge ||
                                quizRewards?.badge ||
                                "Rising Learner"}
                            </span>
                            <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100 text-xs font-black uppercase tracking-wider">
                              Free Premium Papers:{" "}
                              {quizRewards?.freePaperUnlocks || 0}
                            </span>
                            {typeof quizRewards?.totalXp === "number" && (
                              <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100 text-xs font-black uppercase tracking-wider">
                                Total XP: {quizRewards.totalXp}
                              </span>
                            )}
                            {typeof quizRewards?.nextUnlockXp === "number" &&
                              typeof quizRewards?.totalXp === "number" && (
                                <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100 text-xs font-black uppercase tracking-wider">
                                  Next Free Paper: {quizRewards.nextUnlockXp} XP
                                </span>
                              )}
                            {typeof quizRewards?.streakDays === "number" &&
                              quizRewards.streakDays > 0 && (
                                <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-100 text-xs font-black uppercase tracking-wider">
                                  Quiz Streak: {quizRewards.streakDays} days
                                </span>
                              )}
                          </div>
                        )}
                        {typeof quizRewards?.newlyUnlockedPapers === "number" &&
                          quizRewards.newlyUnlockedPapers > 0 && (
                            <p className="text-xs text-emerald-200 mt-3 font-bold">
                              Great work! You unlocked{" "}
                              {quizRewards.newlyUnlockedPapers} free premium
                              paper
                              {quizRewards.newlyUnlockedPapers > 1 ? "s" : ""}.
                            </p>
                          )}
                      </div>

                      <div className="space-y-3">
                        {activeQuiz.questions.map((question, index) => {
                          const picked = selectedAnswers[index];
                          const correct = picked === question.answerIndex;
                          return (
                            <div
                              key={`result-${index}`}
                              className={cn(
                                "rounded-xl border p-4",
                                correct
                                  ? "border-emerald-500/40 bg-emerald-500/10"
                                  : "border-red-500/40 bg-red-500/10",
                              )}
                            >
                              <p className="text-white font-semibold mb-2">
                                Q{index + 1}. {question.question}
                              </p>
                              <p className="text-sm text-white/80 mb-1">
                                Your answer:{" "}
                                {picked >= 0
                                  ? question.options[picked]
                                  : "Not answered"}
                              </p>
                              <p className="text-sm text-white/90 mb-2">
                                Correct answer:{" "}
                                {question.options[question.answerIndex]}
                              </p>
                              <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-xs text-white/70">
                                {question.explanation}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
