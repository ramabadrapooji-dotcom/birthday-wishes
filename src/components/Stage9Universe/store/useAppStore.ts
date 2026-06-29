import { create } from 'zustand';
import * as THREE from 'three';

export type AppState = 'LOADING' | 'WARP' | 'EXPLORE' | 'MEMORY_FOCUS' | 'RETURN' | 'FINAL_BANG';

// Emotional carry-over: tracks what state the universe is transitioning FROM
// so subsystems (camera, particles) can blend their previous emotional momentum
export type EmotionalCarryover = AppState | null;

export type QualityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface MemoryData {
  id: string;
  date: string;
  location: string;
  story: string;
  emotion: string;
  imageUrl: string;
  position: [number, number, number];
}

interface AppStore {
  appState: AppState;
  prevAppState: EmotionalCarryover;  // what state we came from — for emotional carry-over
  setAppState: (state: AppState) => void;
  transitionState: (newState: AppState) => void;
  
  quality: QualityLevel;
  setQuality: (quality: QualityLevel) => void;
  
  selectedMemory: MemoryData | null;
  setSelectedMemory: (memory: MemoryData | null) => void;
  
  finalePhase: number;
  setFinalePhase: (phase: number) => void;
  
  viewedMemories: Set<string>;
  markMemoryViewed: (id: string) => void;

  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  appState: 'LOADING',
  prevAppState: null,
  setAppState: (state) => set((s) => ({ prevAppState: s.appState, appState: state })),
  
  transitionState: (newState) => {
    const currentState = get().appState;
    if (currentState === newState) return;
    
    // Cleanup rules
    if (newState !== 'MEMORY_FOCUS' && newState !== 'RETURN') {
      set({ selectedMemory: null });
    }
    if (newState === 'FINAL_BANG') {
      set({ finalePhase: 1 });
    }
    
    // Always record where we came from — emotional carry-over
    set({ prevAppState: currentState, appState: newState });
  },
  
  quality: 'MEDIUM',
  setQuality: (quality) => set({ quality }),
  
  selectedMemory: null,
  setSelectedMemory: (memory) => set({ selectedMemory: memory }),
  
  finalePhase: 0,
  setFinalePhase: (phase) => set({ finalePhase: phase }),
  
  viewedMemories: new Set(),
  markMemoryViewed: (id) => set((state) => {
    const newSet = new Set(state.viewedMemories);
    newSet.add(id);
    return { viewedMemories: newSet };
  }),

  audioEnabled: false,
  setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
}));
