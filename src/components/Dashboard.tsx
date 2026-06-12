import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Trophy, 
  FileText, 
  HelpCircle, 
  CalendarCheck, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  CheckCircle,
  Circle,
  Lightbulb,
  Award
} from 'lucide-react';

import type { StudyTask } from '../services/mockData';

interface DashboardProps {
  user: { name: string; email: string; major: string };
  stats: {
    quizzesCompleted: number;
    notesSummarized: number;
    questionsSolved: number;
    tasksCompleted: number;
    totalStudyMinutes: number;
  };
  recentActivity: Array<{ id: string; type: 'quiz' | 'summary' | 'solver'; title: string; date: string }>;
  todayTasks: Array<{ id: string; subject: string; topic: string; time: string; duration: number; completed: boolean }>;
  onToggleTask: (id: string) => void;
  setView: (view: string) => void;
  quizScores: number[];
  plannerTasks: StudyTask[];
}

export default function Dashboard({
  user,
  stats,
  recentActivity,
  todayTasks,
  onToggleTask,
  setView,
  quizScores,
  plannerTasks
}: DashboardProps) {

  // Accumulate completed planner hours by weekday
  const weekdayHours: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  plannerTasks.forEach(task => {
    if (task.completed) {
      const date = new Date(task.date + 'T00:00:00');
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = days[date.getDay()];
      weekdayHours[dayName] = (weekdayHours[dayName] || 0) + (task.duration / 60);
    }
  });

  const studyHoursData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    hours: parseFloat((weekdayHours[day] || 0).toFixed(1))
  }));

  const quizScoresData = quizScores.map((score, index) => ({
    exam: `Quiz ${index + 1}`,
    score
  }));

  // Selected motivation quotes
  const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" }
  ];
  const activeQuote = quotes[stats.tasksCompleted % quotes.length];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header section with profile overview */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Focus Major: <span className="font-semibold text-brand-600 dark:text-brand-400">{user.major}</span>. Here is your learning progress for this week.
          </p>
        </div>
        
        {/* Quick streak widget */}
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm self-start md:self-auto">
          <div className="bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl text-amber-500">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current Streak</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {stats.tasksCompleted > 0 ? Math.min(7, Math.ceil(stats.tasksCompleted / 2)) : 1} Days Active
            </p>
          </div>
        </div>
      </div>

      {/* Grid of study KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* 1. Study Hours */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Study Time</span>
            <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg"><Clock className="h-4 w-4" /></span>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {parseFloat((studyHoursData.reduce((acc, curr) => acc + curr.hours, 0)).toFixed(1))}h
            </span>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span>+12% vs last week</span>
            </p>
          </div>
        </div>

        {/* 2. Quizzes Completed */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Quizzes Taken</span>
            <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg"><Award className="h-4 w-4" /></span>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {stats.quizzesCompleted}
            </span>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Average score: 86%</span>
            </p>
          </div>
        </div>

        {/* 3. Notes Summarized */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Notes Processed</span>
            <span className="p-1.5 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-lg"><FileText className="h-4 w-4" /></span>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {stats.notesSummarized}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              <span>Saved around 12,000 words</span>
            </p>
          </div>
        </div>

        {/* 4. Solvers Run */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">AI Solves</span>
            <span className="p-1.5 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-lg"><HelpCircle className="h-4 w-4" /></span>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {stats.questionsSolved}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              <span>Step-by-step guides</span>
            </p>
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Study hours breakdown */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Weekly Study Log</h3>
            <span className="text-xs text-slate-400">Hours per day</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyHoursData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }} 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="hours" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Quiz Score Performance */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Quiz Scores Trend</h3>
            <span className="text-xs text-slate-400">Score percentage</span>
          </div>
          <div className="h-64 w-full">
            {quizScores.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 text-center">
                <Trophy className="h-8 w-8 text-slate-350 dark:text-slate-700 mb-2" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">No scores recorded yet.</p>
                <p className="text-[10px] text-slate-400 mt-1">Generate and complete a quiz to chart progress.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={quizScoresData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="exam" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      background: 'rgba(15, 23, 42, 0.9)', 
                      border: 'none', 
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Lower Row Grid (Tasks and Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Today's Tasks checklist */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CalendarCheck className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Study Schedule Checklist</h3>
              </div>
              <button 
                onClick={() => setView('planner')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-500 flex items-center gap-1 transition"
              >
                <span>Edit Planner</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            
            {todayTasks.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-sm text-slate-400 dark:text-slate-500">No study sessions generated for today.</p>
                <button 
                  onClick={() => setView('planner')}
                  className="mt-3 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-3 py-1.5 rounded-xl transition"
                >
                  Generate Plan
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {todayTasks.slice(0, 4).map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between py-3 group cursor-pointer"
                    onClick={() => onToggleTask(task.id)}
                  >
                    <div className="flex items-center space-x-3 pr-4">
                      <button 
                        className="text-slate-400 group-hover:text-brand-500 transition-colors flex-shrink-0"
                        aria-label="Toggle task completion"
                      >
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-brand-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-350 dark:text-slate-600" />
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
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium flex items-center gap-2">
                          <span>⏱️ {task.time}</span>
                          <span>•</span>
                          <span>{task.duration} min session</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Subject Pill badge */}
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-full text-slate-500 dark:text-slate-400 flex-shrink-0">
                      {task.subject}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Motivation Quote panel */}
          <div className="mt-6 p-4 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100/60 dark:border-brand-900/30 rounded-2xl flex gap-3 items-start">
            <Lightbulb className="h-5 w-5 text-brand-500 mt-0.5 flex-shrink-0 animate-pulse-subtle" />
            <div>
              <p className="text-xs italic text-slate-600 dark:text-slate-300">
                "{activeQuote.text}"
              </p>
              <p className="text-[10px] font-bold text-slate-400 mt-1">
                — {activeQuote.author}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-4">
              Recent Workspace Activity
            </h3>
            
            {recentActivity.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                No activity yet. Start by asking a question!
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                      act.type === 'solver' 
                        ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40 text-blue-600'
                        : act.type === 'summary'
                        ? 'bg-sky-50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/40 text-sky-600'
                        : 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40 text-indigo-600'
                    }`}>
                      {act.type === 'solver' && <HelpCircle className="h-4 w-4" />}
                      {act.type === 'summary' && <FileText className="h-4 w-4" />}
                      {act.type === 'quiz' && <Trophy className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {act.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {act.type === 'solver' && 'Solved Question'}
                        {act.type === 'summary' && 'Summarized Notes'}
                        {act.type === 'quiz' && 'Completed Quiz'}
                        {' • '}{act.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              onClick={() => setView('solver')}
              className="w-full text-center text-xs font-bold text-brand-600 hover:text-brand-500 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/20 dark:hover:bg-brand-950/40 py-2.5 rounded-xl transition"
            >
              Ask AI solver
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
