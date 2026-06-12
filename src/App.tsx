import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AISolver from './components/AISolver';
import NotesSummarizer from './components/NotesSummarizer';
import QuizGenerator from './components/QuizGenerator';
import StudyPlanner from './components/StudyPlanner';
import SettingsPanel from './components/Settings';
import type { StudyTask } from './services/mockData';

export default function App() {
  // Authentication states: 'landing' | 'login' | 'signup' | 'app'
  const [view, setView] = useState<string>('landing');
  const [activeSubView, setActiveSubView] = useState<string>('dashboard');
  const [user, setUser] = useState<{ name: string; email: string; major: string } | null>(null);

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Stats & Achievements
  const [stats, setStats] = useState({
    quizzesCompleted: 0,
    notesSummarized: 0,
    questionsSolved: 0,
    tasksCompleted: 0,
    totalStudyMinutes: 0
  });

  // Recent Activity Feed
  const [recentActivity, setRecentActivity] = useState<Array<{ id: string; type: 'quiz' | 'summary' | 'solver'; title: string; date: string }>>([]);

  // Planner Tasks
  const [plannerTasks, setPlannerTasks] = useState<StudyTask[]>([]);
  
  // Quiz Scores List
  const [quizScores, setQuizScores] = useState<number[]>([]);

  // 1. Initial Session & Theme Loading from LocalStorage on mount
  useEffect(() => {
    // Session load
    const savedUserRaw = localStorage.getItem('ash_active_user');
    if (savedUserRaw) {
      setUser(JSON.parse(savedUserRaw));
      setView('app');
    }

    // Theme load
    const savedTheme = localStorage.getItem('ash_theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && systemDark);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  // 2. Load user-specific stats, tasks, scores, and activity feed when user changes
  useEffect(() => {
    if (!user) {
      setStats({
        quizzesCompleted: 0,
        notesSummarized: 0,
        questionsSolved: 0,
        tasksCompleted: 0,
        totalStudyMinutes: 0
      });
      setRecentActivity([]);
      setPlannerTasks([]);
      setQuizScores([]);
      return;
    }

    const emailKey = user.email.toLowerCase();

    // Stats
    const savedStatsRaw = localStorage.getItem(`ash_${emailKey}_stats`);
    if (savedStatsRaw) {
      setStats(JSON.parse(savedStatsRaw));
    } else {
      const initialStats = {
        quizzesCompleted: 0,
        notesSummarized: 0,
        questionsSolved: 0,
        tasksCompleted: 0,
        totalStudyMinutes: 0
      };
      setStats(initialStats);
      localStorage.setItem(`ash_${emailKey}_stats`, JSON.stringify(initialStats));
    }

    // Activity
    const savedActivityRaw = localStorage.getItem(`ash_${emailKey}_activity_feed`);
    if (savedActivityRaw) {
      setRecentActivity(JSON.parse(savedActivityRaw));
    } else {
      setRecentActivity([]);
      localStorage.setItem(`ash_${emailKey}_activity_feed`, JSON.stringify([]));
    }

    // Tasks
    const savedTasksRaw = localStorage.getItem(`ash_${emailKey}_planner_tasks`);
    if (savedTasksRaw) {
      setPlannerTasks(JSON.parse(savedTasksRaw));
    } else {
      setPlannerTasks([]);
      localStorage.setItem(`ash_${emailKey}_planner_tasks`, JSON.stringify([]));
    }

    // Scores
    const savedScoresRaw = localStorage.getItem(`ash_${emailKey}_quiz_scores`);
    if (savedScoresRaw) {
      setQuizScores(JSON.parse(savedScoresRaw));
    } else {
      setQuizScores([]);
      localStorage.setItem(`ash_${emailKey}_quiz_scores`, JSON.stringify([]));
    }
  }, [user]);

  // 3. Sync Theme State to Document Head classes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('ash_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('ash_theme', 'light');
    }
  }, [darkMode]);

  // 4. User updates
  const handleUpdateUser = (updatedUser: { name: string; email: string; major: string }) => {
    setUser(updatedUser);
    localStorage.setItem('ash_active_user', JSON.stringify(updatedUser));
  };

  // 5. Login / Signup completions
  const handleAuthSuccess = (activeUser: { name: string; email: string; major: string }) => {
    setUser(activeUser);
    localStorage.setItem('ash_active_user', JSON.stringify(activeUser));
    setView('app');
    setActiveSubView('dashboard');
  };

  // 6. Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ash_active_user');
    setView('landing');
  };

  // 7. Reset learning logs
  const handleClearStats = () => {
    if (!user) return;
    const emailKey = user.email.toLowerCase();
    const freshStats = {
      quizzesCompleted: 0,
      notesSummarized: 0,
      questionsSolved: 0,
      tasksCompleted: 0,
      totalStudyMinutes: 0
    };
    setStats(freshStats);
    setRecentActivity([]);
    setPlannerTasks([]);
    setQuizScores([]);
    localStorage.setItem(`ash_${emailKey}_stats`, JSON.stringify(freshStats));
    localStorage.setItem(`ash_${emailKey}_activity_feed`, JSON.stringify([]));
    localStorage.setItem(`ash_${emailKey}_planner_tasks`, JSON.stringify([]));
    localStorage.setItem(`ash_${emailKey}_quiz_scores`, JSON.stringify([]));
  };

  // 8. Add activity item
  const handleAddActivity = (act: { type: 'quiz' | 'summary' | 'solver'; title: string }) => {
    if (!user) return;
    const emailKey = user.email.toLowerCase();
    const newItem = {
      id: Math.random().toString(36).substr(2, 6),
      type: act.type,
      title: act.title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const updatedFeed = [newItem, ...recentActivity];
    setRecentActivity(updatedFeed);
    localStorage.setItem(`ash_${emailKey}_activity_feed`, JSON.stringify(updatedFeed));

    // Auto increment solver / summarizer counts
    if (act.type === 'solver') {
      const nextStats = { ...stats, questionsSolved: stats.questionsSolved + 1 };
      setStats(nextStats);
      localStorage.setItem(`ash_${emailKey}_stats`, JSON.stringify(nextStats));
    } else if (act.type === 'summary') {
      const nextStats = { ...stats, notesSummarized: stats.notesSummarized + 1 };
      setStats(nextStats);
      localStorage.setItem(`ash_${emailKey}_stats`, JSON.stringify(nextStats));
    }
  };

  // 9. Quiz increment callback
  const handleIncrementQuizzes = (scorePercentage: number) => {
    if (!user) return;
    const emailKey = user.email.toLowerCase();
    const nextStats = { ...stats, quizzesCompleted: stats.quizzesCompleted + 1 };
    setStats(nextStats);
    localStorage.setItem(`ash_${emailKey}_stats`, JSON.stringify(nextStats));

    const nextScores = [...quizScores, scorePercentage];
    setQuizScores(nextScores);
    localStorage.setItem(`ash_${emailKey}_quiz_scores`, JSON.stringify(nextScores));
  };

  // 10. Planner update callback
  const handleSetPlannerTasks = (newTasks: StudyTask[]) => {
    if (!user) return;
    const emailKey = user.email.toLowerCase();
    setPlannerTasks(newTasks);
    localStorage.setItem(`ash_${emailKey}_planner_tasks`, JSON.stringify(newTasks));
  };

  // 11. Planner Task completion checklist toggler
  const handleTogglePlannerTask = (id: string) => {
    if (!user) return;
    const emailKey = user.email.toLowerCase();
    const updated = plannerTasks.map(t => {
      if (t.id === id) {
        const targetStatus = !t.completed;
        
        // Adjust minutes and tasks completed accordingly
        const timeDiff = targetStatus ? t.duration : -t.duration;
        const taskDiff = targetStatus ? 1 : -1;
        
        const nextStats = {
          ...stats,
          tasksCompleted: Math.max(0, stats.tasksCompleted + taskDiff),
          totalStudyMinutes: Math.max(0, stats.totalStudyMinutes + timeDiff)
        };
        setStats(nextStats);
        localStorage.setItem(`ash_${emailKey}_stats`, JSON.stringify(nextStats));

        return { ...t, completed: targetStatus };
      }
      return t;
    });

    setPlannerTasks(updated);
    localStorage.setItem(`ash_${emailKey}_planner_tasks`, JSON.stringify(updated));
  };

  // Calculate todays tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = plannerTasks.filter(t => t.date === todayStr);

  // View dispatch state machine
  const renderAppContent = () => {
    switch (activeSubView) {
      case 'dashboard':
        return (
          <Dashboard
            user={user!}
            stats={stats}
            recentActivity={recentActivity}
            todayTasks={todayTasks}
            onToggleTask={handleTogglePlannerTask}
            setView={setActiveSubView}
            quizScores={quizScores}
            plannerTasks={plannerTasks}
          />
        );
      case 'solver':
        return <AISolver onAddActivity={handleAddActivity} />;
      case 'summarizer':
        return <NotesSummarizer onAddActivity={handleAddActivity} />;
      case 'quiz':
        return (
          <QuizGenerator
            onAddActivity={handleAddActivity}
            onIncrementQuizzes={handleIncrementQuizzes}
          />
        );
      case 'planner':
        return (
          <StudyPlanner
            tasks={plannerTasks}
            onSetTasks={handleSetPlannerTasks}
            onToggleTask={handleTogglePlannerTask}
          />
        );
      case 'settings':
        return (
          <SettingsPanel
            user={user!}
            onUpdateUser={handleUpdateUser}
            onClearStats={handleClearStats}
          />
        );
      default:
        return (
          <Dashboard
            user={user!}
            stats={stats}
            recentActivity={recentActivity}
            todayTasks={todayTasks}
            onToggleTask={handleTogglePlannerTask}
            setView={setActiveSubView}
            quizScores={quizScores}
            plannerTasks={plannerTasks}
          />
        );
    }
  };

  if (view === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setView('signup')}
        onLogin={() => setView('login')}
      />
    );
  }

  if (view === 'login') {
    return (
      <Login
        onLoginSuccess={handleAuthSuccess}
        onSwitchToSignup={() => setView('signup')}
        onBackToLanding={() => setView('landing')}
      />
    );
  }

  if (view === 'signup') {
    return (
      <Signup
        onSignupSuccess={handleAuthSuccess}
        onSwitchToLogin={() => setView('login')}
        onBackToLanding={() => setView('landing')}
      />
    );
  }

  // Dashboard / App structure containing sidebar navigation
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Sidebar Component */}
      <Sidebar
        currentView={activeSubView}
        setView={setActiveSubView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto h-screen md:h-auto pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {renderAppContent()}
        </div>
      </main>

    </div>
  );
}
