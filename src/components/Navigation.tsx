import React from 'react';
import { Sparkles, Compass, LayoutDashboard, BrainCircuit, Flame, Zap } from 'lucide-react';
import { ScreenType } from '../types';

interface NavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  streakDays: number;
  points: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onNavigate,
  streakDays,
  points,
}) => {
  const navItems: { id: ScreenType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'input', label: 'Create Palace', icon: Sparkles },
    { id: 'scene', label: 'Room View', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#070913]/85 border-b border-purple-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('input')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          id="brand-logo"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-[1px] shadow-[0_0_16px_rgba(168,85,247,0.35)] group-hover:shadow-[0_0_22px_rgba(6,182,212,0.45)] transition-all duration-300">
            <div className="w-full h-full bg-[#090D1A] rounded-[11px] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                MnemoVerse
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Spatial Study
              </span>
            </div>
          </div>
        </div>

        {/* Screen Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-[#0e1326]/90 border border-slate-800/80 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/80 to-cyan-600/70 -z-10 border border-purple-400/30" />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-200' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak pill */}
          <button
            onClick={() => onNavigate('dashboard')}
            id="streak-status-badge"
            title="Current study streak"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:border-amber-400/50 transition-colors cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
            <span>{streakDays}d Streak</span>
          </button>

          {/* Points badge */}
          <button
            onClick={() => onNavigate('dashboard')}
            id="points-status-badge"
            title="Mnemonic study sparks"
            className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:border-cyan-400/50 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
            <span>{points.toLocaleString()} XP</span>
          </button>
        </div>
      </div>
    </header>
  );
};
