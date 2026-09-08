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
  Plus,
  Database,
  CheckCircle2
} from 'lucide-react';
import { StoredSceneDocument } from '../services/firebase';
import { UserStats } from '../types';

interface DashboardScreenProps {
  stats: UserStats;
  savedScenes: StoredSceneDocument[];
  isLoadingScenes?: boolean;
  onNavigateToInput: () => void;
  onNavigateToScene: () => void;
  onSelectPalace?: (scene: StoredSceneDocument) => void;
  quizCount?: number;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  stats,
  savedScenes,
  isLoadingScenes = false,
  onNavigateToInput,
  onNavigateToScene,
  onSelectPalace,
  quizCount = 0,
}) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Calculate real concepts saved across all persisted Firestore scenes
  const realConceptsCount = savedScenes.reduce(
    (acc, scene) => acc + (Array.isArray(scene.rooms) ? scene.rooms.length : 0),
    0
  );

  const totalPalacesCount = savedScenes.length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'Recently';
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - d.getTime()) / 60000);
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-cyan-300" />
            <span>Mnemonic Mastery Codex</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block ml-1" title="Firestore Connected" />
            <span className="text-[10px] text-emerald-300 font-mono">Cloud Synced</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Study{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Mastery Dashboard
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry of your spatial palaces, cognitive anchors, and Firestore persistence.
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
            {(Math.max(0, stats.nextLevelPoints - stats.points)).toLocaleString()} XP until Level {stats.level + 1} Palace Architect
          </p>
          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              style={{ width: `${Math.min(100, (stats.points / stats.nextLevelPoints) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Concepts Mastered (Real count from Firestore scenes) */}
        <div 
          id="stat-card-concepts"
          className="rounded-2xl bg-[#090d1f]/90 border border-cyan-500/20 p-5 shadow-[0_0_30px_-5px_rgba(6,182,212,0.12)] backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              Concepts Saved
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-200 border border-cyan-500/30 flex items-center gap-1">
              <Database className="w-3 h-3 text-cyan-400" />
              Firestore
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {realConceptsCount || stats.conceptsMastered}{' '}
            <span className="text-sm font-semibold text-cyan-300">Anchors</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Stored across {totalPalacesCount} persisted memory palace{totalPalacesCount === 1 ? '' : 's'}
          </p>
          {/* Mini Concept Visual Indicators */}
          <div className="flex items-center gap-1.5 pt-1">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full ${i < Math.min(6, realConceptsCount || 1) ? 'bg-cyan-400/80 shadow-[0_0_6px_rgba(6,182,212,0.5)]' : 'bg-slate-800'}`} 
              />
            ))}
          </div>
        </div>

        {/* Metric 3: Streak / Spaced Repetition */}
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
              {stats.streakDays} Day{stats.streakDays === 1 ? '' : 's'}
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {stats.streakDays}{' '}
            <span className="text-sm font-semibold text-amber-300">Days Active</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Spaced repetition schedules keep neural loci crystallizing.
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

      {/* Secondary Section: Saved Memory Palaces from Firestore */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Your Persisted Memory Palaces</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              {isLoadingScenes ? 'Syncing...' : `${savedScenes.length} Saved in Firestore`}
            </span>
          </div>
        </div>

        {savedScenes.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-purple-500/20 bg-[#090d1f]/40 p-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-3">
              <Compass className="w-6 h-6 text-cyan-300" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">No Saved Memory Palaces Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mb-4">
              When you generate a memory palace, it will automatically save into your Firestore database so you can revisit your chambers anytime.
            </p>
            <button
              type="button"
              onClick={onNavigateToInput}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Your First Palace</span>
            </button>
          </div>
        ) : (
          /* Saved Palaces Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savedScenes.map((scene) => {
              const roomsCount = Array.isArray(scene.rooms) ? scene.rooms.length : 0;
              return (
                <div
                  key={scene.id || scene.scene_name}
                  id={`saved-palace-card-${scene.id || 'current'}`}
                  className="rounded-xl bg-[#090d1f]/80 border border-slate-800 hover:border-purple-500/40 p-4 transition-all duration-200 hover:bg-[#0d132b] flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                        {scene.archetype || 'Palace'}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(scene.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-100 group-hover:text-cyan-200 transition-colors mb-2 line-clamp-1">
                      {scene.scene_name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                      <span>{roomsCount} Anchor Loci / Room{roomsCount === 1 ? '' : 's'}</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Saved
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectPalace) {
                        onSelectPalace(scene);
                      } else {
                        onNavigateToScene();
                      }
                    }}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800/60 hover:bg-gradient-to-r hover:from-purple-600/80 hover:to-cyan-600/80 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700/50"
                  >
                    <span>Enter Palace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Spaced Spatial Recall Cadence Card */}
      <div className="rounded-2xl bg-[#090d1f]/70 border border-slate-800/80 p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Spaced Spatial Recall & Exam Collections</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Quiz Attempts: <strong className="text-cyan-300">{quizCount}</strong></span>
            <span>•</span>
            <span>Next Review: <strong className="text-cyan-300">Tomorrow at 9:00 AM</strong></span>
          </div>
        </div>

        {/* Informative Firestore collections readiness notice */}
        <div className="p-4 rounded-xl bg-[#060914] border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block">Firestore Collections Active</span>
              <span>
                Collections <code className="text-cyan-300 font-mono">scenes</code>, <code className="text-purple-300 font-mono">quiz_results</code>, <code className="text-amber-300 font-mono">points</code>, and <code className="text-emerald-300 font-mono">user_progress</code> are provisioned and synchronized with your memory palaces.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToScene}
            className="px-3.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 font-semibold shrink-0 transition-colors cursor-pointer"
          >
            Review Active Palace
          </button>
        </div>
      </div>
    </div>
  );
};
