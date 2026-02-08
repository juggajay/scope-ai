"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  ProjectType,
  ProjectMode,
  PropertyDetails,
  QuestionAnswers,
} from "@/types";

// -----------------------------------------------------------------------------
// State shape
// -----------------------------------------------------------------------------

export interface PhotoMeta {
  id: string;
  file: File;
  previewUrl: string;
  status: "uploading" | "complete" | "failed";
  progress: number;
  storageId?: string;   // Convex storage ID (set after upload)
  convexId?: string;    // Convex document _id (set after savePhoto)
}

export interface WizardState {
  step: number;
  direction: number;
  sessionId: string;
  isRestoredSession: boolean;
  mode: ProjectMode | null;
  projectType: ProjectType | null;
  propertyDetails: Partial<PropertyDetails>;
  description: string;
  photos: PhotoMeta[];
  answers: QuestionAnswers;
  projectId: string | null;
  savedAt: number | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  // Footer control
  footerHidden: boolean;
  footerLabel: string;
  footerDisabled: boolean;
  // Generation
  generationComplete: boolean;
}

// Serialisable subset for localStorage
interface PersistedState {
  step: number;
  sessionId: string;
  mode: ProjectMode | null;
  projectType: ProjectType | null;
  propertyDetails: Partial<PropertyDetails>;
  description: string;
  answers: QuestionAnswers;
  savedAt: number;
  currentQuestionIndex: number;
}

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

type WizardAction =
  | { type: "SET_STEP"; step: number; direction: number }
  | { type: "SET_MODE"; mode: ProjectMode }
  | { type: "SET_PROJECT_TYPE"; projectType: ProjectType }
  | { type: "SET_PROPERTY_DETAILS"; details: Partial<PropertyDetails> }
  | { type: "SET_DESCRIPTION"; description: string }
  | { type: "ADD_PHOTOS"; photos: PhotoMeta[] }
  | { type: "REMOVE_PHOTO"; id: string }
  | { type: "UPDATE_PHOTO"; id: string; updates: Partial<PhotoMeta> }
  | { type: "SET_ANSWER"; questionId: string; answer: string | string[] }
  | { type: "SET_QUESTION_INDEX"; index: number; total: number }
  | { type: "SET_PROJECT_ID"; projectId: string }
  | { type: "SET_FOOTER"; hidden?: boolean; label?: string; disabled?: boolean }
  | { type: "SET_GENERATION_COMPLETE"; complete: boolean }
  | { type: "RESTORE_SESSION"; state: PersistedState }
  | { type: "RESET" };

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

function generateSessionId(): string {
  return `scope_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const initialState: WizardState = {
  step: 0,
  direction: 1,
  sessionId: generateSessionId(),
  isRestoredSession: false,
  mode: null,
  projectType: null,
  propertyDetails: {},
  description: "",
  photos: [],
  answers: {},
  projectId: null,
  savedAt: null,
  currentQuestionIndex: 0,
  totalQuestions: 0,
  footerHidden: true,
  footerLabel: "Continue",
  footerDisabled: true,
  generationComplete: false,
};

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step, direction: action.direction };
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "SET_PROJECT_TYPE":
      return { ...state, projectType: action.projectType };
    case "SET_PROPERTY_DETAILS":
      return {
        ...state,
        propertyDetails: { ...state.propertyDetails, ...action.details },
      };
    case "SET_DESCRIPTION":
      return { ...state, description: action.description };
    case "ADD_PHOTOS":
      return { ...state, photos: [...state.photos, ...action.photos] };
    case "REMOVE_PHOTO": {
      const photo = state.photos.find((p) => p.id === action.id);
      if (photo) URL.revokeObjectURL(photo.previewUrl);
      return { ...state, photos: state.photos.filter((p) => p.id !== action.id) };
    }
    case "UPDATE_PHOTO":
      return {
        ...state,
        photos: state.photos.map((p) =>
          p.id === action.id ? { ...p, ...action.updates } : p
        ),
      };
    case "SET_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.answer },
      };
    case "SET_QUESTION_INDEX":
      return {
        ...state,
        currentQuestionIndex: action.index,
        totalQuestions: action.total,
      };
    case "SET_PROJECT_ID":
      return { ...state, projectId: action.projectId };
    case "SET_FOOTER":
      return {
        ...state,
        footerHidden: action.hidden ?? state.footerHidden,
        footerLabel: action.label ?? state.footerLabel,
        footerDisabled: action.disabled ?? state.footerDisabled,
      };
    case "SET_GENERATION_COMPLETE":
      return { ...state, generationComplete: action.complete };
    case "RESTORE_SESSION":
      return {
        ...state,
        ...action.state,
        isRestoredSession: true,
        direction: 1,
      };
    case "RESET":
      return { ...initialState, sessionId: generateSessionId() };
    default:
      return state;
  }
}

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

interface WizardContextValue {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
  goNext: () => void;
  goBack: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

const STORAGE_KEY = "scopeai_wizard";
const STALE_THRESHOLD_MS = 48 * 60 * 60 * 1000; // 48 hours

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: PersistedState = JSON.parse(saved);
        if (parsed.sessionId && parsed.step > 0) {
          dispatch({ type: "RESTORE_SESSION", state: parsed });
        }
      }
    } catch {
      // Corrupted data — ignore
    }
  }, []);

  // Save to localStorage on step change
  useEffect(() => {
    if (state.step > 0 && !state.projectId) {
      const persisted: PersistedState = {
        step: state.step,
        sessionId: state.sessionId,
        mode: state.mode,
        projectType: state.projectType,
        propertyDetails: state.propertyDetails,
        description: state.description,
        answers: state.answers,
        savedAt: Date.now(),
        currentQuestionIndex: state.currentQuestionIndex,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    }
  }, [
    state.step,
    state.mode,
    state.projectType,
    state.propertyDetails,
    state.description,
    state.answers,
    state.currentQuestionIndex,
    state.sessionId,
    state.projectId,
  ]);

  const goToStep = useCallback(
    (step: number) => {
      const direction = step > state.step ? 1 : -1;
      dispatch({ type: "SET_STEP", step, direction });
    },
    [state.step]
  );

  const goNext = useCallback(() => {
    goToStep(state.step + 1);
  }, [goToStep, state.step]);

  const goBack = useCallback(() => {
    if (state.step > 0) goToStep(state.step - 1);
  }, [goToStep, state.step]);

  return (
    <WizardContext.Provider value={{ state, dispatch, goToStep, goNext, goBack }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}

export function isSessionStale(savedAt: number | null): boolean {
  if (!savedAt) return false;
  return Date.now() - savedAt > STALE_THRESHOLD_MS;
}

export function clearWizardStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
