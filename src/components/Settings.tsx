import React, { useState, useEffect } from 'react';
import { Settings, User, Key, Eye, EyeOff, Save, Trash2, Check, Sparkles } from 'lucide-react';

interface SettingsProps {
  user: { name: string; email: string; major: string };
  onUpdateUser: (updated: { name: string; email: string; major: string }) => void;
  onClearStats: () => void;
}

export default function SettingsPanel({ user, onUpdateUser, onClearStats }: SettingsProps) {
  // Profile state
  const [name, setName] = useState(user.name);
  const [major, setMajor] = useState(user.major);
  const [institution, setInstitution] = useState('');

  // API keys state
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  
  const [showGemini, setShowGemini] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);

  // Status flags
  const [profileSaved, setProfileSaved] = useState(false);
  const [keysSaved, setKeysSaved] = useState(false);

  // Load saved configurations
  useEffect(() => {
    setName(user.name);
    setMajor(user.major);
    setInstitution(localStorage.getItem('ash_institution') || 'Stanford University');
    
    const savedProvider = localStorage.getItem('ash_ai_provider') as any;
    if (savedProvider && savedProvider !== 'mock') setProvider(savedProvider);
    else setProvider('gemini');
    
    setGeminiKey(localStorage.getItem('ash_gemini_key') || '');
    setOpenaiKey(localStorage.getItem('ash_openai_key') || '');
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email: user.email,
      major
    });
    localStorage.setItem('ash_institution', institution);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ash_ai_provider', provider);
    localStorage.setItem('ash_gemini_key', geminiKey.trim());
    localStorage.setItem('ash_openai_key', openaiKey.trim());
    setKeysSaved(true);
    setTimeout(() => setKeysSaved(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to clear your learning metrics, quizzes taken, and generated study planner roadmaps? This cannot be undone.")) {
      onClearStats();
      alert("Study statistics reset successfully.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
          <Settings className="h-7 w-7 text-slate-500" />
          Settings Panel
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your profile details, manage AI models API connections, and clean local dashboards cache.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Card settings (Left Column) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm h-fit">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-105 dark:border-slate-850 mb-5">
            <User className="h-5 w-5 text-brand-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Student Profile</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label htmlFor="settings-name-input" className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase mb-2">
                Display Name
              </label>
              <input
                id="settings-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="settings-email-input" className="block text-xs font-bold text-slate-400 uppercase mb-2">
                Email Address
              </label>
              <input
                id="settings-email-input"
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-450 dark:text-slate-500 rounded-xl cursor-not-allowed outline-none"
              />
            </div>

            <div>
              <label htmlFor="settings-major-input" className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase mb-2">
                Syllabus Major/Grade
              </label>
              <input
                id="settings-major-input"
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="settings-institution-input" className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase mb-2">
                School / Institution
              </label>
              <input
                id="settings-institution-input"
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                placeholder="Stanford University"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-250 font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center space-x-1.5"
            >
              {profileSaved ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">Profile Updated</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* API Configurations settings (Right Column) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
          
          <div>
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-105 dark:border-slate-850 mb-5">
              <Key className="h-5 w-5 text-indigo-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">AI Gateway Integration</h3>
            </div>

            <form onSubmit={handleSaveKeys} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase mb-2">
                  AI Processing Provider
                </label>
                <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                  {(['gemini', 'openai'] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setProvider(prov)}
                      className={`py-1.5 px-2 text-xs font-bold rounded-lg capitalize transition ${
                        provider === prov
                          ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              {provider === 'gemini' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label htmlFor="gemini-key-input" className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase mb-2">
                      Gemini API Key
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <input
                        id="gemini-key-input"
                        type={showGemini ? 'text' : 'password'}
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="AIzaSy..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowGemini(!showGemini)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showGemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    To make actual requests, supply a valid API key from Google AI Studio. Stored securely inside your browser local storage.
                  </p>
                </div>
              )}

              {provider === 'openai' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label htmlFor="openai-key-input" className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase mb-2">
                      OpenAI API Key
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <input
                        id="openai-key-input"
                        type={showOpenai ? 'text' : 'password'}
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                        className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="sk-proj-..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenai(!showOpenai)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showOpenai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    To make actual requests, supply a valid API key from OpenAI Platform (utilizes model `gpt-4o-mini`). Stored securely in local storage.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md hover:shadow-brand-500/20 transition flex items-center justify-center space-x-1.5"
              >
                {keysSaved ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    <span>Keys Configured</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse-subtle" />
                    <span>Apply AI Settings</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Reset cache panel */}
          <div className="border-t border-slate-100 dark:border-slate-850 pt-5 space-y-3">
            <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider">Danger Zone</h4>
            <p className="text-xs text-slate-450 dark:text-slate-500 leading-relaxed">
              If you wish to clear your local stats metrics cache and reset activities trackers:
            </p>
            <button
              onClick={handleResetData}
              className="flex items-center space-x-1.5 text-xs font-bold px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-650 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 rounded-xl transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Workspace Stats</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
