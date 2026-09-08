import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  setDoc,
  doc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { GeneratedMemoryPalaceScene, MemoryRoom } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore (support custom database ID if configured)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Collection References
export const SCENES_COLLECTION = 'scenes';
export const QUIZ_RESULTS_COLLECTION = 'quiz_results';
export const POINTS_COLLECTION = 'points';
export const USER_PROGRESS_COLLECTION = 'user_progress';

export interface StoredSceneDocument {
  id?: string;
  scene_name: string;
  rooms: MemoryRoom[];
  archetype?: string;
  notesSnippet?: string;
  createdAt: string;
}

export interface StoredQuizResultDocument {
  id?: string;
  score: number;
  total: number;
  sceneId?: string;
  sceneName?: string;
  completedAt: string;
}

export interface StoredPointDocument {
  id?: string;
  amount: number;
  reason: string;
  earnedAt: string;
}

export interface StoredUserProgressDocument {
  id?: string;
  retentionRate: number;
  lastStudied: string;
  streakDays: number;
  updatedAt?: string;
}

/**
 * Saves a generated memory palace scene to the 'scenes' collection.
 */
export async function saveSceneToFirestore(
  sceneData: GeneratedMemoryPalaceScene,
  archetype?: string,
  notesSnippet?: string
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, SCENES_COLLECTION), {
      scene_name: sceneData.scene.scene_name,
      rooms: sceneData.scene.rooms,
      archetype: archetype || 'Classical Palace',
      notesSnippet: notesSnippet || '',
      createdAt: new Date().toISOString(),
    });
    console.log('[Firestore] Successfully saved scene to Firestore with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[Firestore] Error saving scene to Firestore:', error);
    throw error;
  }
}

/**
 * Fetches all saved scenes ordered by creation date (newest first).
 */
export async function fetchSavedScenes(): Promise<StoredSceneDocument[]> {
  try {
    const q = query(collection(db, SCENES_COLLECTION), orderBy('createdAt', 'desc'), limit(25));
    const querySnapshot = await getDocs(q);
    const scenes: StoredSceneDocument[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as StoredSceneDocument;
      scenes.push({
        ...data,
        id: docSnap.id,
      });
    });
    return scenes;
  } catch (error) {
    // If orderBy requires an index or fails, fall back to simple collection fetch
    console.warn('[Firestore] Falling back to unsorted scenes query:', error);
    try {
      const querySnapshot = await getDocs(collection(db, SCENES_COLLECTION));
      const scenes: StoredSceneDocument[] = [];
      querySnapshot.forEach((docSnap) => {
        scenes.push({
          ...(docSnap.data() as StoredSceneDocument),
          id: docSnap.id,
        });
      });
      return scenes.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } catch (innerError) {
      console.error('[Firestore] Error fetching saved scenes:', innerError);
      return [];
    }
  }
}

/**
 * Records a points entry in the 'points' collection.
 */
export async function addPointRecord(amount: number, reason: string): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, POINTS_COLLECTION), {
      amount,
      reason,
      earnedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('[Firestore] Error adding points record:', error);
    return null;
  }
}

/**
 * Fetches total earned points from the 'points' collection.
 */
export async function fetchPointsData(): Promise<{ totalPoints: number; records: StoredPointDocument[] }> {
  try {
    const querySnapshot = await getDocs(collection(db, POINTS_COLLECTION));
    let totalPoints = 0;
    const records: StoredPointDocument[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as StoredPointDocument;
      totalPoints += Number(data.amount) || 0;
      records.push({ ...data, id: docSnap.id });
    });
    return { totalPoints, records };
  } catch (error) {
    console.error('[Firestore] Error fetching points records:', error);
    return { totalPoints: 0, records: [] };
  }
}

/**
 * Fetches quiz results from the 'quiz_results' collection.
 */
export async function fetchQuizResults(): Promise<StoredQuizResultDocument[]> {
  try {
    const querySnapshot = await getDocs(collection(db, QUIZ_RESULTS_COLLECTION));
    const results: StoredQuizResultDocument[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push({
        ...(docSnap.data() as StoredQuizResultDocument),
        id: docSnap.id,
      });
    });
    return results;
  } catch (error) {
    console.error('[Firestore] Error fetching quiz results:', error);
    return [];
  }
}

/**
 * Records a quiz result in 'quiz_results'.
 */
export async function recordQuizResult(
  score: number,
  total: number,
  sceneId?: string,
  sceneName?: string
): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, QUIZ_RESULTS_COLLECTION), {
      score,
      total,
      sceneId: sceneId || '',
      sceneName: sceneName || '',
      completedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('[Firestore] Error recording quiz result:', error);
    return null;
  }
}

/**
 * Fetches user progress from 'user_progress' collection.
 */
export async function fetchUserProgress(): Promise<StoredUserProgressDocument | null> {
  try {
    const querySnapshot = await getDocs(collection(db, USER_PROGRESS_COLLECTION));
    if (!querySnapshot.empty) {
      const firstDoc = querySnapshot.docs[0];
      return {
        ...(firstDoc.data() as StoredUserProgressDocument),
        id: firstDoc.id,
      };
    }
    return null;
  } catch (error) {
    console.error('[Firestore] Error fetching user progress:', error);
    return null;
  }
}

/**
 * Updates or sets user progress in 'user_progress'.
 */
export async function updateUserProgress(progress: Partial<StoredUserProgressDocument>): Promise<void> {
  try {
    const docRef = doc(db, USER_PROGRESS_COLLECTION, 'current_user');
    await setDoc(
      docRef,
      {
        ...progress,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('[Firestore] Error updating user progress:', error);
  }
}
