import React, { useState } from 'react';
import { FileText, Sparkles, BookOpen, Layers, Check, Copy, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { summarizeNotes } from '../services/ai';
import type { Flashcard } from '../services/mockData';

interface NotesSummarizerProps {
  onAddActivity: (activity: { type: 'quiz' | 'summary' | 'solver'; title: string }) => void;
}

export default function NotesSummarizer({ onAddActivity }: NotesSummarizerProps) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ name: string; base64: string; mimeType: string } | null>(null);
  
  // Results
  const [summary, setSummary] = useState<string[] | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards'>('summary');
  
  // Flashcard Player State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStatuses, setCardStatuses] = useState<Record<number, 'review' | 'mastered'>>({});

  const [copied, setCopied] = useState(false);

  const sampleNotes = [
    {
      label: "Cell Structure Notes",
      text: `Cell biology notes: The cell is the basic building block of all life. 
There are two main cellular types: Prokaryotic and Eukaryotic.
Prokaryotic organisms (like single-cell bacteria) lack a distinct nucleus and membrane-bound organelles.
Eukaryotic organisms (found in plants, animals, and fungi) have complex structures including a defined nucleus holding chromosomes.
Key Organelles:
1. Mitochondria: Powerhouses converting glucose into energy (ATP).
2. Nucleus: The cell manager containing DNA code.
3. Ribosomes: Protein factories.
4. Cell membrane: Bilayer regulating molecule entrance.`
    },
    {
      label: "French Revolution Summary",
      text: `Historical Notes: The French Revolution took place from 1789 to 1799. 
It started because of massive economic distress, rising food costs, and massive social inequality inside the Estates System.
Key incidents include:
1. The Storming of the Bastille on July 14, 1789, where commoners seized the royal fortress.
2. The drafting of the Declaration of the Rights of Man.
3. The Reign of Terror (1793-1794) led by Maximilien Robespierre, during which thousands were guillotined.
The Revolution concluded when general Napoleon Bonaparte carried out a military coup and established the French Empire.`
    }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPEG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setSelectedImage({
        name: file.name,
        base64: base64String,
        mimeType: file.type
      });
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() && !selectedImage) return;

    setLoading(true);
    setSummary(null);
    setError('');
    setFlashcards([]);
    setCardIndex(0);
    setIsFlipped(false);
    setCardStatuses({});

    try {
      const data = await summarizeNotes(notes, selectedImage || undefined);
      setSummary(data.summary);
      setFlashcards(data.flashcards);
      setActiveTab('summary');
      
      onAddActivity({
        type: 'summary',
        title: notes.trim()
          ? (notes.trim().length > 30 ? notes.slice(0, 30) + '...' : notes.trim())
          : `Photo analysis (${selectedImage?.name})`
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkStatus = (status: 'review' | 'mastered') => {
    if (flashcards.length === 0) return;
    const activeCardId = flashcards[cardIndex].id;
    
    setCardStatuses(prev => ({
      ...prev,
      [activeCardId]: status
    }));

    // Auto-advance to next card after a small delay
    if (cardIndex < flashcards.length - 1) {
      setTimeout(() => {
        setIsFlipped(false);
        setCardIndex(idx => idx + 1);
      }, 300);
    }
  };

  // Calculations for Flashcard statistics
  const masteredCount = Object.values(cardStatuses).filter(s => s === 'mastered').length;
  const reviewCount = Object.values(cardStatuses).filter(s => s === 'review').length;
  const progressPercent = flashcards.length > 0 
    ? Math.round((Object.keys(cardStatuses).length / flashcards.length) * 100) 
    : 0;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
          <FileText className="h-7 w-7 text-indigo-500" />
          Notes Summarizer & Flashcards
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Paste textbook paragraphs, syllabus lists, or notes to get clean bullet summaries and study cards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Paste Box Panel (Left Column: takes 2/5 space) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5 h-fit">
          <form onSubmit={handleSummarize} className="space-y-4">
            {/* Image Upload Area */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Upload Notes Image/Photo (Optional)
              </span>
              
              {!selectedImage ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500/50 rounded-2xl p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950/20 transition-all duration-150 group">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="bg-slate-50 dark:bg-slate-900 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/20 p-2 rounded-xl text-slate-400 group-hover:text-brand-500 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Click to upload photo</p>
                    <p className="text-[10px] text-slate-400">PNG, JPG, WEBP</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange} 
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800 flex items-center justify-center flex-shrink-0">
                      <img 
                        src={`data:${selectedImage.mimeType};base64,${selectedImage.base64}`} 
                        alt="Preview" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                        {selectedImage.name}
                      </p>
                      <p className="text-[10px] text-emerald-500 font-bold">Ready to analyze</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="text-xs font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 px-2.5 py-1.5 rounded-xl transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="notes-input" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Lecture Notes or Textbook Paragraphs
              </label>
              <textarea
                id="notes-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-80 px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder-slate-400 leading-relaxed"
                placeholder="Paste long textbook sections, essay paragraphs, or raw notes..."
                required={!selectedImage}
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!notes.trim() && !selectedImage)}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 text-sm shadow-md hover:shadow-brand-500/20 disabled:opacity-50 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? 'Summarizing...' : 'Summarize Notes'}</span>
            </button>
          </form>

          {/* Quick Paste Templates */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quick Paste Templates
            </span>
            <div className="flex flex-col gap-2">
              {sampleNotes.map((note, idx) => (
                <button
                  key={idx}
                  onClick={() => setNotes(note.text)}
                  className="text-left text-xs bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-350 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50 transition font-semibold truncate"
                >
                  📄 {note.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Screen Panel (Right Column: takes 3/5 space) */}
        <div className="lg:col-span-3 space-y-4">
          
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 p-4 border border-red-200/60 dark:border-red-900/30 text-sm text-red-800 dark:text-red-300 font-semibold rounded-2xl flex items-center gap-2 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Waiting State */}
          {!loading && !summary && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-full flex items-center justify-center mb-4 border border-indigo-100/50 dark:border-indigo-900/50">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white font-display">Waiting for Lecture Notes</h3>
              <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed">
                Copy and paste note scripts from your lessons into the workspace editor to extract core bullet points and flip-cards.
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 space-y-5 min-h-[400px]">
              <div className="flex space-x-2">
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg shimmer" />
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg shimmer" />
              </div>
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-850">
                <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded shimmer" />
                <div className="h-6 w-4/5 bg-slate-100 dark:bg-slate-800 rounded shimmer" />
                <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded shimmer" />
                <div className="h-6 w-3/4 bg-slate-100 dark:bg-slate-800 rounded shimmer" />
              </div>
            </div>
          )}

          {/* Summary / Flashcards Output */}
          {summary && (
            <div className="space-y-4">
              
              {/* Tab Selector Buttons */}
              <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl w-fit">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-bold rounded-xl transition ${
                    activeTab === 'summary'
                      ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-300'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Bullet Summary</span>
                </button>
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-bold rounded-xl transition ${
                    activeTab === 'flashcards'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-300'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  <span>Interactive Flashcards</span>
                  <span className="ml-1 text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-full">
                    {flashcards.length}
                  </span>
                </button>
              </div>

              {/* Tab 1: Bullet Point Summary */}
              {activeTab === 'summary' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-6">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Key Takeaways</span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Summary</span>
                        </>
                      )}
                    </button>
                  </div>

                  <ul className="space-y-4">
                    {summary.map((point, index) => (
                      <li key={index} className="flex items-start space-x-3 text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                        <span className="whitespace-pre-line">{point}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              )}

              {/* Tab 2: Flashcards Player Game */}
              {activeTab === 'flashcards' && flashcards.length > 0 && (
                <div className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
                  
                  {/* Progress panel */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Mastery Progress</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{progressPercent}% Reviewed</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full transition-all duration-350" style={{ width: `${(masteredCount/flashcards.length)*100}%` }} />
                      <div className="bg-red-400 h-full transition-all duration-350" style={{ width: `${(reviewCount/flashcards.length)*100}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                      <span className="text-emerald-500">🏆 {masteredCount} Mastered</span>
                      <span className="text-red-500">⚠️ {reviewCount} Review Needed</span>
                    </div>
                  </div>

                  {/* 3D Flippable card deck structure */}
                  <div className="flex items-center justify-center py-6">
                    <div 
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="w-full max-w-md h-60 cursor-pointer relative perspective"
                    >
                      <div className={`w-full h-full duration-500 transform-style preserve-3d transition-transform ${
                        isFlipped ? 'rotate-y-180' : ''
                      }`}>
                        
                        {/* Card Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-50 to-white dark:from-slate-950 dark:to-slate-900 border-2 border-indigo-200/50 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-md hover:shadow-indigo-500/5 transition duration-300">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full">
                              Question Card {cardIndex + 1}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">Click card to Flip</span>
                          </div>
                          <div className="text-center font-bold text-base sm:text-lg text-slate-900 dark:text-white px-2">
                            {flashcards[cardIndex].front}
                          </div>
                          <div className="flex justify-center text-indigo-500 text-xs font-bold flex-items items-center gap-1">
                            <RefreshCw className="h-4.5 w-4.5 animate-spin-slow" />
                            <span>Click to Flip Card</span>
                          </div>
                        </div>

                        {/* Card Back Side */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-slate-950 border-2 border-emerald-500/30 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-md">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                              Correct Answer
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">Click card to Flip back</span>
                          </div>
                          <div className="text-center font-medium text-sm sm:text-base text-slate-700 dark:text-slate-200 px-2 leading-relaxed">
                            {flashcards[cardIndex].back}
                          </div>
                          <div className="text-xs font-semibold text-slate-400 text-center">
                            Answer Revealed
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Active Recall feedback triggers */}
                  {isFlipped && (
                    <div className="flex justify-center gap-4 animate-fade-in max-w-sm mx-auto">
                      <button
                        onClick={() => handleMarkStatus('review')}
                        className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold py-2.5 rounded-xl border border-red-200/50 dark:border-red-900/30 text-xs transition"
                      >
                        ⚠️ Need Review
                      </button>
                      <button
                        onClick={() => handleMarkStatus('mastered')}
                        className="flex-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold py-2.5 rounded-xl border border-emerald-200/50 dark:border-emerald-900/30 text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>🏆 Mastered</span>
                      </button>
                    </div>
                  )}

                  {/* Card selector controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-850">
                    <button
                      onClick={() => { setIsFlipped(false); setCardIndex(idx => Math.max(0, idx - 1)); }}
                      disabled={cardIndex === 0}
                      className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition"
                    >
                      <ArrowLeft className="h-4.5 w-4.5" />
                      <span>Prev</span>
                    </button>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Card {cardIndex + 1} of {flashcards.length}
                    </span>
                    <button
                      onClick={() => { setIsFlipped(false); setCardIndex(idx => Math.min(flashcards.length - 1, idx + 1)); }}
                      disabled={cardIndex === flashcards.length - 1}
                      className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition"
                    >
                      <span>Next</span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
