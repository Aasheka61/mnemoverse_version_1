import React from 'react';
import { 
  Zap, 
  Flame, 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Trophy, 
  Calendar, 
  Clock, 
  BarChart3,
  Plus
} from 'lucide-react';
import { RECENT_PALACES } from '../data';
import { UserStats } from '../types';

interface DashboardScreenProps {
  stats: UserStats;
  onNavigateToInput: () => void;
  onNavigateToScene: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  stats,
  onNavigateToInput,
  onNavigateToScene,
}) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-cyan-300" />
            <span>Mnemonic Mastery Codex</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Study{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Mastery Dashboard
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Overview of cognitive retention, recall cadence, and active mental structures.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          id="dash-create-palace-btn"
          onClick={onNavigateToInput}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-cyan-200" />
          <span>Architect New Palace</span>
        </button>
      </div>

      {/* Primary 3 Key Metrics Cards: Points, Concepts Mastered, Streak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Metric 1: Points / XP */}
        <div 
          id="stat-card-points"
          className="rounded-2xl bg-[#090d1f]/90 border border-purple-500/20 p-5 shadow-[0_0_30px_-5px_rgba(168,85,247,0.12)] backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-400" />
              Mnemonic Points
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-purple-950 text-purple-200 border border-purple-500/30">
              Level {stats.level}
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {stats.points.toLocaleString()}{' '}
            <span className="text-sm font-semibold text-purple-300">XP</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            {(stats.nextLevelPoints - stats.points).toLocaleString()} XP until Level {stats.level + 1} Palace Architect
          </p>
          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              style={{ width: `${(stats.points / stats.nextLevelPoints) * 100}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Concepts Mastered */}
        <div 
          id="stat-card-concepts"
          className="rounded-2xl bg-[#090d1f]/90 border border-cyan-500/20 p-5 shadow-[0_0_30px_-5px_rgba(6,182,212,0.12)] backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              Concepts Mastered
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-200 border border-cyan-500/30">
              {stats.retentionRate}% Retention
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {stats.conceptsMastered}{' '}
            <span className="text-sm font-semibold text-cyan-300">Anchors</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Distributed across {stats.palacesCount} active memory palace chambers
          </p>
          {/* Mini Concept Visual Indicators */}
          <div className="flex items-center gap-1.5 pt-1">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full ${i < 5 ? 'bg-cyan-400/80 shadow-[0_0_6px_rgba(6,182,212,0.5)]' : 'bg-slate-800'}`} 
              />
            ))}
          </div>
        </div>

        {/* Metric 3: Streak */}
        <div 
          id="stat-card-streak"
          className="rounded-2xl bg-[#090d1f]/90 border border-amber-500/20 p-5 shadow-[0_0_30px_-5px_rgba(245,158,11,0.12)] backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              Study Streak
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-950 text-amber-200 border border-amber-500/30">
              7/7 Days
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {stats.streakDays}{' '}
            <span className="text-sm font-semibold text-amber-300">Days Active</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Daily spatial review keeps neural pathways crystallized.
          </p>

          {/* 7-Day Visual Tracker */}
          <div className="flex items-center justify-between pt-1">
            {daysOfWeek.map((day, idx) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-500">{day[0]}</span>
                <div 
                  className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.5)] border border-amber-300/40"
                  title={`${day}: Active study recorded`}
                >
                  <span className="text-[9px] text-black font-bold">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Section: Recent Memory Palaces Collection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Your Memory Palaces</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {RECENT_PALACES.length} Chambers Constructed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECENT_PALACES.map((palace, index) => (
            <div
              key={palace.id}
              id={`recent-palace-card-${palace.id}`}
              className="rounded-xl bg-[#090d1f]/80 border border-slate-800 hover:border-purple-500/40 p-4 transition-all duration-200 hover:bg-[#0d132b] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                    {palace.archetype}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {palace.lastStudied}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-slate-100 group-hover:text-cyan-200 transition-colors mb-2">
                  {palace.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span>{palace.lociCount} Anchor Loci</span>
                  <span className="text-emerald-400 font-semibold">{palace.mastery}% Mastery</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToScene}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800/60 hover:bg-gradient-to-r hover:from-purple-600/80 hover:to-cyan-600/80 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700/50"
              >
                <span>Enter Chamber</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Review Cadence Card */}
      <div className="rounded-2xl bg-[#090d1f]/70 border border-slate-800/80 p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Spaced Spatial Recall Cadence</h3>
          </div>
          <span className="text-xs text-slate-400">
            Next optimal review session: <strong className="text-cyan-300">Tomorrow at 9:00 AM</strong>
          </span>
        </div>

        {/* Informative placeholder text */}
        <div className="p-4 rounded-xl bg-[#060914] border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block">Ebbinghaus Retention Optimization</span>
              <span>Memory palace loci decay 4x slower than verbatim text notes. Keep your 7-day streak intact!</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToScene}
            className="px-3.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 font-semibold shrink-0 transition-colors"
          >
            Review Active Palace
          </button>
        </div>
      </div>
    </div>
  );
};
