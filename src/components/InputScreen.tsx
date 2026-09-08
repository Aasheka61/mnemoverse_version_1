import React, { useState } from 'react';
import { Sparkles, BookOpen, Wand2, Compass, Layers, Eraser, Loader2, AlertCircle, RefreshCw, BrainCircuit } from 'lucide-react';
import { ARCHETYPES, SAMPLE_INPUT_PRESETS } from '../data';
import { PalaceArchetype } from '../types';

interface InputScreenProps {
  inputText: string;
  setInputText: (text: string) => void;
  selectedArchetype: PalaceArchetype;
  setSelectedArchetype: (archetype: PalaceArchetype) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  errorMessage?: string | null;
  onClearError?: () => void;
}

export const InputScreen: React.FC<InputScreenProps> = ({
  inputText,
  setInputText,
  selectedArchetype,
  setSelectedArchetype,
  onGenerate,
  isGenerating = false,
  errorMessage = null,
  onClearError,
}) => {
  const [copiedPresetTitle, setCopiedPresetTitle] = useState<string | null>(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleApplyPreset = (preset: { title: string; text: string }) => {
    setInputText(preset.text);
    setCopiedPresetTitle(preset.title);
    setTimeout(() => setCopiedPresetTitle(null), 2000);
  };

  const handleClear = () => {
    setInputText('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Intro Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECE5D6] border border-[#3D3226]/20 text-[#C2571B] text-xs font-mono font-semibold mb-4 shadow-sm">
          <Wand2 className="w-3.5 h-3.5 text-[#2E5940]" />
          <span>Spatial Mnemonic Synthesis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight text-[#2B2420] mb-2">
          Construct Your Memory Palace
        </h1>
        {/* Horizontal divider under screen heading */}
        <div className="w-20 h-0.5 bg-[#3D3226]/20 mx-auto my-3" />
        <p className="text-[#2B2420]/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Transform raw study notes, formulas, or historical timelines into vivid spatial anchors
          anchored inside an unforgettable mental chamber.
        </p>
      </div>

      {/* Preset Topics Quick Fill */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-[#2B2420]/80 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#2E5940]" />
            Quick Study Topic Presets:
          </span>
          {copiedPresetTitle && (
            <span className="text-xs text-[#C2571B] font-mono font-bold">
              Loaded: {copiedPresetTitle}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {SAMPLE_INPUT_PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              id={`preset-btn-${preset.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-[#DCCFB0] hover:bg-[#ECE5D6] border border-[#3D3226]/25 hover:border-[#C2571B] text-[#2B2420] font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_2px_0_#3D3226] hover:shadow-[0_3px_0_#3D3226] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#3D3226]"
            >
              <span className="w-2 h-2 rounded-full bg-[#C2571B]"></span>
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Card - Game Tile with chunky shadow */}
      <div className="relative rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/30 shadow-[0_6px_0_#3D3226] p-5 sm:p-7 mb-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#C2571B] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-[#ECE5D6] border border-[#3D3226]/20">
              [SOURCE_NOTES]
            </span>
            <label
              htmlFor="palace-source-notes"
              className="text-sm font-serif font-bold text-[#2B2420] flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-[#2E5940]" />
              Source Study Materials & Concepts
            </label>
          </div>
          {inputText && (
            <button
              onClick={handleClear}
              type="button"
              className="text-xs text-[#2B2420]/70 hover:text-[#C2571B] flex items-center gap-1 transition-colors cursor-pointer font-medium"
            >
              <Eraser className="w-3.5 h-3.5" />
              Clear text
            </button>
          )}
        </div>

        {/* Large Text Area */}
        <div className="relative rounded-xl overflow-hidden group focus-within:ring-2 focus-within:ring-[#C2571B]/40 transition-all duration-300 shadow-[0_2px_0_#3D3226]/10">
          <textarea
            id="palace-source-notes"
            rows={9}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your study notes, lecture transcripts, complex definitions, or historical steps here...&#10;&#10;Example:&#10;1. Key axioms or foundational rules&#10;2. Step-by-step chemical or mathematical cycle&#10;3. Critical dates, names, and consequences"
            className="w-full bg-[#ECE5D6] text-[#2B2420] placeholder-[#2B2420]/45 rounded-xl p-4 sm:p-5 border-2 border-[#3D3226]/25 focus:border-[#C2571B] focus:outline-none resize-y text-sm sm:text-base leading-relaxed font-mono selection:bg-[#C2571B]/20"
          />
        </div>

        {/* Word count & instructions footer */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-[#2B2420]/70 gap-2">
          <span>Tip: Break concepts into numbered bullets or paragraphs for distinct loci.</span>
          <div className="flex items-center gap-3 font-mono text-[#2B2420]/80 font-medium">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>
        </div>

        {/* Architectural Archetype Selection */}
        <div className="mt-6 pt-6 border-t-2 border-[#3D3226]/15">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#2B2420] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#2E5940]" />
              Select Mental Architecture Style
            </span>
            <span className="text-xs font-mono text-[#C2571B] font-bold">
              Vibe: {selectedArchetype.vibe}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ARCHETYPES.map((arch) => {
              const isSelected = selectedArchetype.id === arch.id;
              return (
                <button
                  key={arch.id}
                  id={`arch-picker-${arch.id}`}
                  type="button"
                  onClick={() => setSelectedArchetype(arch)}
                  className={`text-left p-3.5 rounded-xl border-2 transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#ECE5D6] border-[#C2571B] shadow-[0_4px_0_#C2571B] translate-y-[-2px]'
                      : 'bg-[#ECE5D6]/80 border-[#3D3226]/20 hover:border-[#3D3226]/40 hover:bg-[#ECE5D6] shadow-[0_2px_0_#3D3226] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#3D3226]'
                  }`}
                >
                  <div className="font-serif font-bold text-xs text-[#2B2420] flex items-center justify-between mb-1">
                    <span>{arch.name}</span>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C2571B]"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#2B2420]/75 line-clamp-2 leading-relaxed">
                    {arch.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error message banner if Gemini call fails */}
        {errorMessage && (
          <div className="mt-6 p-4 rounded-xl bg-[#ECE5D6] border-2 border-[#C2571B] text-[#2B2420] flex items-start justify-between gap-3 shadow-[0_3px_0_#C2571B] animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#C2571B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-[#C2571B] block mb-1 font-mono">
                  Gemini Palace Synthesis Notice
                </span>
                <p className="text-xs text-[#2B2420]/90 leading-relaxed">
                  {errorMessage}
                </p>
                <div className="mt-2 text-[11px] text-[#2B2420]/70 font-mono">
                  Ensure the <code className="px-1.5 py-0.5 rounded bg-[#DCCFB0] border border-[#3D3226]/20 text-[#C2571B]">VITE_GEMINI_API_KEY</code> environment variable is set.
                </div>
              </div>
            </div>
            {onClearError && (
              <button
                type="button"
                onClick={onClearError}
                className="text-xs text-[#C2571B] hover:text-[#2B2420] p-1 rounded transition-colors cursor-pointer font-bold"
                title="Dismiss message"
              >
                Dismiss
              </button>
            )}
          </div>
        )}

        {/* Primary Action Button - Chunky 3D Game Button */}
        <div className="mt-8 pt-5 border-t-2 border-[#3D3226]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#2B2420]/70 text-center sm:text-left">
            Direct client-side Gemini synthesis: groups 2–3 related concepts into one shared scene with rooms.
          </p>
          <button
            type="button"
            id="generate-palace-btn"
            disabled={isGenerating}
            onClick={onGenerate}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              isGenerating
                ? 'bg-[#C2571B]/70 opacity-80 cursor-wait shadow-none border-2 border-[#8B350C]/50'
                : 'game-btn-primary'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 text-white animate-spin" />
                <span>Synthesizing Memory Palace with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-white" />
                <span>Generate My Memory Palace</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Numbered Feature Game Tiles with Bold Circular Badges and Header Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3 text-center">
        {/* Card 1: Spatial Anchoring */}
        <div className="rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/25 shadow-[0_5px_0_#3D3226] hover:shadow-[0_8px_0_#3D3226] hover:-translate-y-1 transition-all p-5 flex flex-col items-center">
          {/* Bold circular badge prominently placed at top */}
          <div className="w-11 h-11 rounded-full bg-[#C2571B] border-2 border-[#8B350C] shadow-[0_3px_0_#8B350C] text-white font-serif font-black text-lg flex items-center justify-center -mt-9 mb-3 ring-4 ring-[#EAE2D0]">
            1
          </div>
          <div className="flex items-center gap-1.5 text-sm font-serif font-bold text-[#2B2420] mb-1.5">
            <Compass className="w-4 h-4 text-[#2E5940]" />
            <span>Spatial Anchoring</span>
          </div>
          <p className="text-xs text-[#2B2420]/80 leading-relaxed">
            Convert factual items into sensory landmarks along a known mental route.
          </p>
        </div>

        {/* Card 2: Vivid Visualization */}
        <div className="rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/25 shadow-[0_5px_0_#3D3226] hover:shadow-[0_8px_0_#3D3226] hover:-translate-y-1 transition-all p-5 flex flex-col items-center">
          {/* Bold circular badge prominently placed at top */}
          <div className="w-11 h-11 rounded-full bg-[#C2571B] border-2 border-[#8B350C] shadow-[0_3px_0_#8B350C] text-white font-serif font-black text-lg flex items-center justify-center -mt-9 mb-3 ring-4 ring-[#EAE2D0]">
            2
          </div>
          <div className="flex items-center gap-1.5 text-sm font-serif font-bold text-[#2B2420] mb-1.5">
            <Sparkles className="w-4 h-4 text-[#D4A017]" />
            <span>Vivid Visualization</span>
          </div>
          <p className="text-xs text-[#2B2420]/80 leading-relaxed">
            Unusual, dynamic imagery maximizes long-term hippocampal encoding.
          </p>
        </div>

        {/* Card 3: Effortless Recall */}
        <div className="rounded-2xl bg-[#DCCFB0] border-2 border-[#3D3226]/25 shadow-[0_5px_0_#3D3226] hover:shadow-[0_8px_0_#3D3226] hover:-translate-y-1 transition-all p-5 flex flex-col items-center">
          {/* Bold circular badge prominently placed at top */}
          <div className="w-11 h-11 rounded-full bg-[#C2571B] border-2 border-[#8B350C] shadow-[0_3px_0_#8B350C] text-white font-serif font-black text-lg flex items-center justify-center -mt-9 mb-3 ring-4 ring-[#EAE2D0]">
            3
          </div>
          <div className="flex items-center gap-1.5 text-sm font-serif font-bold text-[#2B2420] mb-1.5">
            <BrainCircuit className="w-4 h-4 text-[#2E5940]" />
            <span>Effortless Recall</span>
          </div>
          <p className="text-xs text-[#2B2420]/80 leading-relaxed">
            Revisit your mental chambers during exams or lectures at will.
          </p>
        </div>
      </div>
    </div>
  );
};
