import React, { useState } from 'react';
import { Calendar, Sparkles, Clock, CalendarRange, CheckCircle, Circle, Plus } from 'lucide-react';
import { generatePlanner } from '../services/ai';
import type { StudyTask } from '../services/mockData';

interface StudyPlannerProps {
  tasks: StudyTask[];
  onSetTasks: (tasks: StudyTask[]) => void;
  onToggleTask: (id: string) => void;
}

export default function StudyPlanner({ tasks, onSetTasks, onToggleTask }: StudyPlannerProps) {
  const [examDate, setExamDate] = useState('');
  const [dailyHours, setDailyHours] = useState<number>(4);
  const [loading, setLoading] = useState(false);

  // Subject management state
  const [subjects, setSubjects] = useState<string[]>(['Biology', 'Mathematics', 'Chemistry']);
  const [newSubject, setNewSubject] = useState('');

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    
    const cleanSub = newSubject.trim();
    if (!subjects.some(s => s.toLowerCase() === cleanSub.toLowerCase())) {
      setSubjects([...subjects, cleanSub]);
    }
    setNewSubject('');
  };

  const handleRemoveSubject = (sub: string) => {
    setSubjects(subjects.filter(s => s !== sub));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examDate || subjects.length === 0) return;

    setLoading(true);
    try {
      const generatedTasks = await generatePlanner(subjects, examDate, dailyHours);
      onSetTasks(generatedTasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Group tasks by date for the calendar view
  const groupedTasks: Record<string, StudyTask[]> = {};
  tasks.forEach(task => {
    if (!groupedTasks[task.date]) {
      groupedTasks[task.date] = [];
    }
    groupedTasks[task.date].push(task);
  });

  // Helper to format dates nicely
  const formatDateHeader = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
          <Calendar className="h-7 w-7 text-violet-500" />
          Smart Study Planner
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate an optimized learning roadmap leading up to your exams. Customize your subject load.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Form Config panel (Left column: 2/5 space) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6 h-fit">
          <form onSubmit={handleGenerate} className="space-y-5">
            
            {/* Target Exam Date */}
            <div>
              <label htmlFor="exam-date-input" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Target Exam Date
              </label>
              <input
                id="exam-date-input"
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="block w-full px-3 py-3 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
              />
            </div>

            {/* Daily Hours selector */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Daily Study Limit
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([2, 4, 6] as const).map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setDailyHours(hours)}
                    className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                      dailyHours === hours
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 font-extrabold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350'
                    }`}
                  >
                    {hours} Hours
                  </button>
                ))}
              </div>
            </div>

            {/* Subjects Tags list */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Course Load (Subjects)
              </label>
              
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                {subjects.map((sub) => (
                  <span
                    key={sub}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 rounded-lg border border-brand-100 dark:border-brand-900/30"
                  >
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(sub)}
                      className="text-brand-400 hover:text-brand-600 dark:hover:text-brand-200 flex-shrink-0"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {subjects.length === 0 && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 italic">No subjects added. Add at least one below.</span>
                )}
              </div>

              {/* Add Custom subject inline input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 text-xs transition"
                  placeholder="Add Math, Bio, Python..."
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || subjects.length === 0 || !examDate}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 text-sm shadow-md hover:shadow-brand-500/20 disabled:opacity-50 transition"
            >
              <Sparkles className="h-4.5 w-4.5" />
              <span>{loading ? 'Generating roadmap...' : 'Create Study Schedule'}</span>
            </button>
          </form>
        </div>

        {/* Calendar Grid panel (Right column: 3/5 space) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Default state */}
          {!loading && tasks.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="h-16 w-16 bg-violet-50 dark:bg-violet-950/20 text-violet-500 rounded-full flex items-center justify-center mb-4 border border-violet-100/50 dark:border-violet-900/50">
                <CalendarRange className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white font-display">Waiting for Plan Parameters</h3>
              <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed">
                Add your exam timelines, select course subject modules, and load standard daily limits to create an automated study schedule.
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 space-y-5 min-h-[400px]">
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded shimmer" />
              <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-850">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-xl shimmer flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-800 rounded shimmer" />
                      <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800 rounded shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Display Agenda */}
          {!loading && tasks.length > 0 && (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              
              {Object.keys(groupedTasks).sort().map((dateStr) => {
                const dayTasks = groupedTasks[dateStr];
                return (
                  <div 
                    key={dateStr}
                    className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/85 shadow-sm rounded-3xl p-5 space-y-3"
                  >
                    {/* Date heading */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850">
                      <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100 font-display">
                        📅 {formatDateHeader(dateStr)}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-450 uppercase">
                        {dayTasks.length} study sessions
                      </span>
                    </div>

                    {/* Tasks checklist for this date */}
                    <div className="space-y-2.5">
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => onToggleTask(task.id)}
                          className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer group transition duration-150"
                        >
                          <div className="flex items-center space-x-3 pr-4 min-w-0">
                            <button 
                              className="text-slate-400 group-hover:text-brand-500 transition-colors flex-shrink-0"
                              aria-label="Mark task done"
                            >
                              {task.completed ? (
                                <CheckCircle className="h-5 w-5 text-brand-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-slate-300 dark:text-slate-650" />
                              )}
                            </button>
                            <div className="min-w-0">
                              <p className={`text-sm font-semibold truncate ${
                                task.completed
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}>
                                {task.subject}: {task.topic}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.time}</span>
                                <span>•</span>
                                <span>{task.duration} min duration</span>
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-extrabold px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 text-slate-500 dark:text-slate-400 rounded-lg flex-shrink-0">
                            {task.subject}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
