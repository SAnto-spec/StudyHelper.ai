import { 
  GraduationCap, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  CheckSquare, 
  Calendar, 
  ArrowRight,
  BookOpen,
  Users,
  Award,
  ShieldCheck
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const features = [
    {
      icon: HelpCircle,
      title: "AI Question Solver",
      desc: "Get instant, step-by-step solutions to complex academic questions tailored for your learning level (Beginner, School, or College).",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30"
    },
    {
      icon: FileText,
      title: "Notes Summarizer & Flashcards",
      desc: "Paste lecture notes or textbook chapters to generate concise summaries and interactive flashcards that help you study active recall.",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/30"
    },
    {
      icon: CheckSquare,
      title: "Interactive Quiz Generator",
      desc: "Test your comprehension with custom quizzes generated instantly for any topic. Select 5, 10, or 20 questions with answers.",
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-950/30"
    },
    {
      icon: Calendar,
      title: "Smart Study Planner",
      desc: "Input your exam dates and subjects, and let our planner algorithm build an active study calendar complete with checklist items.",
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-950/30"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Students", icon: Users },
    { number: "2.4 Million", label: "Questions Solved", icon: BookOpen },
    { number: "98.2%", label: "Satisfaction Rate", icon: Award }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans overflow-x-hidden transition-colors duration-200">
      {/* Header */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/40">
        <div className="flex items-center space-x-2.5 text-brand-600 dark:text-brand-400">
          <div className="bg-brand-500 text-white p-2 rounded-xl shadow-lg shadow-brand-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-display">
            StudyHelper<span className="text-brand-500">.ai</span>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onLogin}
            className="text-slate-600 dark:text-slate-300 font-semibold text-sm hover:text-brand-600 dark:hover:text-brand-400 transition"
          >
            Sign In
          </button>
          <button 
            onClick={onGetStarted}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-md hover:shadow-brand-500/20 transition-all duration-200"
          >
            Sign Up Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
        {/* Animated ambient gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-400/10 dark:bg-brand-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-[80px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 animate-pulse-subtle border border-brand-100 dark:border-brand-900/30">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation AI for Smart Learning</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15] font-display">
          Supercharge Your Studies With <span className="bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 bg-clip-text text-transparent">AI Learning Companions</span>
        </h1>
        
        <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          An all-in-one platform built for students worldwide. Get step-by-step answers, summarize notes in seconds, create interactive quiz sheets, and layout optimized study schedules.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onGetStarted}
            className="group bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-200 flex items-center space-x-2 text-base w-full sm:w-auto justify-center"
          >
            <span>Start Studying Free</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button 
            onClick={onLogin}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-8 py-4 rounded-2xl transition-all duration-200 w-full sm:w-auto text-base"
          >
            Explore Dashboard
          </button>
        </div>

        {/* Feature Preview Showcase Card */}
        <div className="mt-16 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-slate-200/50 dark:shadow-none max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-10 dark:group-hover:opacity-5 transition duration-500 -z-10" />
          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 sm:p-10 text-left border border-slate-100 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">Active Workspace</span>
              <h3 className="text-2xl font-bold mt-2 text-slate-950 dark:text-white font-display">Study Smarter, Not Longer</h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                Get full access to AI tools that adapt to your course syllabus. No matter if you are preparing for high school biology or college quantum mechanics, our custom algorithms break down barriers in seconds.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-start space-x-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Detailed source links & academic transparency</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Custom difficulty configurations (Beginner to College)</span>
                </div>
              </div>
            </div>
            
            {/* Interactive Mock Dashboard Preview widget */}
            <div className="w-full md:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Weekly Goals</span>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-full">82% Completed</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Chemistry Homework</span>
                    <span className="text-slate-500">3/4 Cards</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-500 h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Math Study Session</span>
                    <span className="text-slate-500">120m / 120m</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Biology Quiz prep</span>
                    <span className="text-slate-500">0/10 Quiz</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-200 dark:bg-slate-700 h-full rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white dark:bg-slate-900/40 py-20 border-y border-slate-200/50 dark:border-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Everything You Need to Ace Exams</h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              Four powerful study helpers packed in a single responsive web interface. Click on any module to jump-start your revision.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={index}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md card-hover flex gap-5"
                >
                  <div className={`p-4 rounded-xl h-14 w-14 flex items-center justify-center ${feat.bg} ${feat.color} flex-shrink-0 shadow-inner`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white font-display">{feat.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 to-indigo-700 dark:from-brand-900/50 dark:to-indigo-950/50 rounded-3xl px-6 py-12 md:py-16 text-center text-white border border-brand-500/20 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-950 opacity-10 -z-10" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display leading-tight max-w-2xl mx-auto">
            Trusted by Students from Top Schools & Universities
          </h2>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div key={idx} className="bg-white/5 dark:bg-slate-950/20 backdrop-blur-sm border border-white/10 dark:border-slate-800/40 p-6 rounded-2xl flex flex-col items-center">
                  <div className="p-3 bg-white/10 dark:bg-brand-500/20 text-brand-200 dark:text-brand-300 rounded-xl mb-4">
                    <StatIcon className="h-5 w-5" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-2">{stat.number}</span>
                  <span className="text-xs sm:text-sm font-semibold text-brand-200 dark:text-slate-400">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/60 py-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500">
            <GraduationCap className="h-5 w-5" />
            <span className="text-sm font-semibold">© {new Date().getFullYear()} StudyHelper.ai. All rights reserved.</span>
          </div>
          <div className="flex space-x-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-brand-600 transition">Terms</a>
            <a href="#" className="hover:text-brand-600 transition">Privacy</a>
            <a href="#" className="hover:text-brand-600 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
