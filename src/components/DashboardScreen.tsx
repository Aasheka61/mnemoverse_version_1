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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECE5D6] border border-[#3D3226]/20 text-[#2B2420] text-xs font-mono font-semibold mb-2 shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>Mnemonic Mastery Codex</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E5940] inline-block ml-1" title="Firestore Connected" />
            <span className="text-[10px] text-[#2E5940] font-mono">Cloud Synced</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#2B2420] tracking-tight">
            Study Mastery Dashboard
          </h1>
          {/* Horizontal divider under screen heading */}
          <div className="w-16 h-0.5 bg-[#3D3226]/20 my-2" />
          <p className="text-xs sm:text-sm text-[#2B2420]/80 mt-1">
            Real-time telemetry of your spatial palaces, cognitive anchors, and Firestore persistence.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          id="dash-create-palace-btn"
          onClick={onNavigateToInput}
          className="self-start sm:self-auto px-5 py-2.5 game-btn-primary text-xs sm:text-sm font-bold shadow-[0_4px_0_#8B350C] flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Architect New Palace</span>
        </button>
      </div>

      {/* Primary 3 Key Metrics Cards: Points, Concepts Mastered, Streak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Metric 1: Points / XP - Reward Moment with Gold #D4A017 */}
        <div 
          id="stat-card-points"
          className="rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/25 p-5 shadow-[0_5px_0_#3D3226] hover:-translate-y-1 hover:shadow-[0_7px_0_#3D3226] relative overflow-hidden transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2B2420] flex items-center gap-1.5 font-mono">
              <Zap className="w-4 h-4 text-[#D4A017]" />
              Mnemonic Points
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-[#ECE5D6] text-[#D4A017] font-extrabold border border-[#D4A017]/40 shadow-sm">
              Level {stats.level}
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-black text-[#2B2420] tracking-tight mb-2">
            {stats.points.toLocaleString()}{' '}
            <span className="text-sm font-sans font-bold text-[#D4A017]">XP</span>
          </div>
          <p className="text-xs text-[#2B2420]/75 mb-3 font-medium">
            {(Math.max(0, stats.nextLevelPoints - stats.points)).toLocaleString()} XP until Level {stats.level + 1} Palace Architect
          </p>
          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-[#ECE5D6] border border-[#3D3226]/20 overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full bg-[#D4A017]"
              style={{ width: `${Math.min(100, (stats.points / stats.nextLevelPoints) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Concepts Mastered (Real count from Firestore scenes) */}
        <div 
          id="stat-card-concepts"
          className="rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/25 p-5 shadow-[0_5px_0_#3D3226] hover:-translate-y-1 hover:shadow-[0_7px_0_#3D3226] relative overflow-hidden transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2B2420] flex items-center gap-1.5 font-mono">
              <BrainCircuit className="w-4 h-4 text-[#2E5940]" />
              Concepts Saved
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-[#ECE5D6] text-[#2E5940] font-bold border border-[#3D3226]/20 shadow-sm flex items-center gap-1">
              <Database className="w-3 h-3 text-[#2E5940]" />
              Firestore
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-black text-[#2B2420] tracking-tight mb-2">
            {realConceptsCount || stats.conceptsMastered}{' '}
            <span className="text-sm font-sans font-bold text-[#2E5940]">Anchors</span>
          </div>
          <p className="text-xs text-[#2B2420]/75 mb-3 font-medium">
            Stored across {totalPalacesCount} persisted memory palace{totalPalacesCount === 1 ? '' : 's'}
          </p>
          {/* Mini Concept Visual Indicators */}
          <div className="flex items-center gap-1.5 pt-1">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`h-2 flex-1 rounded-full ${i < Math.min(6, realConceptsCount || 1) ? 'bg-[#2E5940]' : 'bg-[#3D3226]/15'}`} 
              />
            ))}
          </div>
        </div>

        {/* Metric 3: Streak / Spaced Repetition - Reward Moment with Gold #D4A017 */}
        <div 
          id="stat-card-streak"
          className="rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/25 p-5 shadow-[0_5px_0_#3D3226] hover:-translate-y-1 hover:shadow-[0_7px_0_#3D3226] relative overflow-hidden transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2B2420] flex items-center gap-1.5 font-mono">
              <Flame className="w-4 h-4 text-[#D4A017] fill-[#D4A017]/30" />
              Study Streak
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-[#ECE5D6] text-[#D4A017] font-extrabold border border-[#D4A017]/40 shadow-sm">
              {stats.streakDays} Day{stats.streakDays === 1 ? '' : 's'}
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-black text-[#2B2420] tracking-tight mb-2">
            {stats.streakDays}{' '}
            <span className="text-sm font-sans font-bold text-[#D4A017]">Days Active</span>
          </div>
          <p className="text-xs text-[#2B2420]/75 mb-3 font-medium">
            Spaced repetition schedules keep neural loci crystallizing.
          </p>

          {/* 7-Day Visual Tracker */}
          <div className="flex items-center justify-between pt-1">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono font-bold text-[#2B2420]/60">{day[0]}</span>
                <div 
                  className="w-5 h-5 rounded-full bg-[#D4A017] flex items-center justify-center shadow-sm border border-[#3D3226]/20"
                  title={`${day}: Active study recorded`}
                >
                  <span className="text-[9px] text-[#2B2420] font-black">✓</span>
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
            <Compass className="w-4 h-4 text-[#2E5940]" />
            <h2 className="text-lg font-serif font-bold text-[#2B2420]">Your Persisted Memory Palaces</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#2B2420]/70 font-mono font-bold">
              {isLoadingScenes ? 'Syncing...' : `${savedScenes.length} Saved in Firestore`}
            </span>
          </div>
        </div>

        {savedScenes.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border-2 border-dashed border-[#3D3226]/30 bg-[#DCCFB0] p-8 text-center flex flex-col items-center justify-center shadow-[0_4px_0_#3D3226]">
            <div className="w-12 h-12 rounded-2xl bg-[#ECE5D6] border-2 border-[#3D3226]/20 flex items-center justify-center text-[#C2571B] mb-3 shadow-[0_2px_0_#3D3226]">
              <Compass className="w-6 h-6 text-[#2E5940]" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#2B2420] mb-1">No Saved Memory Palaces Yet</h3>
            <p className="text-xs text-[#2B2420]/80 max-w-md mb-4 leading-relaxed font-medium">
              When you generate a memory palace, it will automatically save into your Firestore database so you can revisit your chambers anytime.
            </p>
            <button
              type="button"
              onClick={onNavigateToInput}
              className="game-btn-primary px-4 py-2.5 text-xs font-bold shadow-[0_3px_0_#8B350C] flex items-center gap-2 cursor-pointer"
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
                  className="rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/25 hover:border-[#C2571B] p-5 transition-all duration-150 flex flex-col justify-between group shadow-[0_4px_0_#3D3226] hover:-translate-y-1 hover:shadow-[0_6px_0_#3D3226]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-md bg-[#ECE5D6] text-[#C2571B] border border-[#3D3226]/20 font-bold shadow-sm">
                        {scene.archetype || 'Palace'}
                      </span>
                      <span className="text-xs text-[#2B2420]/60 flex items-center gap-1 font-mono font-medium">
                        <Clock className="w-3 h-3" />
                        {formatDate(scene.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-sm text-[#2B2420] group-hover:text-[#C2571B] transition-colors mb-2 line-clamp-1">
                      {scene.scene_name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-[#2B2420]/75 mb-4">
                      <span className="font-medium">{roomsCount} Anchor Loci / Room{roomsCount === 1 ? '' : 's'}</span>
                      <span className="text-[#2E5940] font-bold flex items-center gap-1 font-mono">
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
                    className="w-full py-2.5 px-3 game-btn-primary text-xs font-bold shadow-[0_3px_0_#8B350C] flex items-center justify-center gap-1.5 cursor-pointer"
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
      <div className="rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/25 p-5 shadow-[0_5px_0_#3D3226]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#2E5940]" />
            <h3 className="text-sm font-serif font-bold text-[#2B2420]">Spaced Spatial Recall & Exam Collections</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#2B2420]/70 font-mono">
            <span>Quiz Attempts: <strong className="text-[#C2571B]">{quizCount}</strong></span>
            <span>•</span>
            <span>Next Review: <strong className="text-[#2B2420]">Tomorrow at 9:00 AM</strong></span>
          </div>
        </div>

        {/* Informative Firestore collections readiness notice */}
        <div className="p-4 rounded-xl bg-[#ECE5D6] border-2 border-[#3D3226]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#2B2420] shadow-[0_2px_0_#3D3226]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#DCCFB0] border border-[#3D3226]/20 flex items-center justify-center text-[#2E5940] shrink-0 shadow-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#2B2420] block">Firestore Collections Active</span>
              <span className="text-[#2B2420]/80 font-medium">
                Collections <code className="text-[#C2571B] font-mono font-bold">scenes</code>, <code className="text-[#2E5940] font-mono font-bold">quiz_results</code>, <code className="text-[#D4A017] font-mono font-bold">points</code>, and <code className="text-[#2E5940] font-mono font-bold">user_progress</code> are provisioned and synchronized with your memory palaces.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToScene}
            className="game-btn-secondary px-3.5 py-1.5 text-xs font-bold shadow-[0_2px_0_#3D3226] shrink-0 cursor-pointer"
          >
            Review Active Palace
          </button>
        </div>
      </div>
    </div>
  );
};
