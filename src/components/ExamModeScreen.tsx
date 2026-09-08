import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Sparkles,
  MapPin,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BrainCircuit,
  DoorOpen,
  GripVertical,
  ArrowRight,
  Trophy,
  AlertCircle,
  X,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { GeneratedMemoryPalaceScene, MemoryRoom } from '../types';
import { DEFAULT_GENERATED_SCENE } from '../data';

export interface ExamModeScreenProps {
  generatedScene?: GeneratedMemoryPalaceScene;
  onNavigateToDashboard: () => void;
  onNavigateToInput: () => void;
}

// Utility function to shuffle array items
function shuffleArray<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const ExamModeScreen: React.FC<ExamModeScreenProps> = ({
  generatedScene,
  onNavigateToDashboard,
  onNavigateToInput,
}) => {
  // Resolve effective scene with fallback to DEFAULT_GENERATED_SCENE
  const activeScene = useMemo<GeneratedMemoryPalaceScene>(() => {
    if (
      generatedScene?.scene?.rooms &&
      Array.isArray(generatedScene.scene.rooms) &&
      generatedScene.scene.rooms.length > 0
    ) {
      return generatedScene;
    }
    return DEFAULT_GENERATED_SCENE;
  }, [generatedScene]);

  const rooms: MemoryRoom[] = activeScene.scene?.rooms || [];
  const sceneName = activeScene.scene?.scene_name || 'Mnemonic Sanctuary';

  // Randomized list of object names (shuffled on mount or when scene changes)
  const [shuffledObjects, setShuffledObjects] = useState<string[]>(() => {
    const initialObjects = activeScene.scene?.rooms?.map((r) => r.object_name) || [];
    return shuffleArray(initialObjects);
  });

  // Mapping of roomId -> placed object_name
  const [placements, setPlacements] = useState<Record<string, string>>({});

  // Active drag tracking for styling and drop handling
  const [draggedItem, setDraggedItem] = useState<{
    objectName: string;
    sourceRoomId: string | null;
  } | null>(null);

  // Drop target feedback
  const [dragOverRoomId, setDragOverRoomId] = useState<string | null>(null);
  const [isOverSidebar, setIsOverSidebar] = useState<boolean>(false);

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);

  // Re-shuffle only when activeScene changes
  useEffect(() => {
    const currentObjects = activeScene.scene?.rooms?.map((r) => r.object_name) || [];
    setShuffledObjects(shuffleArray(currentObjects));
    setPlacements({});
    setIsSubmitted(false);
    setScore(null);
  }, [activeScene]);

  // Concept labels currently available in the sidebar (not yet placed in any room)
  const placedObjectNames = useMemo(() => new Set(Object.values(placements)), [placements]);
  const availableObjects = useMemo(
    () => shuffledObjects.filter((name) => !placedObjectNames.has(name)),
    [shuffledObjects, placedObjectNames]
  );

  // Drag start from sidebar
  const handleDragStartFromSidebar = (
    e: React.DragEvent<HTMLDivElement>,
    objectName: string
  ) => {
    if (isSubmitted) return;
    const payload = { objectName, sourceRoomId: null };
    setDraggedItem(payload);
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.setData('text/plain', objectName);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Drag start from an already placed room card
  const handleDragStartFromRoom = (
    e: React.DragEvent<HTMLDivElement>,
    roomId: string,
    objectName: string
  ) => {
    if (isSubmitted) return;
    const payload = { objectName, sourceRoomId: roomId };
    setDraggedItem(payload);
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.setData('text/plain', objectName);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverRoomId(null);
    setIsOverSidebar(false);
  };

  // Drop onto a specific room card
  const handleDropOnRoom = (targetRoomId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isSubmitted) return;

    let objectName = draggedItem?.objectName;
    let sourceRoomId = draggedItem?.sourceRoomId ?? null;

    if (!objectName) {
      try {
        const raw = e.dataTransfer.getData('application/json');
        if (raw) {
          const parsed = JSON.parse(raw);
          objectName = parsed.objectName;
          sourceRoomId = parsed.sourceRoomId;
        } else {
          objectName = e.dataTransfer.getData('text/plain');
        }
      } catch {
        objectName = e.dataTransfer.getData('text/plain');
      }
    }

    if (!objectName) {
      setDragOverRoomId(null);
      return;
    }

    setPlacements((prev) => {
      const next = { ...prev };
      const currentTargetOccupant = next[targetRoomId];

      if (sourceRoomId && sourceRoomId !== targetRoomId) {
        // Moving from another room: swap if target room already has an object
        if (currentTargetOccupant) {
          next[sourceRoomId] = currentTargetOccupant;
        } else {
          delete next[sourceRoomId];
        }
      } else if (!sourceRoomId) {
        // Coming from sidebar: if target room already has an occupant,
        // it gets displaced and automatically returns to the sidebar
      }

      next[targetRoomId] = objectName;
      return next;
    });

    setDraggedItem(null);
    setDragOverRoomId(null);
  };

  // Drop back onto the sidebar to unplace an object
  const handleDropOnSidebar = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isSubmitted) return;

    let sourceRoomId = draggedItem?.sourceRoomId;
    if (!sourceRoomId) {
      try {
        const raw = e.dataTransfer.getData('application/json');
        if (raw) {
          const parsed = JSON.parse(raw);
          sourceRoomId = parsed.sourceRoomId;
        }
      } catch {
        // ignore
      }
    }

    if (sourceRoomId) {
      setPlacements((prev) => {
        const next = { ...prev };
        delete next[sourceRoomId!];
        return next;
      });
    }

    setDraggedItem(null);
    setIsOverSidebar(false);
  };

  // Click-to-unplace convenience helper
  const handleUnplace = (roomId: string) => {
    if (isSubmitted) return;
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[roomId];
      return next;
    });
  };

  // Exam submission and scoring
  const handleSubmitExam = () => {
    if (rooms.length === 0) return;

    let correctCount = 0;
    rooms.forEach((room) => {
      const placed = placements[room.room_id];
      if (
        placed &&
        placed.trim().toLowerCase() === room.object_name.trim().toLowerCase()
      ) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / rooms.length) * 10);
    setScore(calculatedScore);
    setIsSubmitted(true);
  };

  // Retake exam: re-shuffle concept pool and clear placements
  const handleRetakeExam = () => {
    const currentObjects = activeScene.scene?.rooms?.map((r) => r.object_name) || [];
    setShuffledObjects(shuffleArray(currentObjects));
    setPlacements({});
    setIsSubmitted(false);
    setScore(null);
  };

  const totalPlacedCount = Object.keys(placements).length;
  const isAllPlaced = rooms.length > 0 && totalPlacedCount === rooms.length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(147,51,234,0.2)]">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              <span>Exam Recall Mode</span>
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-mono text-cyan-300">
              {sceneName}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">
              {rooms.length} {rooms.length === 1 ? 'Chamber' : 'Chambers'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Spatial Recall Assessment</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Test your spatial memory anchors: Drag each concept from the sidebar into its correct palace chamber.
            Submit when all rooms are placed to calculate your score.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            type="button"
            id="exam-retake-btn"
            onClick={handleRetakeExam}
            className="text-xs px-3.5 py-2 rounded-xl bg-[#0d1224] hover:bg-[#131a33] text-slate-300 hover:text-white border border-slate-800 hover:border-purple-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
            <span>Reset / Re-shuffle</span>
          </button>

          <button
            type="button"
            id="exam-back-to-input-btn"
            onClick={onNavigateToInput}
            className="text-xs px-3.5 py-2 rounded-xl bg-[#0d1224] hover:bg-[#131a33] text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <DoorOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Palace</span>
          </button>

          <button
            type="button"
            id="exam-go-to-dashboard-btn"
            onClick={onNavigateToDashboard}
            className="text-xs px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Mastery Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SCORE CARD (Visible after submission) */}
      {isSubmitted && score !== null && (
        <div
          id="exam-score-card"
          className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#0e1438] via-[#090e28] to-[#040614] border border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.25)] relative overflow-hidden animate-fade-in backdrop-blur-xl"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left flex-col sm:flex-row">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                    Assessment Result
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-purple-300">
                    {score >= 8 ? 'Mastery Achieved' : score >= 5 ? 'Good Recall' : 'Keep Practicing'}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Your score: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-indigo-300">{score}/10</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  {score === 10 && 'Flawless recall! Every memory anchor was placed with exact precision.'}
                  {score >= 7 && score < 10 && 'Impressive spatial recall! Most concept anchors are securely lodged in memory.'}
                  {score >= 4 && score < 7 && 'Solid effort. Review the room sensory metaphors below to solidify the remaining anchors.'}
                  {score < 4 && 'Chambers require reinforcement. Review the metaphors below and walk through the scene once more.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
              <button
                type="button"
                id="score-retake-btn"
                onClick={handleRetakeExam}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/40 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                <span>Retake Exam</span>
              </button>
              <button
                type="button"
                id="score-dashboard-btn"
                onClick={onNavigateToDashboard}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: Rooms Drop Zones (col-8) + Draggable Concepts Sidebar (col-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ROOMS DROP-ZONE SECTION (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Palace Chambers ({rooms.length})
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Placed:</span>
              <span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                {totalPlacedCount} / {rooms.length}
              </span>
            </div>
          </div>

          {/* Grid of Room Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rooms.map((room, index) => {
              const placedObject = placements[room.room_id];
              const isOverThisRoom = dragOverRoomId === room.room_id;
              const isCorrect =
                isSubmitted &&
                placedObject &&
                placedObject.trim().toLowerCase() === room.object_name.trim().toLowerCase();
              const isIncorrect = isSubmitted && (!placedObject || !isCorrect);

              // Border and background state classes
              let containerClasses = 'bg-[#090d1f]/80 border-slate-800 hover:border-purple-500/40';
              if (isOverThisRoom) {
                containerClasses =
                  'bg-cyan-950/40 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400/80 scale-[1.01]';
              } else if (isSubmitted) {
                if (isCorrect) {
                  containerClasses =
                    'bg-[#06141a]/90 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
                } else {
                  containerClasses =
                    'bg-[#190a12]/90 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.2)]';
                }
              } else if (placedObject) {
                containerClasses =
                  'bg-[#0c122c]/90 border-purple-500/40 shadow-[0_0_20px_rgba(147,51,234,0.15)]';
              }

              return (
                <div
                  key={room.room_id}
                  id={`room-dropzone-${room.room_id}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!isSubmitted) {
                      e.dataTransfer.dropEffect = 'move';
                    }
                  }}
                  onDragEnter={() => {
                    if (!isSubmitted) setDragOverRoomId(room.room_id);
                  }}
                  onDragLeave={() => {
                    if (dragOverRoomId === room.room_id) setDragOverRoomId(null);
                  }}
                  onDrop={(e) => handleDropOnRoom(room.room_id, e)}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between min-h-[220px] relative ${containerClasses}`}
                >
                  {/* Top Bar: Room ID & Header status */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase bg-slate-900 text-cyan-300 border border-slate-700">
                          {room.room_id || `r${index + 1}`}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Chamber {index + 1}
                        </span>
                      </div>

                      {/* Post-submit status pill */}
                      {isSubmitted ? (
                        isCorrect ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/40">
                            <XCircle className="w-3 h-3 text-rose-400" />
                            Incorrect
                          </span>
                        )
                      ) : placedObject ? (
                        <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                          Placed
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          Drop target
                        </span>
                      )}
                    </div>

                    {/* Room Name */}
                    <h3 className="text-sm font-bold text-white leading-snug mb-3">
                      {room.room_name}
                    </h3>
                  </div>

                  {/* Center Drop Zone Receptacle */}
                  <div className="my-2">
                    {placedObject ? (
                      /* Placed object card (Draggable to another room or sidebar if not submitted) */
                      <div
                        draggable={!isSubmitted}
                        onDragStart={(e) =>
                          handleDragStartFromRoom(e, room.room_id, placedObject)
                        }
                        onDragEnd={handleDragEnd}
                        className={`p-3 rounded-xl border transition-all select-none ${
                          isSubmitted
                            ? isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                              : 'bg-rose-950/40 border-rose-500/50 text-rose-100'
                            : 'bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border-purple-400/50 shadow-[0_0_15px_rgba(147,51,234,0.25)] hover:border-cyan-400 cursor-grab active:cursor-grabbing text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {!isSubmitted && (
                              <GripVertical className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            )}
                            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="text-[10px] font-mono uppercase text-slate-400">
                              Placed Anchor:
                            </span>
                          </div>

                          {!isSubmitted && (
                            <button
                              type="button"
                              onClick={() => handleUnplace(room.room_id)}
                              title="Remove concept back to pool"
                              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="text-xs font-bold leading-tight break-words">
                          {placedObject}
                        </div>
                      </div>
                    ) : (
                      /* Empty Receptacle Slot */
                      <div
                        className={`py-6 px-3 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all ${
                          isOverThisRoom
                            ? 'border-cyan-400 bg-cyan-950/30'
                            : 'border-slate-800/90 bg-black/20 hover:border-slate-700'
                        }`}
                      >
                        <MapPin
                          className={`w-5 h-5 mb-1.5 transition-colors ${
                            isOverThisRoom ? 'text-cyan-400 animate-bounce' : 'text-slate-600'
                          }`}
                        />
                        <span className="text-xs font-medium text-slate-400">
                          {isOverThisRoom ? 'Release to Place' : 'Drop Concept Here'}
                        </span>
                        <span className="text-[10px] text-slate-600 mt-0.5">
                          Drag from the sidebar
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Post-submit Review: Expected Answer & Sensory Metaphor */}
                  {isSubmitted && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs">
                      {isIncorrect && (
                        <div className="mb-2 p-2 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-200">
                          <span className="text-[10px] font-mono uppercase text-rose-400 block font-bold">
                            Correct Concept:
                          </span>
                          <span className="font-semibold text-white">
                            {room.object_name}
                          </span>
                        </div>
                      )}
                      <div className="p-2 rounded-lg bg-black/30 text-[11px] text-slate-400 italic">
                        "{room.metaphor}"
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission and Action Section below the rooms */}
          <div className="mt-4 p-5 rounded-2xl bg-[#090d1f]/90 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_25px_rgba(147,51,234,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Layers className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Placement Status
                </h4>
                <p className="text-xs text-slate-400">
                  {isAllPlaced
                    ? 'All concept anchors are placed in rooms. Ready to score!'
                    : `${rooms.length - totalPlacedCount} of ${rooms.length} rooms remaining to be filled.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isSubmitted ? (
                <button
                  type="button"
                  id="submit-exam-btn"
                  onClick={handleSubmitExam}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-200" />
                  <span>Submit Exam</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="exam-retake-footer-btn"
                  onClick={handleRetakeExam}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                  <span>Try Again</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR: Draggable Concepts Pool (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div
            id="exam-concept-sidebar"
            onDragOver={(e) => {
              e.preventDefault();
              if (!isSubmitted) {
                e.dataTransfer.dropEffect = 'move';
              }
            }}
            onDragEnter={() => {
              if (!isSubmitted) setIsOverSidebar(true);
            }}
            onDragLeave={() => setIsOverSidebar(false)}
            onDrop={handleDropOnSidebar}
            className={`rounded-2xl bg-[#0a0e20]/90 border p-5 shadow-[0_0_25px_-5px_rgba(112,26,117,0.2)] backdrop-blur-xl transition-all lg:sticky lg:top-6 flex flex-col justify-between min-h-[420px] ${
              isOverSidebar
                ? 'border-cyan-400 bg-cyan-950/25 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                : 'border-purple-500/25'
            }`}
          >
            <div>
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Concept Pool
                  </h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                  {availableObjects.length} Available
                </span>
              </div>

              {/* Study Tip / Instructions */}
              <div className="mb-4 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Drag items from here onto any room card. To unplace an item, drag it back into this sidebar.
                </span>
              </div>

              {/* Draggable Object Cards List */}
              <div className="space-y-2.5">
                {availableObjects.length > 0 ? (
                  availableObjects.map((objectName, index) => {
                    const isBeingDragged =
                      draggedItem?.objectName === objectName && !draggedItem.sourceRoomId;
                    return (
                      <div
                        key={`pool-item-${index}-${objectName}`}
                        draggable={!isSubmitted}
                        onDragStart={(e) => handleDragStartFromSidebar(e, objectName)}
                        onDragEnd={handleDragEnd}
                        className={`p-3 rounded-xl border transition-all select-none ${
                          isSubmitted
                            ? 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                            : isBeingDragged
                            ? 'opacity-40 scale-95 border-cyan-400 bg-cyan-950/40'
                            : 'bg-gradient-to-r from-[#0d1330] to-[#121940] border-cyan-500/30 hover:border-cyan-400 text-white cursor-grab active:cursor-grabbing shadow-[0_0_15px_rgba(6,182,212,0.12)] hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:scale-[1.01]'
                        } flex items-center gap-2.5`}
                      >
                        <GripVertical className="w-4 h-4 text-cyan-400/70 shrink-0" />
                        <span className="text-xs font-semibold text-slate-100 flex-1 leading-snug">
                          {objectName}
                        </span>
                        <BrainCircuit className="w-3.5 h-3.5 text-purple-400 shrink-0 opacity-80" />
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-center flex flex-col items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2 animate-pulse" />
                    <span className="text-xs font-bold text-white">
                      All Concepts Placed!
                    </span>
                    <span className="text-[11px] text-emerald-300/80 mt-1">
                      Click "Submit Exam" to check your spatial recall accuracy.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Bottom Instructions */}
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>
                  Randomized pool order ensures robust active recall testing.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
