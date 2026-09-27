'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Key, ArrowRight, ShieldCheck, X, CheckCircle, RefreshCw } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Change Password Modal State
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('kun_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/auth?code=${encodeURIComponent(password)}`);
      const data = await res.json();

      if (data.success && data.isValid) {
        localStorage.setItem('kun_admin_auth', 'true');
        setIsAuthenticated(true);
        setErrorMsg('');
        setPassword('');
      } else {
        setErrorMsg('Incorrect password! Please enter valid admin passcode.');
      }
    } catch {
      // Fallback check if API is unreachable
      if (password === 'kun2026') {
        localStorage.setItem('kun_admin_auth', 'true');
        setIsAuthenticated(true);
        setErrorMsg('');
      } else {
        setErrorMsg('Incorrect password! Please enter valid admin passcode.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kun_admin_auth');
    setIsAuthenticated(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess('');

    if (newPass !== confirmPass) {
      setChangeError('New passwords do not match!');
      return;
    }

    if (newPass.length < 4) {
      setChangeError('New password must be at least 4 characters long.');
      return;
    }

    setIsChanging(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPasscode: currentPass,
          newPasscode: newPass,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setChangeSuccess('Passcode changed successfully!');
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        setTimeout(() => {
          setShowChangeModal(false);
          setChangeSuccess('');
        }, 1800);
      } else {
        setChangeError(data.message || 'Failed to update passcode.');
      }
    } catch {
      setChangeError('Server error while changing passcode. Please try again.');
    } finally {
      setIsChanging(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">
        Loading portal...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6 text-slate-900 border border-pink-100">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">KUN Owner Portal</h2>
            <p className="text-xs text-gray-500">
              Enter secret admin passcode to access owner dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Key size={14} className="text-pink-500" />
                <span>Admin Password *</span>
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              />
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <>
                  <span>Login to Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center border-t border-gray-100 pt-4 text-xs text-gray-400">
            🔒 Protected Admin Portal for KUN Store Owner
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Top Banner with Password Change Option */}
      <div className="bg-slate-950 text-white text-[11px] font-bold py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-slate-800">
        <span className="flex items-center gap-1.5 text-gray-300">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Logged in as KUN Store Owner</span>
        </span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setShowChangeModal(true);
              setChangeError('');
              setChangeSuccess('');
            }}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <Key size={13} />
            <span>Change Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="underline text-pink-400 hover:text-pink-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {children}

      {/* Change Password Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-5 text-slate-900 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setShowChangeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <Key size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Change Admin Password</h3>
                <p className="text-xs text-gray-500">Update your secret owner portal passcode</p>
              </div>
            </div>

            {changeSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-3 text-xs font-semibold">
                <CheckCircle size={22} className="text-emerald-600 shrink-0" />
                <span>{changeSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password (min 4 chars)"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {changeError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl">
                    {changeError}
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowChangeModal(false)}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChanging}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isChanging ? <RefreshCw size={14} className="animate-spin" /> : <span>Update Password</span>}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
