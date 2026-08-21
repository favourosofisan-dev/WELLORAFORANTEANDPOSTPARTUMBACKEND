import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

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
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, onboardingDetails?: any) => Promise<void>;
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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('wellora_token'));
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

  useEffect(() => {
    if (token) {
      localStorage.setItem('wellora_token', token);
    } else {
      localStorage.removeItem('wellora_token');
    }
  }, [token]);

  // Bootstrapping: fetch profile on mount if token exists
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const { firstName, lastName, email, isPro, pregnancyProfile } = data.user;
          setProfile((prev) => ({
            ...prev,
            name: `${firstName} ${lastName}`.trim(),
            email,
            isLoggedIn: true,
            isPro: isPro || false,
            stage: pregnancyProfile?.status ? (pregnancyProfile.status.toLowerCase() as UserStage) : prev.stage,
            weeksPostpartum: pregnancyProfile?.weeksPostpartum !== undefined ? pregnancyProfile.weeksPostpartum : prev.weeksPostpartum,
            dueOrBirthDate: pregnancyProfile?.dueDate ? pregnancyProfile.dueDate.split('T')[0] : prev.dueOrBirthDate,
            goals: pregnancyProfile?.goals || prev.goals,
          }));
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (e) {
        console.error('Failed to bootstrap session from token:', e);
      }
    };

    fetchProfile();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to log in.');
    }

    const data = await response.json();
    setToken(data.token);
    
    const { firstName, lastName, isPro, pregnancyProfile } = data.user;
    setProfile((prev) => ({
      ...prev,
      name: `${firstName} ${lastName}`.trim(),
      email: data.user.email,
      isLoggedIn: true,
      isPro: isPro || false,
      stage: pregnancyProfile?.status ? (pregnancyProfile.status.toLowerCase() as UserStage) : null,
      weeksPostpartum: pregnancyProfile?.weeksPostpartum || null,
      dueOrBirthDate: pregnancyProfile?.dueDate ? pregnancyProfile.dueDate.split('T')[0] : null,
      goals: pregnancyProfile?.goals || [],
      // Default to initial streak of 1 if logging back in
      streak: prev.streak || 1,
      lastActiveDate: new Date().toDateString(),
    }));
  };

  const signUp = async (name: string, email: string, password: string, onboardingDetails?: any) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        ...onboardingDetails,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to sign up.');
    }

    const data = await response.json();
    setToken(data.token);

    const { firstName, lastName, isPro, pregnancyProfile } = data.user;
    setProfile((prev) => ({
      ...prev,
      name: `${firstName} ${lastName}`.trim(),
      email: data.user.email,
      isLoggedIn: true,
      isPro: isPro || false,
      stage: pregnancyProfile?.status ? (pregnancyProfile.status.toLowerCase() as UserStage) : null,
      weeksPostpartum: pregnancyProfile?.weeksPostpartum || null,
      dueOrBirthDate: pregnancyProfile?.dueDate ? pregnancyProfile.dueDate.split('T')[0] : null,
      goals: pregnancyProfile?.goals || [],
      streak: 1,
      lastActiveDate: new Date().toDateString(),
    }));
  };

  const logout = () => {
    setToken(null);
    setProfile(defaultProfile);
    localStorage.removeItem('wellora_profile');
    localStorage.removeItem('wellora_babies');
    localStorage.removeItem('wellora_token');
  };

  const updateStage = (
    stage: UserStage,
    details: { trimester?: Trimester; weeksPostpartum?: number | null; dueOrBirthDate?: string | null }
  ) => {
    setProfile((prev) => {
      const trimester = details.trimester !== undefined ? details.trimester : prev.trimester;
      const weeksPostpartum = details.weeksPostpartum !== undefined ? details.weeksPostpartum : prev.weeksPostpartum;
      const dueOrBirthDate = details.dueOrBirthDate !== undefined ? details.dueOrBirthDate : prev.dueOrBirthDate;

      setTimeout(() => {
        if (token) {
          fetch(`${API_BASE_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ stage, trimester, weeksPostpartum, dueOrBirthDate })
          }).catch(err => console.error('Failed to sync stage:', err));
        }
      }, 0);

      return {
        ...prev,
        stage,
        trimester,
        weeksPostpartum,
        dueOrBirthDate,
      };
    });
  };

  const toggleGoal = (goal: string) => {
    setProfile((prev) => {
      const goals = prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal];

      setTimeout(() => {
        if (token) {
          fetch(`${API_BASE_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ goals })
          }).catch(err => console.error('Failed to sync goals:', err));
        }
      }, 0);

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
    setProfile((prev) => {
      const nextProfile = {
        ...prev,
        ...updated,
      };

      setTimeout(() => {
        if (token) {
          const payload: any = {};
          if (updated.name !== undefined) payload.name = updated.name;
          if (updated.isPro !== undefined) payload.isPro = updated.isPro;
          if (updated.stage !== undefined) payload.stage = updated.stage;
          if (updated.weeksPostpartum !== undefined) payload.weeksPostpartum = updated.weeksPostpartum;
          if (updated.dueOrBirthDate !== undefined) payload.dueOrBirthDate = updated.dueOrBirthDate;
          if (updated.goals !== undefined) payload.goals = updated.goals;

          fetch(`${API_BASE_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          }).catch(err => console.error('Failed to sync profile update:', err));
        }
      }, 0);

      return nextProfile;
    });
  };

  const upgradeToPro = () => {
    updateProfile({ isPro: true });
  };

  const acknowledgeAiDisclaimer = () => {
    setProfile((prev) => ({ ...prev, acknowledgedAiDisclaimer: true }));
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        token,
        login,
        signUp,
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
