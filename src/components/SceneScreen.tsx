import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Eye, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Layers,
  Code2,
  Copy,
  Check,
  BrainCircuit,
  DoorOpen,
  Home,
  GraduationCap
} from 'lucide-react';
import { GeneratedMemoryPalaceScene, MemoryRoom, PalaceArchetype } from '../types';

interface SceneScreenProps {
  archetype: PalaceArchetype;
  generatedScene: GeneratedMemoryPalaceScene;
  notesSnippet: string;
  onNavigateToInput: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToExam: () => void;
}

export const SceneScreen: React.FC<SceneScreenProps> = ({
  archetype,
  generatedScene,
  notesSnippet,
  onNavigateToInput,
  onNavigateToDashboard,
  onNavigateToExam,
}) => {
  const [activeRoomIndex, setActiveRoomIndex] = useState<number>(0);
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const rooms: MemoryRoom[] = generatedScene?.scene?.rooms || [];
  const sceneName = generatedScene?.scene?.scene_name || 'Mnemonic Sanctuary';
  const activeRoom: MemoryRoom | undefined = rooms[activeRoomIndex] || rooms[0];

  // Default coordinate layout for rooms in the 2.5D visual canvas
  const getRoomCoords = (index: number, total: number) => {
    if (total === 1) return { x: 50, y: 48 };
    if (total === 2) return index === 0 ? { x: 30, y: 50 } : { x: 70, y: 50 };
    if (total === 3) {
      const positions = [
        { x: 26, y: 55 },
        { x: 50, y: 38 },
        { x: 74, y: 55 },
      ];
      return positions[index % 3];
    }
    const angle = (index / total) * Math.PI * 2;
    return {
      x: Math.round(50 + 32 * Math.cos(angle)),
      y: Math.round(50 + 25 * Math.sin(angle)),
    };
  };

  const handleNextRoom = () => {
    if (rooms.length > 0) {
      setActiveRoomIndex((prev) => (prev + 1) % rooms.length);
    }
  };

  const handlePrevRoom = () => {
    if (rooms.length > 0) {
      setActiveRoomIndex((prev) => (prev - 1 + rooms.length) % rooms.length);
    }
  };

  const handleCopyJson = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(generatedScene, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span>Shared Scene</span>
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-purple-300 font-medium">
              Theme: {archetype.name}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">
              {rooms.length} Concept {rooms.length === 1 ? 'Chamber' : 'Chambers'}
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {sceneName}
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {notesSnippet 
              ? `Unified shared palace generated via Gemini: related concepts anchored across distinct rooms for seamless mental walking.`
              : `Explore your shared memory palace environment and inspect encoded concept chambers.`}
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            type="button"
            id="scene-toggle-json-btn"
            onClick={() => setShowJsonInspector(!showJsonInspector)}
            className={`text-xs px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              showJsonInspector
                ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-[#0d1224] hover:bg-[#131a33] text-slate-300 border-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showJsonInspector ? 'Hide Scene JSON' : 'Inspect JSON'}</span>
          </button>

          <button
            type="button"
            id="scene-back-to-input-btn"
            onClick={onNavigateToInput}
            className="text-xs px-3.5 py-2 rounded-xl bg-[#0d1224] hover:bg-[#131a33] text-slate-300 hover:text-white border border-slate-800 hover:border-purple-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
            <span>Generate New</span>
          </button>

          <button
            type="button"
            id="scene-start-exam-btn"
            onClick={onNavigateToExam}
            className="text-xs px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-200" />
            <span>Start Exam</span>
          </button>

          <button
            type="button"
            id="scene-go-to-dashboard-btn"
            onClick={onNavigateToDashboard}
            className="text-xs px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Mastery Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Optional Raw JSON Inspector Modal/Panel */}
      {showJsonInspector && (
        <div className="mb-6 p-4 rounded-2xl bg-[#050816]/95 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-fade-in backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-semibold text-cyan-300">
                Gemini Client-Side Structured Output (JSON)
              </span>
            </div>
            <button
              type="button"
              id="copy-json-btn"
              onClick={handleCopyJson}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-xs font-mono text-cyan-200/90 bg-black/60 p-4 rounded-xl overflow-x-auto max-h-64 scrollbar-thin scrollbar-thumb-slate-700">
            {JSON.stringify(generatedScene, null, 2)}
          </pre>
        </div>
      )}

      {/* CLICKABLE ROOM TILES: Shows all rooms as interactive tiles */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DoorOpen className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Palace Rooms ({rooms.length})
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              — Click a room tile to inspect its concept anchor and vivid metaphor
            </span>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md">
            Active: {activeRoom?.room_name || 'Room'}
          </span>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${rooms.length >= 3 ? 'lg:grid-cols-3' : ''} gap-4`}>
          {rooms.map((room, index) => {
            const isActive = activeRoomIndex === index;
            return (
              <button
                key={room.room_id || `room-tile-${index}`}
                id={`room-tile-${room.room_id || index}`}
                type="button"
                onClick={() => setActiveRoomIndex(index)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 relative group cursor-pointer focus:outline-none ${
                  isActive
                    ? 'bg-gradient-to-b from-[#131b3e] via-[#0e1430] to-[#080c20] border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/80 scale-[1.01]'
                    : 'bg-[#090d1f]/80 hover:bg-[#0e142e] border-slate-800 hover:border-purple-500/40'
                }`}
              >
                {/* Active Accent Top Line */}
                {isActive && (
                  <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500 rounded-full" />
                )}

                {/* Card Top Row: Room ID & Active Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                        isActive
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-400/50'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      {room.room_id || `r${index + 1}`}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Room {index + 1} of {rooms.length}
                    </span>
                  </div>

                  {isActive ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Active Chamber
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 group-hover:text-slate-300 flex items-center gap-1">
                      Click to explore
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  )}
                </div>

                {/* Room Title */}
                <h3
                  className={`text-sm font-bold leading-snug mb-2 transition-colors line-clamp-1 ${
                    isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                  }`}
                >
                  {room.room_name}
                </h3>

                {/* Key Concept Anchor */}
                <div className="mb-2 p-2 rounded-lg bg-black/40 border border-slate-800/80 flex items-center gap-2">
                  <BrainCircuit className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-purple-400'}`} />
                  <span className="text-xs text-slate-300 font-semibold truncate">
                    {room.object_name}
                  </span>
                </div>

                {/* Metaphor Preview */}
                <p className="text-xs text-slate-400/90 leading-relaxed italic line-clamp-2">
                  "{room.metaphor}"
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: Scene Viewport + Room Locus Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scene Viewport Container (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div 
            id="memory-palace-room-viewport"
            className="relative w-full h-[380px] sm:h-[440px] rounded-2xl bg-gradient-to-b from-[#0a0e22] via-[#070a16] to-[#04060e] border border-purple-500/20 shadow-[0_0_35px_-5px_rgba(147,51,234,0.15)] overflow-hidden flex flex-col justify-between p-4 sm:p-6"
          >
            {/* Ambient Background Glow Orbs */}
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Perspective Grid Floor for Room Atmosphere */}
            <div 
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse 70% 60% at 50% 60%, rgba(99, 102, 241, 0.3), transparent 80%),
                  linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(168, 85, 247, 0.15) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 40px 40px, 40px 40px',
              }}
            />

            {/* Top Viewport Toolbar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080d1e]/80 border border-slate-800/80 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                <span className="text-xs font-mono text-slate-300">
                  SCENE: {sceneName.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#080d1e]/80 border border-slate-800/80 backdrop-blur-md text-xs text-slate-400">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Chamber {activeRoomIndex + 1} of {rooms.length}</span>
              </div>
            </div>

            {/* Center Room Wireframe Hologram Representation */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-2 pointer-events-none">
              <div className="relative w-64 h-64 sm:w-76 sm:h-76 flex items-center justify-center">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-purple-500/25 animate-[spin_60s_linear_infinite]" />
                {/* Secondary cyan ring */}
                <div className="absolute inset-6 rounded-full border border-cyan-500/20 animate-[spin_40s_linear_infinite_reverse]" />
                
                {/* Center glowing mnemonic locus node */}
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-tr from-purple-950/80 via-indigo-950/70 to-cyan-950/80 border border-cyan-400/40 backdrop-blur-md flex flex-col items-center justify-center p-3.5 shadow-[0_0_35px_rgba(6,182,212,0.25)] text-center">
                  <BrainCircuit className="w-7 h-7 text-cyan-300 mb-1.5 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-200 block truncate max-w-[130px]">
                    {activeRoom ? activeRoom.room_id : 'R1'}
                  </span>
                  <span className="text-xs font-bold text-white line-clamp-1 mb-1">
                    {activeRoom ? activeRoom.object_name : 'Concept'}
                  </span>
                  <span className="text-[10px] text-slate-300/80 line-clamp-1">
                    {activeRoom ? activeRoom.room_name : 'Chamber'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Memory Room Hotspots inside the scene */}
            <div className="absolute inset-0 z-20 pointer-events-auto">
              {rooms.map((room, index) => {
                const isActive = activeRoomIndex === index;
                const coords = getRoomCoords(index, rooms.length);
                return (
                  <button
                    key={room.room_id || `room-pin-${index}`}
                    type="button"
                    id={`room-pin-${room.room_id || index}`}
                    onClick={() => setActiveRoomIndex(index)}
                    style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                    title={`Click to view ${room.room_name}`}
                  >
                    {/* Ripple glow pulse for active room */}
                    {isActive && (
                      <span className="absolute -inset-3 rounded-full bg-cyan-400/25 animate-ping" />
                    )}
                    
                    {/* The Room Marker Pin */}
                    <div 
                      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-cyan-600 text-white border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-110'
                          : 'bg-[#090d1f]/90 text-slate-300 border-purple-500/30 hover:border-cyan-400/60 hover:text-white'
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-200' : 'text-purple-400'}`} />
                      <span className="font-mono text-[10px] uppercase text-cyan-200/90">[{room.room_id}]</span>
                      <span className="max-w-[140px] truncate">{room.room_name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Viewport Status Banner */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 bg-[#060917]/80 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">
                  {activeRoom ? activeRoom.room_name : 'Mnemonic Chamber'}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  id="prev-room-btn"
                  onClick={handlePrevRoom}
                  className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Previous Chamber"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {activeRoomIndex + 1} of {Math.max(rooms.length, 1)}
                </span>
                <button
                  type="button"
                  id="next-room-btn"
                  onClick={handleNextRoom}
                  className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Next Chamber"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick study guidance strip */}
          <div className="p-3.5 rounded-xl bg-[#090d1e]/70 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Select any room tile above or click spatial pins to travel between chambers.
              </span>
            </div>
            <span className="text-purple-300 text-xs font-medium shrink-0">
              Viewing: {activeRoom?.room_id || 'r1'}
            </span>
          </div>
        </div>

        {/* Room / Concept / Metaphor Inspector Card (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="rounded-2xl bg-[#0a0e20]/90 border border-purple-500/25 p-5 shadow-[0_0_25px_-5px_rgba(112,26,117,0.2)] backdrop-blur-xl h-full flex flex-col justify-between">
            <div>
              {/* Card Header: Room ID and Name */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
                <span className="text-xs font-semibold tracking-wider uppercase text-purple-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Chamber Inspection
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-purple-950/80 text-cyan-200 border border-purple-500/30">
                  {activeRoom?.room_id || 'r1'}
                </span>
              </div>

              {/* Room Name */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Chamber Designation
                </span>
                <h2 className="text-lg font-bold text-white leading-snug">
                  {activeRoom?.room_name || 'Sanctuary of Knowledge'}
                </h2>
              </div>

              {/* Key Concept from the text */}
              <div className="mb-4 p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.1)]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                    Key Concept Anchor
                  </span>
                  <span className="text-[10px] font-mono text-purple-400">
                    (object_name)
                  </span>
                </div>
                <div className="text-base font-bold text-white">
                  {activeRoom?.object_name || 'Key Concept'}
                </div>
              </div>

              {/* Vivid Metaphor */}
              <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-[#070b1d] to-[#0a112c] border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Vivid Sensory Metaphor
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    (metaphor)
                  </span>
                </div>
                <p className="text-sm text-cyan-100/90 leading-relaxed italic">
                  "{activeRoom?.metaphor || 'A sensory landmark designed to anchor the memory effortlessly.'}"
                </p>
              </div>

              {/* Mnemonic Recall Prompt */}
              <div className="p-3 rounded-xl bg-[#080d1e] border border-slate-800/80 text-xs text-slate-400">
                <span className="text-slate-300 font-semibold block mb-0.5">
                  Spatial Encoding Tip:
                </span>
                Mentally step through the door of <strong>{activeRoom?.room_name}</strong>. Anchor <strong>{activeRoom?.object_name}</strong> to the room's physical layout by picturing {activeRoom?.metaphor?.slice(0, 80)}...
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
              <button
                type="button"
                id="next-chamber-btn"
                onClick={handleNextRoom}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-200" />
                <span>
                  {rooms.length > 1
                    ? `Next Room (${(activeRoomIndex + 1) % rooms.length + 1} of ${rooms.length})`
                    : 'Chamber Anchored (Review Stats)'}
                </span>
              </button>

              <button
                type="button"
                id="view-stats-from-scene-btn"
                onClick={onNavigateToDashboard}
                className="w-full py-2 px-4 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-transparent hover:bg-slate-800/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Check Study Mastery & Streak</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
