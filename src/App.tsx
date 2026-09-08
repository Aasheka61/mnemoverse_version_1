/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { InputScreen } from './components/InputScreen';
import { SceneScreen } from './components/SceneScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ExamModeScreen } from './components/ExamModeScreen';
import { ARCHETYPES, DEFAULT_GENERATED_SCENE, INITIAL_USER_STATS, SAMPLE_INPUT_PRESETS } from './data';
import { GeneratedMemoryPalaceScene, PalaceArchetype, ScreenType, UserStats } from './types';
import { generateMemoryPalaceScene } from './services/gemini';
import {
  saveSceneToFirestore,
  fetchSavedScenes,
  addPointRecord,
  fetchPointsData,
  fetchQuizResults,
  updateUserProgress,
  StoredSceneDocument,
} from './services/firebase';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('input');
  const [inputText, setInputText] = useState<string>(SAMPLE_INPUT_PRESETS[0].text);
  const [selectedArchetype, setSelectedArchetype] = useState<PalaceArchetype>(ARCHETYPES[0]);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [generatedScene, setGeneratedScene] = useState<GeneratedMemoryPalaceScene>(DEFAULT_GENERATED_SCENE);
  const [savedScenes, setSavedScenes] = useState<StoredSceneDocument[]>([]);
  const [isLoadingScenes, setIsLoadingScenes] = useState<boolean>(true);
  const [quizCount, setQuizCount] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // On App Mount: Fetch real persisted data from Firestore
  useEffect(() => {
    async function loadFirestoreData() {
      setIsLoadingScenes(true);
      try {
        const scenes = await fetchSavedScenes();
        setSavedScenes(scenes);

        // If there is at least one saved scene in Firestore, load it so it doesn't disappear on refresh
        if (scenes.length > 0) {
          const latest = scenes[0];
          setGeneratedScene({
            scene: {
              scene_name: latest.scene_name,
              rooms: latest.rooms || [],
            },
          });
          if (latest.archetype) {
            const matchedArch = ARCHETYPES.find((a) => a.name === latest.archetype);
            if (matchedArch) setSelectedArchetype(matchedArch);
          }
          if (latest.notesSnippet) {
            setInputText(latest.notesSnippet);
          }
        }

        // Fetch real points, quizzes, and concepts count
        const pointsData = await fetchPointsData();
        const quizzes = await fetchQuizResults();
        setQuizCount(quizzes.length);

        const totalConcepts = scenes.reduce(
          (sum, s) => sum + (Array.isArray(s.rooms) ? s.rooms.length : 0),
          0
        );

        setUserStats((prev) => ({
          ...prev,
          points: pointsData.totalPoints > 0 ? pointsData.totalPoints : prev.points,
          conceptsMastered: totalConcepts > 0 ? totalConcepts : prev.conceptsMastered,
          palacesCount: scenes.length > 0 ? scenes.length : prev.palacesCount,
        }));
      } catch (err) {
        console.error('Error loading Firestore data on app mount:', err);
      } finally {
        setIsLoadingScenes(false);
      }
    }

    loadFirestoreData();
  }, []);

  // When clicking "Generate My Memory Palace" - direct client-side Gemini API call + Firestore sync
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

      // Save every generated scene (the full JSON structure) to Firestore 'scenes' collection
      let newDocId = '';
      try {
        newDocId = await saveSceneToFirestore(
          result,
          selectedArchetype.name,
          textToProcess.slice(0, 140)
        );
        // Also award points in the 'points' collection and update 'user_progress'
        await addPointRecord(75, `Constructed ${result.scene.scene_name}`);
        await updateUserProgress({
          lastStudied: new Date().toISOString(),
          retentionRate: 95,
        });

        // Add to local state list immediately
        const newStoredDoc: StoredSceneDocument = {
          id: newDocId,
          scene_name: result.scene.scene_name,
          rooms: result.scene.rooms,
          archetype: selectedArchetype.name,
          notesSnippet: textToProcess.slice(0, 140),
          createdAt: new Date().toISOString(),
        };
        setSavedScenes((prev) => [newStoredDoc, ...prev]);
      } catch (fsErr) {
        console.warn('[Firestore] Note: Could not save to Firestore in this call, continuing:', fsErr);
      }

      // Award study points & increment concepts mastered in UI state
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

  // Handler to load any previously saved palace from the Dashboard
  const handleSelectPalace = (scene: StoredSceneDocument) => {
    setGeneratedScene({
      scene: {
        scene_name: scene.scene_name,
        rooms: scene.rooms,
      },
    });
    if (scene.archetype) {
      const arch = ARCHETYPES.find((a) => a.name === scene.archetype);
      if (arch) setSelectedArchetype(arch);
    }
    if (scene.notesSnippet) {
      setInputText(scene.notesSnippet);
    }
    setCurrentScreen('scene');
  };

  return (
    <div className="min-h-screen bg-[#EAE2D0] text-[#2B2420] flex flex-col relative overflow-x-hidden">
      {/* Subtle Warm Blueprint Ambient Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-blueprint-grid opacity-60" />
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
            onNavigateToExam={() => setCurrentScreen('exam')}
          />
        )}

        {currentScreen === 'exam' && (
          <ExamModeScreen
            generatedScene={generatedScene}
            onNavigateToInput={() => setCurrentScreen('input')}
            onNavigateToDashboard={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardScreen
            stats={userStats}
            savedScenes={savedScenes}
            isLoadingScenes={isLoadingScenes}
            onNavigateToInput={() => setCurrentScreen('input')}
            onNavigateToScene={() => setCurrentScreen('scene')}
            onSelectPalace={handleSelectPalace}
            quizCount={quizCount}
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
