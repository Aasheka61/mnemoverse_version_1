/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { InputScreen } from './components/InputScreen';
import { SceneScreen } from './components/SceneScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ARCHETYPES, DEFAULT_GENERATED_SCENE, INITIAL_USER_STATS, SAMPLE_INPUT_PRESETS } from './data';
import { GeneratedMemoryPalaceScene, PalaceArchetype, ScreenType, UserStats } from './types';
import { generateMemoryPalaceScene } from './services/gemini';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('input');
  const [inputText, setInputText] = useState<string>(SAMPLE_INPUT_PRESETS[0].text);
  const [selectedArchetype, setSelectedArchetype] = useState<PalaceArchetype>(ARCHETYPES[0]);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [generatedScene, setGeneratedScene] = useState<GeneratedMemoryPalaceScene>(DEFAULT_GENERATED_SCENE);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // When clicking "Generate My Memory Palace" - direct client-side Gemini API call
  const handleGenerate = async () => {
    const textToProcess = inputText.trim() || SAMPLE_INPUT_PRESETS[0].text;
    if (!inputText.trim()) {
      setInputText(textToProcess);
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const result = await generateMemoryPalaceScene(textToProcess, selectedArchetype.name);
      console.log('[App.tsx] Result received from generateMemoryPalaceScene:', result);
      console.log('[App.tsx] Total rooms in scene:', result.scene?.rooms?.length, result.scene?.rooms);
      setGeneratedScene(result);

      // Award study points & increment concepts mastered
      const roomCount = result.scene?.rooms?.length || 1;
      setUserStats((prev) => ({
        ...prev,
        points: prev.points + 75,
        conceptsMastered: prev.conceptsMastered + roomCount,
        palacesCount: prev.palacesCount + 1,
      }));

      // Transition smoothly to the Room/Scene View
      setCurrentScreen('scene');
    } catch (err: any) {
      console.error('Gemini Palace Generation failed:', err);
      setErrorMessage(
        err?.message || 'Failed to generate memory palace scene. Please check your VITE_GEMINI_API_KEY environment variable.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Dreamy Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep Violet / Purple Ambient Bloom */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-700/12 rounded-full blur-[130px] animate-ambient-glow" />
        
        {/* Ethereal Cyan Ambient Bloom */}
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[130px] animate-ambient-glow" style={{ animationDelay: '4s' }} />

        {/* Deep Navy/Indigo Center Bloom */}
        <div className="absolute -bottom-20 left-1/3 w-[700px] h-[700px] bg-indigo-900/10 rounded-full blur-[150px]" />

        {/* Subtle grid texture overlay */}
        <div className="absolute inset-0 bg-dream-grid opacity-30" />
      </div>

      {/* Top Persistent Navigation */}
      <Navigation
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        streakDays={userStats.streakDays}
        points={userStats.points}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col">
        {currentScreen === 'input' && (
          <InputScreen
            inputText={inputText}
            setInputText={setInputText}
            selectedArchetype={selectedArchetype}
            setSelectedArchetype={setSelectedArchetype}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            errorMessage={errorMessage}
            onClearError={() => setErrorMessage(null)}
          />
        )}

        {currentScreen === 'scene' && (
          <SceneScreen
            archetype={selectedArchetype}
            generatedScene={generatedScene}
            notesSnippet={inputText.slice(0, 140)}
            onNavigateToInput={() => setCurrentScreen('input')}
            onNavigateToDashboard={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardScreen
            stats={userStats}
            onNavigateToInput={() => setCurrentScreen('input')}
            onNavigateToScene={() => setCurrentScreen('scene')}
          />
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="relative z-10 py-6 border-t border-purple-500/10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="font-semibold text-slate-400">MnemoVerse</span>
            <span>— Spatial Memory Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Studying Mode Active</span>
            <span>•</span>
            <span>Version 1.0 (Preview)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
