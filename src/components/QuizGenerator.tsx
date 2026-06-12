import React, { useState } from 'react';
import { CheckSquare, Sparkles, Trophy, ArrowRight, Check, X, RefreshCw, Star, AlertCircle } from 'lucide-react';
import { generateQuiz } from '../services/ai';
import type { QuizQuestion } from '../services/mockData';

interface QuizGeneratorProps {
  onAddActivity: (activity: { type: 'quiz' | 'summary' | 'solver'; title: string }) => void;
  onIncrementQuizzes: (scorePercentage: number) => void;
}

export default function QuizGenerator({ onAddActivity, onIncrementQuizzes }: QuizGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Game states: 'setup' | 'playing' | 'results'
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Custom DOM Confetti/Particle implementation to avoid TypeScript types mismatches
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number; delay: number }>>([]);

  const triggerConfetti = () => {
    const colors = ['#0ea5e9', '#6366f1', '#38bdf8', '#a855f7', '#f43f5e', '#10b981'];
    const newParticles = Array.from({ length: 45 }).map((_, i) => ({
      id: Math.random() + i,
      x: Math.random() * 100, // percentage left
      y: Math.random() * 40 + 100, // start from bottom
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 6,
      delay: Math.random() * 1.5
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 4000);
  };

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setError('');
    setScore(0);

    try {
      const generated = await generateQuiz(topic, count);
      setQuestions(generated);
      setGameState('playing');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const activeQuestion = questions[currentIndex];

    // Increment score if correct
    if (selectedOption === activeQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(idx => idx + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished!
      setGameState('results');
      const finalScore = score + (selectedOption === questions[currentIndex].correctAnswer ? 1 : 0);
      const percentage = Math.round((finalScore / questions.length) * 100);
      onIncrementQuizzes(percentage);
      
      onAddActivity({
        type: 'quiz',
        title: `Quiz on ${topic.trim()} (${finalScore}/${questions.length})`
      });
      
      if (finalScore >= questions.length * 0.7) {
        triggerConfetti();
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto relative overflow-hidden">
      
      {/* Custom Confetti Layer */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none animate-bounce"
          style={{
            left: `${p.x}%`,
            bottom: '0px',
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0.8,
            transform: 'translateY(-100vh)',
            transition: `transform 2.5s cubic-bezier(0.25, 1, 0.5, 1) ${p.delay}s`,
            animation: `fadeIn 0.5s ease-out, slideUp 2.8s cubic-bezier(0.1, 0.8, 0.3, 1) ${p.delay}s forwards`
          }}
        />
      ))}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
          <CheckSquare className="h-7 w-7 text-sky-500" />
          AI Quiz Generator
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Test your comprehension. Set a subject and difficulty parameter, and AI will prepare a review quiz.
        </p>
      </div>

      {/* 1. Setup Form Screen */}
      {gameState === 'setup' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 sm:p-8 rounded-3xl max-w-2xl mx-auto space-y-4">
          
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 p-4 border border-red-200/60 dark:border-red-900/30 text-sm text-red-800 dark:text-red-300 font-semibold rounded-2xl flex items-center gap-2 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleStartQuiz} className="space-y-6">
            
            <div>
              <label htmlFor="topic-input" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Quiz Topic / Subject
              </label>
              <input
                id="topic-input"
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
                placeholder="e.g. Photosynthesis, Ancient Rome, Artificial Intelligence, Organic Chemistry..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Question Count selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Number of Questions
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([5, 10, 20] as const).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCount(num)}
                      className={`py-2 px-3 border rounded-xl text-sm font-bold transition-all ${
                        count === num
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 font-extrabold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350'
                      }`}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 px-3 border rounded-xl text-sm font-bold capitalize transition-all ${
                        difficulty === diff
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 font-extrabold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 text-sm shadow-md hover:shadow-brand-500/20 disabled:opacity-50 transition"
            >
              <Sparkles className="h-4.5 w-4.5 animate-spin-slow" />
              <span>{loading ? 'Creating Quiz...' : 'Generate Quiz Sheet'}</span>
            </button>
          </form>

        </div>
      )}

      {/* 2. Playing/Active Game Screen */}
      {gameState === 'playing' && questions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
          
          {/* Header Stats Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Topic: <span className="text-slate-700 dark:text-slate-200">{topic}</span>
            </span>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 px-2.5 py-1 rounded-full">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Progress gauge */}
          <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {questions[currentIndex].question}
            </h3>
            
            {/* Multiple choices options */}
            <div className="space-y-3">
              {questions[currentIndex].options.map((option, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = questions[currentIndex].correctAnswer === optIdx;
                
                let optionStyle = "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850";
                
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-semibold";
                  } else if (isSelected) {
                    optionStyle = "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 font-semibold";
                  } else {
                    optionStyle = "border-slate-200 dark:border-slate-850 text-slate-450 dark:text-slate-500 opacity-60";
                  }
                } else if (isSelected) {
                  optionStyle = "border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 font-semibold";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 border rounded-2xl text-sm transition-all flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{option}</span>
                    
                    {/* Visual icons */}
                    {isAnswerSubmitted && isCorrect && (
                      <span className="p-1 bg-emerald-500 text-white rounded-full flex-shrink-0">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <span className="p-1 bg-red-500 text-white rounded-full flex-shrink-0">
                        <X className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation panel */}
          {isAnswerSubmitted && (
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/50 dark:border-slate-800 text-xs animate-slide-up leading-relaxed">
              <span className="block font-bold text-slate-600 dark:text-slate-350 uppercase mb-1">
                💡 Explanation
              </span>
              <p className="text-slate-500 dark:text-slate-400">
                {questions[currentIndex].explanation}
              </p>
            </div>
          )}

          {/* Navigation Action controls */}
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-brand-500/20 disabled:opacity-50 transition"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-brand-500/20 transition flex items-center space-x-1.5"
              >
                <span>{currentIndex === questions.length - 1 ? 'See Results' : 'Next Question'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* 3. Results Screen */}
      {gameState === 'results' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-6">
          
          <div className="inline-flex p-4 bg-brand-50 dark:bg-brand-950/20 text-brand-500 dark:text-brand-400 rounded-full border border-brand-100 dark:border-brand-900/30">
            <Trophy className="h-10 w-10 animate-bounce-slow" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white font-display">
              Quiz Completed!
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Great effort reviewing the topic: <span className="font-semibold">{topic}</span>
            </p>
          </div>

          {/* Score display widget */}
          <div className="max-w-xs mx-auto bg-slate-50 dark:bg-slate-950 p-6 border border-slate-150 dark:border-slate-850 rounded-3xl">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Final Score</span>
            <span className="block text-5xl font-extrabold text-brand-600 dark:text-brand-400 font-display mt-2">
              {score} / {questions.length}
            </span>
            <span className="block text-xs font-semibold text-slate-500 mt-2">
              {Math.round((score / questions.length) * 100)}% Accuracy rate
            </span>
            
            {/* Stars rating visual indicator */}
            <div className="flex justify-center space-x-1 mt-4">
              {Array.from({ length: 5 }).map((_, i) => {
                const fillRatio = score / questions.length;
                const starVal = (i + 1) / 5;
                const active = fillRatio >= starVal - 0.1;
                return (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      active ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-850'
                    }`} 
                  />
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex gap-4 max-w-sm mx-auto">
            <button
              onClick={() => setGameState('setup')}
              className="flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold py-3 rounded-xl text-sm transition"
            >
              Try Another Topic
            </button>
            <button
              onClick={handleStartQuiz}
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl text-sm shadow-md hover:shadow-brand-500/20 transition flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="h-4.5 w-4.5" />
              <span>Retry Quiz</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
