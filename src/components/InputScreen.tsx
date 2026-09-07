import React, { useState } from 'react';
import { Sparkles, BookOpen, Wand2, Compass, Layers, Eraser, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4 shadow-[0_0_15px_rgba(147,51,234,0.15)]">
          <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
          <span>Spatial Mnemonic Synthesis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
          Construct Your{' '}
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Memory Palace
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Transform raw study notes, formulas, or historical timelines into vivid spatial anchors
          anchored inside an unforgettable mental chamber.
        </p>
      </div>

      {/* Preset Topics Quick Fill */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            Quick Study Topic Presets:
          </span>
          {copiedPresetTitle && (
            <span className="text-xs text-cyan-300 animate-fade-in font-medium">
              Loaded: {copiedPresetTitle}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_INPUT_PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              id={`preset-btn-${preset.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#0e1428] hover:bg-[#141b38] border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-cyan-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Card */}
      <div className="relative rounded-2xl bg-[#0a0e1e]/90 border border-purple-500/20 shadow-[0_0_40px_-10px_rgba(112,26,117,0.2)] p-5 sm:p-7 backdrop-blur-xl mb-8">
        <div className="flex items-center justify-between mb-3">
          <label
            htmlFor="palace-source-notes"
            className="text-sm font-semibold text-slate-200 flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            Source Study Materials & Concepts
          </label>
          {inputText && (
            <button
              onClick={handleClear}
              type="button"
              className="text-xs text-slate-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <Eraser className="w-3.5 h-3.5" />
              Clear text
            </button>
          )}
        </div>

        {/* Large Text Area */}
        <div className="relative rounded-xl overflow-hidden group focus-within:ring-2 focus-within:ring-cyan-400/40 transition-all duration-300">
          <textarea
            id="palace-source-notes"
            rows={9}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your study notes, lecture transcripts, complex definitions, or historical steps here...&#10;&#10;Example:&#10;1. Key axioms or foundational rules&#10;2. Step-by-step chemical or mathematical cycle&#10;3. Critical dates, names, and consequences"
            className="w-full bg-[#060814]/90 text-slate-100 placeholder:text-slate-600 rounded-xl p-4 sm:p-5 border border-slate-800/80 focus:border-purple-500/70 focus:outline-none resize-y text-sm sm:text-base leading-relaxed font-mono selection:bg-purple-600/40"
          />
        </div>

        {/* Word count & instructions footer */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <span>Tip: Break concepts into numbered bullets or paragraphs for distinct loci.</span>
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>
        </div>

        {/* Architectural Archetype Selection */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Select Mental Architecture Style
            </span>
            <span className="text-xs text-purple-300/80 font-medium">
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
                  className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950/40 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/50'
                      : 'bg-[#0b1024]/60 border-slate-800/90 hover:border-purple-500/30 hover:bg-[#0f1530]'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-200 flex items-center justify-between mb-1">
                    <span>{arch.name}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {arch.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error message banner if Gemini call fails */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-start justify-between gap-3 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-xs text-rose-300 block mb-1">
                  Gemini Palace Synthesis Notice
                </span>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {errorMessage}
                </p>
                <div className="mt-2 text-[11px] text-rose-300/80">
                  Ensure the <code className="px-1.5 py-0.5 rounded bg-black/40 text-rose-200 font-mono">VITE_GEMINI_API_KEY</code> environment variable is set.
                </div>
              </div>
            </div>
            {onClearError && (
              <button
                type="button"
                onClick={onClearError}
                className="text-xs text-rose-400 hover:text-rose-200 p-1 rounded hover:bg-rose-900/40 transition-colors"
                title="Dismiss message"
              >
                Dismiss
              </button>
            )}
          </div>
        )}

        {/* Primary Action Button */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            Direct client-side Gemini synthesis: groups 2–3 related concepts into one shared scene with rooms.
          </p>
          <button
            type="button"
            id="generate-palace-btn"
            disabled={isGenerating}
            onClick={onGenerate}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer border border-white/20 ${
              isGenerating
                ? 'bg-purple-900/60 opacity-80 cursor-wait shadow-none'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 text-cyan-200 animate-spin" />
                <span>Synthesizing Memory Palace with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-200 animate-pulse" />
                <span>Generate My Memory Palace</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Aesthetic feature bullets footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-[#090d1c]/60 border border-slate-800/60">
          <div className="text-xs font-semibold text-purple-300 mb-1">1. Spatial Anchoring</div>
          <div className="text-[11px] text-slate-400">
            Convert factual items into sensory landmarks along a known mental route.
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#090d1c]/60 border border-slate-800/60">
          <div className="text-xs font-semibold text-cyan-300 mb-1">2. Vivid Visualization</div>
          <div className="text-[11px] text-slate-400">
            Unusual, dynamic imagery maximizes long-term hippocampal encoding.
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#090d1c]/60 border border-slate-800/60">
          <div className="text-xs font-semibold text-indigo-300 mb-1">3. Effortless Recall</div>
          <div className="text-[11px] text-slate-400">
            Revisit your mental chambers during exams or lectures at will.
          </div>
        </div>
      </div>
    </div>
  );
};
