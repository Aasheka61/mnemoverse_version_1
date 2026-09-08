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
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#ECE5D6] border border-[#3D3226]/20 text-[#C2571B] flex items-center gap-1.5 shadow-sm">
              <GraduationCap className="w-3.5 h-3.5 text-[#C2571B]" />
              <span>Exam Recall Mode</span>
            </span>
            <span className="text-xs text-[#3D3226]/40">•</span>
            <span className="text-xs font-mono text-[#2B2420] font-semibold">
              {sceneName}
            </span>
            <span className="text-xs text-[#3D3226]/40">•</span>
            <span className="text-xs font-mono text-[#2B2420]/70">
              {rooms.length} {rooms.length === 1 ? 'Chamber' : 'Chambers'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#2B2420] tracking-tight flex items-center gap-2.5">
            <span>Spatial Recall Assessment</span>
          </h1>
          {/* Horizontal divider under screen heading */}
          <div className="w-16 h-0.5 bg-[#3D3226]/20 my-2" />

          <p className="text-xs sm:text-sm text-[#2B2420]/80 mt-1 max-w-2xl leading-relaxed">
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
            className="game-btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer shadow-[0_3px_0_#3D3226]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C2571B]" />
            <span>Reset / Re-shuffle</span>
          </button>

          <button
            type="button"
            id="exam-back-to-input-btn"
            onClick={onNavigateToInput}
            className="game-btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer shadow-[0_3px_0_#3D3226]"
          >
            <DoorOpen className="w-3.5 h-3.5 text-[#2E5940]" />
            <span>New Palace</span>
          </button>

          <button
            type="button"
            id="exam-go-to-dashboard-btn"
            onClick={onNavigateToDashboard}
            className="game-btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-[0_3px_0_#8B350C]"
          >
            <span>Mastery Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SCORE CARD (Visible after submission) - Gold Achievement Moment */}
      {isSubmitted && score !== null && (
        <div
          id="exam-score-card"
          className="mb-8 p-6 rounded-2xl bg-[#DCCFB0] border-2 border-[#D4A017] shadow-[0_6px_0_#3D3226] relative overflow-hidden animate-fade-in"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left flex-col sm:flex-row">
              <div className="w-16 h-16 rounded-2xl bg-[#ECE5D6] border-2 border-[#D4A017] flex items-center justify-center text-[#D4A017] shadow-[0_3px_0_#D4A017] shrink-0">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#D4A017] font-bold">
                    Assessment Result
                  </span>
                  <span className="text-xs text-[#3D3226]/40">•</span>
                  <span className="text-xs font-mono font-bold text-[#2B2420]">
                    {score >= 8 ? 'Mastery Achieved' : score >= 5 ? 'Good Recall' : 'Keep Practicing'}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#2B2420] tracking-tight">
                  Your score: <span className="text-[#D4A017]">{score}/10</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#2B2420]/80 mt-1 max-w-xl">
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
                className="game-btn-secondary px-4 py-2.5 text-xs font-bold shadow-[0_3px_0_#3D3226] flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C2571B]" />
                <span>Retake Exam</span>
              </button>
              <button
                type="button"
                id="score-dashboard-btn"
                onClick={onNavigateToDashboard}
                className="game-btn-primary px-4 py-2.5 text-xs font-bold shadow-[0_3px_0_#8B350C] flex items-center gap-1.5 cursor-pointer"
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
              <DoorOpen className="w-4 h-4 text-[#2E5940]" />
              <h2 className="text-sm font-serif font-bold text-[#2B2420] uppercase tracking-wider">
                Palace Chambers ({rooms.length})
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#2B2420]/70 font-mono">Placed:</span>
              <span className="font-mono font-bold text-[#C2571B] bg-[#ECE5D6] border border-[#3D3226]/20 px-2 py-0.5 rounded-md">
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
              let containerClasses = 'bg-[#DCCFB0] border-[#3D3226]/25 shadow-[0_4px_0_#3D3226] hover:-translate-y-1 hover:shadow-[0_6px_0_#3D3226] hover:border-[#C2571B]';
              if (isOverThisRoom) {
                containerClasses =
                  'bg-[#DCCFB0] border-[#C2571B] ring-2 ring-[#C2571B]/50 -translate-y-1 shadow-[0_6px_0_#C2571B]';
              } else if (isSubmitted) {
                if (isCorrect) {
                  containerClasses =
                    'bg-[#DCCFB0] border-[#2E5940] shadow-[0_4px_0_#2E5940]';
                } else {
                  containerClasses =
                    'bg-[#DCCFB0] border-rose-600 shadow-[0_4px_0_#e11d48]';
                }
              } else if (placedObject) {
                containerClasses =
                  'bg-[#DCCFB0] border-[#3D3226]/30 shadow-[0_4px_0_#3D3226]';
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
                  className={`p-4 rounded-2xl border-2 transition-all duration-150 flex flex-col justify-between min-h-[220px] relative ${containerClasses}`}
                >
                  {/* Top Bar: Room ID & Header status */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#ECE5D6] border border-[#3D3226]/30 flex items-center justify-center text-[11px] font-mono font-bold text-[#2B2420]">
                          {index + 1}
                        </div>
                        <span className="text-[11px] font-mono font-bold text-[#C2571B] uppercase">
                          [{room.room_id || `r${index + 1}`}]
                        </span>
                      </div>

                      {/* Post-submit status pill */}
                      {isSubmitted ? (
                        isCorrect ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#2E5940] bg-[#ECE5D6] px-2.5 py-0.5 rounded-full border border-[#2E5940]/40 shadow-sm">
                            <CheckCircle2 className="w-3 h-3 text-[#2E5940]" />
                            Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-600/40 shadow-sm">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Incorrect
                          </span>
                        )
                      ) : placedObject ? (
                        <span className="text-[10px] font-mono font-bold text-[#2E5940] bg-[#ECE5D6] px-2.5 py-0.5 rounded-full border border-[#2E5940]/30 shadow-sm">
                          Placed
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#2B2420]/50 font-medium">
                          Drop target
                        </span>
                      )}
                    </div>

                    {/* Room Name */}
                    <h3 className="text-sm font-serif font-bold text-[#2B2420] leading-snug mb-3">
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
                        className={`p-3 rounded-xl border-2 transition-all select-none ${
                          isSubmitted
                            ? isCorrect
                              ? 'bg-[#ECE5D6] border-[#2E5940] text-[#2E5940] shadow-[0_2px_0_#2E5940]'
                              : 'bg-rose-50 border-rose-600 text-rose-800 shadow-[0_2px_0_#e11d48]'
                            : 'bg-[#ECE5D6] border-[#3D3226]/30 hover:border-[#C2571B] cursor-grab active:cursor-grabbing text-[#2B2420] shadow-[0_3px_0_#3D3226]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {!isSubmitted && (
                              <GripVertical className="w-3.5 h-3.5 text-[#C2571B] shrink-0" />
                            )}
                            <BrainCircuit className="w-3.5 h-3.5 text-[#2E5940] shrink-0" />
                            <span className="text-[10px] font-mono uppercase text-[#2B2420]/70 font-bold">
                              Placed Anchor:
                            </span>
                          </div>

                          {!isSubmitted && (
                            <button
                              type="button"
                              onClick={() => handleUnplace(room.room_id)}
                              title="Remove concept back to pool"
                              className="p-1 rounded-md text-[#2B2420]/60 hover:text-[#C2571B] hover:bg-[#DCCFB0] transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="text-xs font-bold leading-tight break-words text-[#2B2420]">
                          {placedObject}
                        </div>
                      </div>
                    ) : (
                      /* Empty Receptacle Slot - Lighter Drop-Zone Layer (#EAE2D0) inside darker card (#DCCFB0) */
                      <div
                        className={`py-6 px-3 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all ${
                          isOverThisRoom
                            ? 'border-[#C2571B] bg-[#EAE2D0]'
                            : 'border-[#3D3226]/30 bg-[#EAE2D0] hover:border-[#3D3226]/60'
                        }`}
                      >
                        <MapPin
                          className={`w-5 h-5 mb-1.5 transition-colors ${
                            isOverThisRoom ? 'text-[#C2571B] animate-bounce' : 'text-[#3D3226]/40'
                          }`}
                        />
                        <span className="text-xs font-bold text-[#2B2420]/75">
                          {isOverThisRoom ? 'Release to Place' : 'Drop Concept Here'}
                        </span>
                        <span className="text-[10px] text-[#2B2420]/50 mt-0.5 font-mono">
                          Drag from the sidebar
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Post-submit Review: Expected Answer & Sensory Metaphor */}
                  {isSubmitted && (
                    <div className="mt-2 pt-2 border-t-2 border-[#3D3226]/15 text-xs">
                      {isIncorrect && (
                        <div className="mb-2 p-2 rounded-lg bg-rose-50 border border-rose-300 text-rose-900">
                          <span className="text-[10px] font-mono uppercase text-rose-700 block font-bold">
                            Correct Concept:
                          </span>
                          <span className="font-semibold text-rose-950">
                            {room.object_name}
                          </span>
                        </div>
                      )}
                      <div className="p-2 rounded-lg bg-[#ECE5D6] text-[11px] text-[#2B2420]/80 italic border border-[#3D3226]/15">
                        "{room.metaphor}"
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission and Action Section below the rooms */}
          <div className="mt-4 p-5 rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_5px_0_#3D3226]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECE5D6] border-2 border-[#3D3226]/20 flex items-center justify-center text-[#2E5940] shadow-[0_2px_0_#3D3226]">
                <Layers className="w-5 h-5 text-[#2E5940]" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-[#2B2420] uppercase tracking-wider">
                  Placement Status
                </h4>
                <p className="text-xs text-[#2B2420]/80">
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
                  className="w-full sm:w-auto px-6 py-2.5 game-btn-primary text-xs font-bold shadow-[0_4px_0_#8B350C] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Submit Exam</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="exam-retake-footer-btn"
                  onClick={handleRetakeExam}
                  className="w-full sm:w-auto px-5 py-2.5 game-btn-secondary text-xs font-bold shadow-[0_3px_0_#3D3226] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#C2571B]" />
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
            className={`rounded-2xl bg-[#DCCFB0] border-2 p-5 shadow-[0_6px_0_#3D3226] transition-all lg:sticky lg:top-6 flex flex-col justify-between min-h-[420px] ${
              isOverSidebar
                ? 'border-[#C2571B] bg-[#ECE5D6] ring-2 ring-[#C2571B]/50 -translate-y-1'
                : 'border-[#3D3226]/30'
            }`}
          >
            <div>
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#3D3226]/15">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-[#2E5940]" />
                  <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#2B2420]">
                    Concept Pool
                  </h3>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-[#ECE5D6] border border-[#3D3226]/25 text-[#C2571B] font-bold shadow-sm">
                  {availableObjects.length} Available
                </span>
              </div>

              {/* Study Tip / Instructions */}
              <div className="mb-4 p-3 rounded-xl bg-[#ECE5D6] border-2 border-[#3D3226]/15 text-xs text-[#2B2420]/80 flex items-start gap-2 shadow-[0_2px_0_#3D3226]">
                <Sparkles className="w-4 h-4 text-[#C2571B] shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">
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
                        className={`p-3 rounded-xl border-2 transition-all select-none ${
                          isSubmitted
                            ? 'bg-[#ECE5D6]/50 border-[#3D3226]/15 text-[#2B2420]/40 cursor-not-allowed opacity-60'
                            : isBeingDragged
                            ? 'opacity-40 scale-95 border-[#C2571B] bg-[#ECE5D6]'
                            : 'bg-[#ECE5D6] border-[#3D3226]/20 hover:border-[#C2571B] text-[#2B2420] cursor-grab active:cursor-grabbing shadow-[0_3px_0_#3D3226] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#3D3226]'
                        } flex items-center gap-2.5`}
                      >
                        <GripVertical className="w-4 h-4 text-[#C2571B] shrink-0" />
                        <span className="text-xs font-bold text-[#2B2420] flex-1 leading-snug">
                          {objectName}
                        </span>
                        <BrainCircuit className="w-3.5 h-3.5 text-[#2E5940] shrink-0 opacity-80" />
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 rounded-2xl border-2 border-[#2E5940]/40 bg-[#ECE5D6] text-center flex flex-col items-center justify-center shadow-[0_3px_0_#2E5940]">
                    <CheckCircle2 className="w-8 h-8 text-[#2E5940] mb-2 animate-pulse" />
                    <span className="text-xs font-serif font-bold text-[#2B2420]">
                      All Concepts Placed!
                    </span>
                    <span className="text-[11px] text-[#2E5940] font-mono mt-1 font-bold">
                      Click "Submit Exam" to check your spatial recall accuracy.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Bottom Instructions */}
            <div className="mt-6 pt-4 border-t-2 border-[#3D3226]/15">
              <div className="text-[11px] text-[#2B2420]/60 flex items-center gap-1.5 font-mono">
                <HelpCircle className="w-3.5 h-3.5 text-[#2B2420]/50 shrink-0" />
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
