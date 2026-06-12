import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft, BookOpen } from 'lucide-react';

interface SignupProps {
  onSignupSuccess: (user: { name: string; email: string; major: string }) => void;
  onSwitchToLogin: () => void;
  onBackToLanding: () => void;
}

export default function Signup({ onSignupSuccess, onSwitchToLogin, onBackToLanding }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('Biology'); // Default major
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const majorsList = [
    'Biology',
    'Computer Science',
    'Chemistry',
    'Physics',
    'History',
    'Literature & English',
    'Mathematics',
    'Economics & Business',
    'General Studies'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Save user to simulated registered users list
      const storedUsersRaw = localStorage.getItem('ash_registered_users');
      const registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      // Check if user already exists
      const userExists = registeredUsers.some(
        (u: any) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (userExists) {
        setError('An account with this email already exists.');
        return;
      }

      const newUser = { name, email, password, major };
      registeredUsers.push(newUser);
      localStorage.setItem('ash_registered_users', JSON.stringify(registeredUsers));

      // Successfully sign in
      onSignupSuccess({
        name,
        email,
        major
      });
    }, 1000);
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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Or{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
          >
            log in to your dashboard
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 border border-slate-200/80 dark:border-slate-800/85 shadow-xl rounded-3xl sm:px-10">
          
          <form className="space-y-5" onSubmit={handleSubmit}>
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
              <label htmlFor="name" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
                  placeholder="Alex Mercer"
                />
              </div>
            </div>

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
                  placeholder="alex@school.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="major" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Primary Subject/Major
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <BookOpen className="h-5 w-5" />
                </div>
                <select
                  id="major"
                  name="major"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition appearance-none"
                >
                  {majorsList.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
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
                  placeholder="•••••••• (Min 6 chars)"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-slate-500 dark:text-slate-400 font-semibold">
                I agree to the <a href="#" className="text-brand-600 hover:text-brand-500">Terms of Service</a> and <a href="#" className="text-brand-600 hover:text-brand-500">Privacy Policy</a>.
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
