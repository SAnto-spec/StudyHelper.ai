import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: { name: string; email: string; major: string }) => void;
  onSwitchToSignup: () => void;
  onBackToLanding: () => void;
}

export default function Login({ onLoginSuccess, onSwitchToSignup, onBackToLanding }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // Simulated short delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Check for user in local storage
      const storedUsersRaw = localStorage.getItem('ash_registered_users');
      const registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      
      const foundUser = registeredUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      // Default fallback demo user
      const isDemoUser = email.toLowerCase() === 'student@example.com' && password === 'password';

      if (foundUser) {
        onLoginSuccess({
          name: foundUser.name,
          email: foundUser.email,
          major: foundUser.major || 'General Studies'
        });
      } else if (isDemoUser) {
        onLoginSuccess({
          name: 'Jane Doe',
          email: 'student@example.com',
          major: 'Biology Major'
        });
      } else {
        setError('Invalid email or password. Hint: Use student@example.com and password');
      }
    }, 800);
  };

  const handleFillDemo = () => {
    setEmail('student@example.com');
    setPassword('password');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      
      {/* Return button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToLanding}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-brand-600 dark:text-brand-400">
          <div className="bg-brand-500 text-white p-3 rounded-2xl shadow-xl shadow-brand-500/20">
            <GraduationCap className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Or{' '}
          <button
            onClick={onSwitchToSignup}
            className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
          >
            create a free account
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 border border-slate-200/80 dark:border-slate-800/85 shadow-xl rounded-3xl sm:px-10">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/20 p-4 border border-red-200/60 dark:border-red-900/30">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-red-800 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
                  placeholder="name@school.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Remember me
                </label>
              </div>

              <div className="text-xs">
                <a href="#" className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Quick Demo Assist */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-bold">
                  Demo Credentials
                </span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full inline-flex justify-center py-2 px-4 border border-dashed border-brand-300 dark:border-brand-850 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-all duration-150"
              >
                Auto-fill Student Demo Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
