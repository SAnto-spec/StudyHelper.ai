import React, { useState } from 'react';
import { HelpCircle, Sparkles, BookOpen, Copy, Bookmark, Check, AlertCircle } from 'lucide-react';
import { solveQuestion } from '../services/ai';

interface AISolverProps {
  onAddActivity: (activity: { type: 'quiz' | 'summary' | 'solver'; title: string }) => void;
}

export default function AISolver({ onAddActivity }: AISolverProps) {
  const [question, setQuestion] = useState('');
  const [level, setLevel] = useState<'beginner' | 'school' | 'college'>('school');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<string[] | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const sampleQuestions = [
    { text: "What is photosynthesis?", label: "Photosynthesis" },
    { text: "How does quantum mechanics work?", label: "Quantum Mechanics" },
    { text: "Why is the sky blue?", label: "Atmospheric Scattering" },
    { text: "Explain inflation in economics.", label: "Macroeconomics" }
  ];

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setSolution(null);
    setError('');
    setCopied(false);
    setSaved(false);

    try {
      const steps = await solveQuestion(question, level);
      setSolution(steps);
      onAddActivity({
        type: 'solver',
        title: question.trim().length > 30 ? question.slice(0, 30) + '...' : question.trim()
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!solution) return;
    const textToCopy = solution.join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToNotes = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
          <HelpCircle className="h-7 w-7 text-blue-500" />
          AI Question Solver
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Type any academic question or mathematical topic and get custom, multi-step explanations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Input Form Column (Takes 1/3 space on larger viewports) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5 h-fit md:sticky md:top-24">
          <form onSubmit={handleSolve} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Academic Level
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                {(['beginner', 'school', 'college'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-1.5 px-2 text-xs font-bold rounded-lg capitalize transition-all ${
                      level === lvl
                        ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="question-input" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Your Question
              </label>
              <textarea
                id="question-input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full h-40 px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder-slate-400"
                placeholder="Ask about thermodynamics, World War 2 alliances, chemical formulas, or poem analyzers..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 text-sm shadow-md hover:shadow-brand-500/20 disabled:opacity-50 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? 'Solving...' : 'Solve Question'}</span>
            </button>
          </form>

          {/* Quick-select templates */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Try Common Topics
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuestion(q.text)}
                  className="text-xs bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 px-2.5 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 transition font-semibold"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Answers Output Area (Takes 2/3 space on larger viewports) */}
        <div className="md:col-span-2 space-y-4">
          
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 p-4 border border-red-200/60 dark:border-red-900/30 text-sm text-red-800 dark:text-red-300 font-semibold rounded-2xl flex items-center gap-2 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Default state: No query yet */}
          {!loading && !solution && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="h-16 w-16 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-full flex items-center justify-center mb-4 border border-blue-100/50 dark:border-blue-900/50">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white font-display">Waiting for Academic Question</h3>
              <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed">
                Choose a topic from the sidebar templates or type your homework questions to unlock step-by-step solutions.
              </p>
            </div>
          )}

          {/* Loading Shimmer panel */}
          {loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg shimmer" />
                <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded shimmer" />
              </div>
              <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-850">
                <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded shimmer" />
                <div className="h-6 w-5/6 bg-slate-100 dark:bg-slate-800 rounded shimmer" />
                <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded shimmer" />
                <div className="h-6 w-4/5 bg-slate-100 dark:bg-slate-800 rounded shimmer" />
              </div>
            </div>
          )}

          {/* Output Display panel */}
          {solution && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-6">
              
              {/* Output Actions Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider capitalize">{level} Level Solution</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 rounded-xl transition"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSaveToNotes}
                    className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 rounded-xl transition"
                    title="Save to folder"
                  >
                    {saved ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-3.5 w-3.5" />
                        <span>Save to Notes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Steps rendering */}
              <div className="space-y-6">
                {solution.map((step, index) => {
                  return (
                    <div key={index} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-100/50 dark:border-blue-900/40 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line pt-0.5">
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom disclaimer */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-start gap-2 text-slate-400 dark:text-slate-500 text-[10px] leading-relaxed">
                <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>AI explanations can support learning but check original university textbooks to verify critical concepts for graded examinations.</span>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
