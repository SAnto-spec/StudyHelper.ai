import { 
  LayoutDashboard, 
  HelpCircle, 
  FileText, 
  CheckSquare, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  user: { name: string; email: string; major: string } | null;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({
  currentView,
  setView,
  darkMode,
  setDarkMode,
  user,
  onLogout,
  isOpen,
  setIsOpen
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'solver', label: 'AI Solver', icon: HelpCircle },
    { id: 'summarizer', label: 'Summarizer', icon: FileText },
    { id: 'quiz', label: 'Quiz Generator', icon: CheckSquare },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (viewId: string) => {
    setView(viewId);
    setIsOpen(false); // Close mobile drawer on navigation
  };

  return (
    <>
      {/* Mobile top navigation bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400">
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold text-lg font-display tracking-tight text-slate-900 dark:text-white">
            StudyHelper<span className="text-brand-500 font-normal">.ai</span>
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {/* Dark Mode toggle for mobile header */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Backdrop for mobile navigation drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar navigation panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:sticky md:h-screen`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Sidebar Logo */}
          <div className="hidden md:flex items-center space-x-3 px-6 py-6 border-b border-slate-100 dark:border-slate-800">
            <div className="bg-brand-500 dark:bg-brand-600 text-white p-2 rounded-xl shadow-md shadow-brand-500/20">
              <GraduationCap className="h-6 w-6 animate-pulse-subtle" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-display">
              StudyHelper<span className="text-brand-500">.ai</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <IconComponent
                    className={`h-5 w-5 transition-transform duration-150 group-hover:scale-105 ${
                      isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-5 bg-brand-500 dark:bg-brand-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area / User Profile & Settings */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          {/* Dark Mode toggle for desktop */}
          <div className="hidden md:flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              {darkMode ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-slate-200 dark:bg-brand-500"
              role="switch"
              aria-checked={darkMode}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {user && (
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-xl">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-400 flex items-center justify-center font-bold text-sm border border-brand-200/50 dark:border-brand-800/50 flex-shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-none mb-1">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none">
                    {user.major || 'Student'}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
