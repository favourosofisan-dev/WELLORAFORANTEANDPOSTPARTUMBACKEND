import React, { createContext, useContext, useState, useEffect } from 'react';
import { VACCINES } from '../data/mockData';

export type VaccineStatus = 'Upcoming' | 'Completed' | 'Overdue';

export interface BabyVaccineRecord {
  vaccineId: string;
  vaccineName: string;
  milestone: string;
  scheduledDate: string;
  completedDate?: string;
  status: VaccineStatus;
}

export interface Baby {
  id: string;
  name: string;
  birthDate: string;
  gender?: string;
  birthWeight?: string;
  vaccineRecords: BabyVaccineRecord[];
}

interface BabyContextType {
  babies: Baby[];
  addBaby: (name: string, birthDate: string, gender?: string, birthWeight?: string) => void;
  toggleVaccineStatus: (babyId: string, vaccineId: string) => void;
  removeBaby: (babyId: string) => void;
}

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export const BabyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [babies, setBabies] = useState<Baby[]>(() => {
    const saved = localStorage.getItem('wellora_babies');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse babies', e);
      }
    }
    return [];
  });

  // Periodically refresh statuses (e.g., check if something went from upcoming to overdue)
  const refreshVaccineStatuses = (babiesList: Baby[]): Baby[] => {
    const today = new Date();
    return babiesList.map((baby) => {
      const birth = new Date(baby.birthDate);
      const updatedRecords = baby.vaccineRecords.map((record) => {
        if (record.status === 'Completed') return record;

        // Re-calculate scheduled date (in case birthdate changes or for initialization)
        const vaccine = VACCINES.find((v) => v.id === record.vaccineId);
        if (!vaccine) return record;

        const scheduled = new Date(birth);
        // Calculate offset in days: 1 week = 7 days
        let offsetDays = 0;
        if (vaccine.ageMilestone === 'Birth') offsetDays = 0;
        else if (vaccine.ageMilestone === '6 Weeks') offsetDays = 6 * 7;
        else if (vaccine.ageMilestone === '10 Weeks') offsetDays = 10 * 7;
        else if (vaccine.ageMilestone === '14 Weeks') offsetDays = 14 * 7;
        else if (vaccine.ageMilestone === '6 Months') offsetDays = 182;
        else if (vaccine.ageMilestone === '9 Months') offsetDays = 273;
        else if (vaccine.ageMilestone === '15 Months') offsetDays = 456;

        scheduled.setDate(scheduled.getDate() + offsetDays);

        let newStatus: VaccineStatus = 'Upcoming';
        if (scheduled < today) {
          newStatus = 'Overdue';
        }

        return {
          ...record,
          scheduledDate: scheduled.toLocaleDateString(undefined, { dateStyle: 'medium' }),
          status: newStatus,
        };
      });

      return {
        ...baby,
        vaccineRecords: updatedRecords,
      };
    });
  };

  useEffect(() => {
    localStorage.setItem('wellora_babies', JSON.stringify(babies));
  }, [babies]);

  const addBaby = (name: string, birthDate: string, gender?: string, birthWeight?: string) => {
    const babyId = 'baby_' + Math.random().toString(36).substring(2, 9);
    const birth = new Date(birthDate);
    const today = new Date();

    const vaccineRecords: BabyVaccineRecord[] = VACCINES.map((v) => {
      const scheduled = new Date(birth);
      let offsetDays = 0;
      if (v.ageMilestone === 'Birth') offsetDays = 0;
      else if (v.ageMilestone === '6 Weeks') offsetDays = 6 * 7;
      else if (v.ageMilestone === '10 Weeks') offsetDays = 10 * 7;
      else if (v.ageMilestone === '14 Weeks') offsetDays = 14 * 7;
      else if (v.ageMilestone === '6 Months') offsetDays = 182;
      else if (v.ageMilestone === '9 Months') offsetDays = 273;
      else if (v.ageMilestone === '15 Months') offsetDays = 456;

      scheduled.setDate(scheduled.getDate() + offsetDays);

      let status: VaccineStatus = 'Upcoming';
      if (scheduled < today) {
        status = 'Overdue';
      }

      return {
        vaccineId: v.id,
        vaccineName: v.name,
        milestone: v.ageMilestone,
        scheduledDate: scheduled.toLocaleDateString(undefined, { dateStyle: 'medium' }),
        status,
      };
    });

    const newBaby: Baby = {
      id: babyId,
      name,
      birthDate,
      gender,
      birthWeight,
      vaccineRecords,
    };

    setBabies((prev) => [...prev, newBaby]);
  };

  const toggleVaccineStatus = (babyId: string, vaccineId: string) => {
    setBabies((prev) =>
      prev.map((baby) => {
        if (baby.id !== babyId) return baby;

        const updatedRecords = baby.vaccineRecords.map((record) => {
          if (record.vaccineId !== vaccineId) return record;

          const isCompleted = record.status === 'Completed';
          let newStatus: VaccineStatus = 'Upcoming';
          let completedDate: string | undefined = undefined;

          if (!isCompleted) {
            newStatus = 'Completed';
            completedDate = new Date().toLocaleDateString(undefined, { dateStyle: 'medium' });
          } else {
            // Re-evaluate if it should be overdue or upcoming
            const vaccine = VACCINES.find((v) => v.id === vaccineId);
            const birth = new Date(baby.birthDate);
            const scheduled = new Date(birth);
            let offsetDays = 0;
            if (vaccine) {
              if (vaccine.ageMilestone === 'Birth') offsetDays = 0;
              else if (vaccine.ageMilestone === '6 Weeks') offsetDays = 6 * 7;
              else if (vaccine.ageMilestone === '10 Weeks') offsetDays = 10 * 7;
              else if (vaccine.ageMilestone === '14 Weeks') offsetDays = 14 * 7;
              else if (vaccine.ageMilestone === '6 Months') offsetDays = 182;
              else if (vaccine.ageMilestone === '9 Months') offsetDays = 273;
              else if (vaccine.ageMilestone === '15 Months') offsetDays = 456;
            }
            scheduled.setDate(scheduled.getDate() + offsetDays);

            newStatus = scheduled < new Date() ? 'Overdue' : 'Upcoming';
          }

          return {
            ...record,
            status: newStatus,
            completedDate,
          };
        });

        return { ...baby, vaccineRecords: updatedRecords };
      })
    );
  };

  const removeBaby = (babyId: string) => {
    setBabies((prev) => prev.filter((b) => b.id !== babyId));
  };

  // Run on mount to check if any vaccines have transitioned to 'Overdue' in the background
  useEffect(() => {
    if (babies.length > 0) {
      setBabies((prev) => refreshVaccineStatuses(prev));
    }
  }, []);

  return (
    <BabyContext.Provider value={{ babies, addBaby, toggleVaccineStatus, removeBaby }}>
      {children}
    </BabyContext.Provider>
  );
};

export const useBaby = () => {
  const context = useContext(BabyContext);
  if (!context) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
};
