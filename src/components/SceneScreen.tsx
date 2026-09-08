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
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#ECE5D6] border border-[#3D3226]/20 text-[#C2571B] flex items-center gap-1.5 shadow-sm">
              <Home className="w-3.5 h-3.5 text-[#2E5940]" />
              <span>Shared Scene</span>
            </span>
            <span className="text-xs text-[#3D3226]/40">•</span>
            <span className="text-xs font-mono text-[#2B2420]/80">
              Theme: {archetype.name}
            </span>
            <span className="text-xs text-[#3D3226]/40">•</span>
            <span className="text-xs font-mono text-[#C2571B]">
              {rooms.length} Concept {rooms.length === 1 ? 'Chamber' : 'Chambers'}
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#2B2420] tracking-tight">
            {sceneName}
          </h1>

          {/* Horizontal divider under screen heading */}
          <div className="w-16 h-0.5 bg-[#3D3226]/20 my-2" />
          
          <p className="text-xs sm:text-sm text-[#2B2420]/80 mt-1 max-w-2xl leading-relaxed">
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
            className="game-btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer shadow-[0_3px_0_#3D3226]"
          >
            <Code2 className="w-3.5 h-3.5 text-[#2E5940]" />
            <span>{showJsonInspector ? 'Hide Scene JSON' : 'Inspect JSON'}</span>
          </button>

          <button
            type="button"
            id="scene-back-to-input-btn"
            onClick={onNavigateToInput}
            className="game-btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer shadow-[0_3px_0_#3D3226]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C2571B]" />
            <span>Generate New</span>
          </button>

          <button
            type="button"
            id="scene-start-exam-btn"
            onClick={onNavigateToExam}
            className="game-btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-[0_3px_0_#8B350C]"
          >
            <GraduationCap className="w-3.5 h-3.5 text-white" />
            <span>Start Exam</span>
          </button>

          <button
            type="button"
            id="scene-go-to-dashboard-btn"
            onClick={onNavigateToDashboard}
            className="game-btn-sage text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-[0_3px_0_#1a3826]"
          >
            <span>Mastery Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Optional Raw JSON Inspector Modal/Panel */}
      {showJsonInspector && (
        <div className="mb-6 p-5 rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/30 shadow-[0_5px_0_#3D3226] animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#3D3226]/15 mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#2E5940]" />
              <span className="text-xs font-serif font-bold text-[#2B2420]">
                Gemini Client-Side Structured Output (JSON)
              </span>
            </div>
            <button
              type="button"
              id="copy-json-btn"
              onClick={handleCopyJson}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#ECE5D6] hover:bg-[#DCCFB0] text-[#2B2420] border border-[#3D3226]/20 shadow-[0_2px_0_#3D3226] font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2E5940]" />
                  <span className="text-[#2E5940] font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#2B2420]/60" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-xs font-mono text-[#2B2420] bg-[#ECE5D6] p-4 rounded-xl overflow-x-auto max-h-64 border-2 border-[#3D3226]/15">
            {JSON.stringify(generatedScene, null, 2)}
          </pre>
        </div>
      )}

      {/* CLICKABLE ROOM TILES: Shows all rooms as interactive game tiles */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DoorOpen className="w-4 h-4 text-[#2E5940]" />
            <h2 className="text-sm font-serif font-bold text-[#2B2420] tracking-wide">
              Palace Rooms ({rooms.length})
            </h2>
            <span className="text-xs text-[#2B2420]/60 hidden sm:inline font-sans">
              — Click a room tile to inspect its concept anchor and vivid metaphor
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#C2571B] bg-[#DCCFB0] border-2 border-[#3D3226]/20 px-2.5 py-0.5 rounded-lg shadow-[0_2px_0_#3D3226]">
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
                className={`text-left p-4 rounded-2xl border-2 transition-all duration-150 relative group cursor-pointer focus:outline-none ${
                  isActive
                    ? 'bg-[#DCCFB0] border-[#C2571B] shadow-[0_5px_0_#C2571B] -translate-y-1'
                    : 'bg-[#DCCFB0] hover:bg-[#ECE5D6] border-[#3D3226]/25 shadow-[0_4px_0_#3D3226] hover:-translate-y-1 hover:shadow-[0_6px_0_#3D3226] hover:border-[#C2571B]/60'
                }`}
              >
                {/* Active Accent Top Line */}
                {isActive && (
                  <div className="absolute top-0 left-4 right-4 h-1 bg-[#C2571B] rounded-full" />
                )}

                {/* Card Top Row: Room ID & Active Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shadow-sm ${
                        isActive
                          ? 'bg-[#C2571B] text-white'
                          : 'bg-[#ECE5D6] text-[#2B2420] border border-[#3D3226]/30'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-[#2B2420]/70 uppercase">
                      [{room.room_id || `r${index + 1}`}]
                    </span>
                  </div>

                  {isActive ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold font-mono text-[#C2571B] bg-[#ECE5D6] px-2 py-0.5 rounded-full border border-[#C2571B]/40 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C2571B]" />
                      Active Chamber
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#2B2420]/60 group-hover:text-[#C2571B] flex items-center gap-1 font-mono font-medium">
                      Explore
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  )}
                </div>

                {/* Room Title */}
                <h3
                  className={`text-sm font-serif font-bold leading-snug mb-2 transition-colors line-clamp-1 ${
                    isActive ? 'text-[#2B2420]' : 'text-[#2B2420]/90 group-hover:text-[#2B2420]'
                  }`}
                >
                  {room.room_name}
                </h3>

                {/* Key Concept Anchor */}
                <div className="mb-2 p-2 rounded-xl bg-[#ECE5D6] border border-[#3D3226]/20 flex items-center gap-2 shadow-inner">
                  <BrainCircuit className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C2571B]' : 'text-[#2E5940]'}`} />
                  <span className="text-xs text-[#2B2420] font-bold truncate font-mono">
                    {room.object_name}
                  </span>
                </div>

                {/* Metaphor Preview */}
                <p className="text-xs text-[#2B2420]/75 leading-relaxed italic line-clamp-2">
                  "{room.metaphor}"
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: Scene Viewport + Room Locus Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scene Viewport Container (lg:col-span-8) - ARCHITECTURAL BLUEPRINT PREVIEW */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div 
            id="memory-palace-room-viewport"
            className="relative w-full h-[380px] sm:h-[440px] rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/30 shadow-[0_6px_0_#3D3226] overflow-hidden flex flex-col justify-between p-4 sm:p-6"
          >
            {/* Architectural Blueprint Grid Pattern */}
            <div className="absolute inset-0 bg-blueprint-grid opacity-80 pointer-events-none" />

            {/* Dashed Room Perimeter */}
            <div className="absolute inset-3 sm:inset-5 border-2 border-dashed border-[#3D3226]/30 rounded-xl pointer-events-none">
              {/* Corner Crosshairs */}
              <div className="absolute -top-2.5 -left-2.5 font-mono text-[#C2571B] text-sm font-bold select-none">+</div>
              <div className="absolute -top-2.5 -right-2.5 font-mono text-[#C2571B] text-sm font-bold select-none">+</div>
              <div className="absolute -bottom-2.5 -left-2.5 font-mono text-[#C2571B] text-sm font-bold select-none">+</div>
              <div className="absolute -bottom-2.5 -right-2.5 font-mono text-[#C2571B] text-sm font-bold select-none">+</div>
            </div>

            {/* Top Viewport Toolbar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ECE5D6] border border-[#3D3226]/25 shadow-[0_2px_0_#3D3226]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C2571B]"></span>
                <span className="text-xs font-mono font-bold text-[#2B2420]">
                  BLUEPRINT: {sceneName.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ECE5D6] border border-[#3D3226]/25 shadow-[0_2px_0_#3D3226] text-xs font-mono font-bold text-[#2B2420]">
                <Layers className="w-3.5 h-3.5 text-[#2E5940]" />
                <span>Chamber {activeRoomIndex + 1} of {rooms.length}</span>
              </div>
            </div>

            {/* Center Room Wireframe Hologram Representation */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-2 pointer-events-none">
              <div className="relative w-64 h-64 sm:w-76 sm:h-76 flex items-center justify-center">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-[#3D3226]/25 animate-[spin_60s_linear_infinite]" />
                {/* Secondary rust ring */}
                <div className="absolute inset-6 rounded-full border border-[#C2571B]/30 animate-[spin_40s_linear_infinite_reverse]" />
                
                {/* Center mnemonic locus node */}
                <div className="w-40 h-40 rounded-2xl bg-[#ECE5D6] border-2 border-[#3D3226]/30 shadow-[0_4px_0_#3D3226] flex flex-col items-center justify-center p-3.5 text-center">
                  <BrainCircuit className="w-7 h-7 text-[#C2571B] mb-1.5" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C2571B] font-bold block truncate max-w-[130px]">
                    {activeRoom ? activeRoom.room_id : 'R1'}
                  </span>
                  <span className="text-xs font-serif font-bold text-[#2B2420] line-clamp-1 mb-1">
                    {activeRoom ? activeRoom.object_name : 'Concept'}
                  </span>
                  <span className="text-[10px] text-[#2B2420]/75 line-clamp-1 font-mono">
                    {activeRoom ? activeRoom.room_name : 'Chamber'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Memory Room Hotspots inside the scene with HOVER TOOLTIPS */}
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
                    {/* Hover tooltip showing anchor name + concept title */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-30 whitespace-nowrap animate-fade-in">
                      <div className="bg-[#ECE5D6] text-[#2B2420] border-2 border-[#3D3226]/30 px-3 py-2 rounded-xl shadow-[0_4px_0_#3D3226] text-left">
                        <div className="font-serif font-bold text-xs text-[#2B2420]">{room.room_name}</div>
                        <div className="text-[10px] font-mono font-bold text-[#C2571B]">{room.object_name}</div>
                      </div>
                      <div className="w-2.5 h-2.5 bg-[#ECE5D6] border-r-2 border-b-2 border-[#3D3226]/30 rotate-45 -mt-1.5" />
                    </div>

                    {/* Ripple glow pulse for active room */}
                    {isActive && (
                      <span className="absolute -inset-2 rounded-full bg-[#C2571B]/20 animate-ping" />
                    )}
                    
                    {/* The Numbered Room Marker Node */}
                    <div 
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-[#C2571B] text-white border-[#8B350C] scale-110 shadow-[0_3px_0_#8B350C]'
                          : 'bg-[#ECE5D6] text-[#2B2420] border-[#3D3226]/30 shadow-[0_2px_0_#3D3226] hover:border-[#C2571B] hover:text-[#C2571B]'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        isActive ? 'bg-white text-[#C2571B]' : 'bg-[#EAE2D0] text-[#2B2420] border border-[#3D3226]/30'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-mono text-[10px] uppercase font-bold">[{room.room_id}]</span>
                      <span className="max-w-[130px] truncate font-serif">{room.room_name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Viewport Status Banner */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t-2 border-[#3D3226]/15 bg-[#ECE5D6]/95 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2 text-xs text-[#2B2420]">
                <Eye className="w-4 h-4 text-[#2E5940] shrink-0" />
                <span className="truncate font-serif font-bold">
                  {activeRoom ? activeRoom.room_name : 'Mnemonic Chamber'}
                </span>
                <span className="text-[#3D3226]/40 hidden sm:inline">•</span>
                <span className="font-mono text-xs font-bold text-[#C2571B] hidden sm:inline">
                  {activeRoom?.object_name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  id="prev-room-btn"
                  onClick={handlePrevRoom}
                  className="p-1.5 rounded-xl bg-[#DCCFB0] hover:bg-[#ECE5D6] text-[#2B2420] border border-[#3D3226]/30 shadow-[0_2px_0_#3D3226] transition-all cursor-pointer hover:-translate-y-0.5"
                  title="Previous Chamber"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-[#2B2420]">
                  {activeRoomIndex + 1} of {Math.max(rooms.length, 1)}
                </span>
                <button
                  type="button"
                  id="next-room-btn"
                  onClick={handleNextRoom}
                  className="p-1.5 rounded-xl bg-[#DCCFB0] hover:bg-[#ECE5D6] text-[#2B2420] border border-[#3D3226]/30 shadow-[0_2px_0_#3D3226] transition-all cursor-pointer hover:-translate-y-0.5"
                  title="Next Chamber"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick study guidance strip */}
          <div className="p-3.5 rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/25 shadow-[0_3px_0_#3D3226] flex items-center justify-between text-xs text-[#2B2420]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C2571B] shrink-0" />
              <span>
                Select any room tile above or click spatial nodes in the blueprint to traverse chambers.
              </span>
            </div>
            <span className="text-[#C2571B] font-mono text-xs font-bold shrink-0">
              Viewing: {activeRoom?.room_id || 'r1'}
            </span>
          </div>
        </div>

        {/* Room / Concept / Metaphor Inspector Card (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/30 p-5 sm:p-6 shadow-[0_6px_0_#3D3226] h-full flex flex-col justify-between">
            <div>
              {/* Card Header: Room ID and Name */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-[#3D3226]/15">
                <span className="text-xs font-bold tracking-wider uppercase text-[#C2571B] font-mono flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2E5940]" />
                  Chamber Inspection
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-black bg-[#ECE5D6] text-[#C2571B] border border-[#3D3226]/30 shadow-[0_2px_0_#3D3226]">
                  {activeRoom?.room_id || 'r1'}
                </span>
              </div>

              {/* Room Name */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-[#2B2420]/70 uppercase tracking-wider block mb-1 font-mono">
                  Chamber Designation
                </span>
                <h2 className="text-lg font-serif font-extrabold text-[#2B2420] leading-snug">
                  {activeRoom?.room_name || 'Sanctuary of Knowledge'}
                </h2>
              </div>

              {/* Key Concept from the text */}
              <div className="mb-4 p-3.5 rounded-xl bg-[#ECE5D6] border-2 border-[#3D3226]/20 shadow-[0_3px_0_#3D3226]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[#2B2420] uppercase tracking-wider flex items-center gap-1.5 font-serif">
                    <BrainCircuit className="w-3.5 h-3.5 text-[#2E5940]" />
                    Key Concept Anchor
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#C2571B]">
                    (object_name)
                  </span>
                </div>
                <div className="text-base font-black text-[#2B2420] font-mono">
                  {activeRoom?.object_name || 'Key Concept'}
                </div>
              </div>

              {/* Vivid Metaphor */}
              <div className="mb-5 p-4 rounded-xl bg-[#ECE5D6] border-2 border-[#3D3226]/20 shadow-[0_3px_0_#3D3226]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#C2571B] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-[#C2571B]" />
                    Vivid Sensory Metaphor
                  </span>
                  <span className="text-[10px] font-mono text-[#2B2420]/50">
                    (metaphor)
                  </span>
                </div>
                <p className="text-sm text-[#2B2420]/90 leading-relaxed italic">
                  "{activeRoom?.metaphor || 'A sensory landmark designed to anchor the memory effortlessly.'}"
                </p>
              </div>

              {/* Mnemonic Recall Prompt */}
              <div className="p-3 rounded-xl bg-[#ECE5D6] border border-[#3D3226]/20 text-xs text-[#2B2420]/80">
                <span className="text-[#2B2420] font-bold block mb-0.5">
                  Spatial Encoding Tip:
                </span>
                Mentally step through the door of <strong>{activeRoom?.room_name}</strong>. Anchor <strong>{activeRoom?.object_name}</strong> to the room's physical layout by picturing {activeRoom?.metaphor?.slice(0, 80)}...
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t-2 border-[#3D3226]/15 space-y-2.5">
              <button
                type="button"
                id="next-chamber-btn"
                onClick={handleNextRoom}
                className="w-full py-3 px-4 game-btn-primary text-xs font-bold shadow-[0_4px_0_#8B350C] flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
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
                className="w-full py-2.5 px-4 game-btn-secondary text-xs font-bold shadow-[0_3px_0_#3D3226] flex items-center justify-center gap-1.5 cursor-pointer"
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
