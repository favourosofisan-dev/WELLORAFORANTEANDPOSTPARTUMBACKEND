import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserStage = 'pregnant' | 'postpartum' | 'caregiver' | 'labour' | null;
export type Trimester = 'First' | 'Second' | 'Third' | null;

export interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
  stage: UserStage;
  trimester: Trimester;
  weeksPostpartum: number | null;
  dueOrBirthDate: string | null;
  goals: string[];
  disclaimerAccepted: boolean;
  streak: number;
  points: number;
  completedExercises: string[]; // List of exercise IDs completed
  savedExercises: string[]; // List of saved exercise IDs
  lastActiveDate: string | null; // For streak calculation
  isPro: boolean;
  acknowledgedAiDisclaimer: boolean;
  antenatalData?: {
    appointmentDate: string;
    attendedDays: string;
    bloodPressure: string;
    weight: string;
    vitaminIntake: string;
  };
}

interface UserProfileContextType {
  profile: UserProfile;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateStage: (stage: UserStage, details: { trimester?: Trimester; weeksPostpartum?: number | null; dueOrBirthDate?: string | null }) => void;
  toggleGoal: (goal: string) => void;
  acceptDisclaimer: () => void;
  completeExercise: (exerciseId: string, durationSeconds: number) => void;
  toggleSaveExercise: (exerciseId: string) => void;
  resetProgress: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  upgradeToPro: () => void;
  acknowledgeAiDisclaimer: () => void;
}

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  isLoggedIn: false,
  stage: null,
  trimester: null,
  weeksPostpartum: null,
  dueOrBirthDate: null,
  goals: [],
  disclaimerAccepted: false,
  streak: 0,
  points: 0,
  completedExercises: [],
  savedExercises: [],
  lastActiveDate: null,
  isPro: false,
  acknowledgedAiDisclaimer: false,
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('wellora_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse profile', e);
      }
    }
    return defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('wellora_profile', JSON.stringify(profile));
  }, [profile]);

  const login = (name: string, email: string) => {
    setProfile((prev) => ({
      ...prev,
      name,
      email,
      isLoggedIn: true,
      // Default to initial streak of 1 if logging back in
      streak: prev.streak || 1,
      lastActiveDate: new Date().toDateString(),
    }));
  };

  const logout = () => {
    setProfile(defaultProfile);
    localStorage.removeItem('wellora_profile');
    localStorage.removeItem('wellora_babies');
  };

  const updateStage = (
    stage: UserStage,
    details: { trimester?: Trimester; weeksPostpartum?: number | null; dueOrBirthDate?: string | null }
  ) => {
    setProfile((prev) => ({
      ...prev,
      stage,
      trimester: details.trimester !== undefined ? details.trimester : prev.trimester,
      weeksPostpartum: details.weeksPostpartum !== undefined ? details.weeksPostpartum : prev.weeksPostpartum,
      dueOrBirthDate: details.dueOrBirthDate !== undefined ? details.dueOrBirthDate : prev.dueOrBirthDate,
    }));
  };

  const toggleGoal = (goal: string) => {
    setProfile((prev) => {
      const goals = prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal];
      return { ...prev, goals };
    });
  };

  const acceptDisclaimer = () => {
    setProfile((prev) => ({ ...prev, disclaimerAccepted: true }));
  };

  const completeExercise = (exerciseId: string, _durationSeconds: number) => {
    setProfile((prev) => {
      const isAlreadyCompleted = prev.completedExercises.includes(exerciseId);
      const newCompleted = isAlreadyCompleted 
        ? prev.completedExercises 
        : [...prev.completedExercises, exerciseId];
      
      // Calculate streak
      const today = new Date().toDateString();
      let newStreak = prev.streak;
      
      if (prev.lastActiveDate !== today) {
        if (prev.lastActiveDate === new Date(Date.now() - 86400000).toDateString()) {
          // Active yesterday, increment streak
          newStreak += 1;
        } else if (prev.streak === 0) {
          newStreak = 1;
        } else {
          // Broke streak, reset to 1
          newStreak = 1;
        }
      }

      // 10 points per completion
      const addedPoints = 10;

      return {
        ...prev,
        completedExercises: newCompleted,
        points: prev.points + addedPoints,
        streak: newStreak,
        lastActiveDate: today,
      };
    });
  };

  const toggleSaveExercise = (exerciseId: string) => {
    setProfile((prev) => {
      const saved = prev.savedExercises.includes(exerciseId)
        ? prev.savedExercises.filter((id) => id !== exerciseId)
        : [...prev.savedExercises, exerciseId];
      return { ...prev, savedExercises: saved };
    });
  };

  const resetProgress = () => {
    setProfile((prev) => ({
      ...prev,
      streak: 0,
      points: 0,
      completedExercises: [],
      savedExercises: [],
      lastActiveDate: null,
    }));
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const upgradeToPro = () => {
    setProfile((prev) => ({ ...prev, isPro: true }));
  };

  const acknowledgeAiDisclaimer = () => {
    setProfile((prev) => ({ ...prev, acknowledgedAiDisclaimer: true }));
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        login,
        logout,
        updateStage,
        toggleGoal,
        acceptDisclaimer,
        completeExercise,
        toggleSaveExercise,
        resetProgress,
        updateProfile,
        upgradeToPro,
        acknowledgeAiDisclaimer,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
