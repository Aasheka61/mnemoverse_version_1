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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#EAE2D0]/95 border-b border-[#3D3226]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('input')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          id="brand-logo"
        >
          <div className="w-9 h-9 rounded-lg bg-[#ECE5D6] border border-[#3D3226]/20 p-1 shadow-sm group-hover:border-[#C2571B] transition-all duration-300 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-[#C2571B] group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl tracking-tight text-[#2B2420]">
                MnemoVerse
              </span>
              <span className="text-[10px] uppercase font-mono font-medium tracking-wider px-1.5 py-0.5 rounded bg-[#ECE5D6] text-[#C2571B] border border-[#3D3226]/20">
                Spatial Study
              </span>
            </div>
          </div>
        </div>

        {/* Screen Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-[#ECE5D6] border border-[#3D3226]/20 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#C2571B] text-[#EAE2D0] font-semibold shadow-sm'
                    : 'text-[#2B2420]/75 hover:text-[#2B2420] hover:bg-[#EAE2D0]/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#EAE2D0]' : 'text-[#2E5940]'}`} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak pill - achievement moment using reward gold #D4A017 */}
          <button
            onClick={() => onNavigate('dashboard')}
            id="streak-status-badge"
            title="Current study streak"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECE5D6] border border-[#D4A017]/60 text-[#2B2420] text-xs font-semibold hover:border-[#D4A017] transition-colors cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-[#D4A017] fill-[#D4A017]/40" />
            <span className="font-mono text-[#2B2420]">{streakDays}d Streak</span>
          </button>

          {/* Points badge - achievement moment using reward gold #D4A017 */}
          <button
            onClick={() => onNavigate('dashboard')}
            id="points-status-badge"
            title="Mnemonic study sparks"
            className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECE5D6] border border-[#D4A017]/60 text-[#2B2420] text-xs font-semibold hover:border-[#D4A017] transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#D4A017] fill-[#D4A017]/40" />
            <span className="font-mono text-[#2B2420]">{points.toLocaleString()} XP</span>
          </button>
        </div>
      </div>
    </header>
  );
};
