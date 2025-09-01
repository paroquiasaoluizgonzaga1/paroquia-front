import type { IMassLocation } from '@/interfaces/IMassLocation';
import type { IMassSchedule } from '@/interfaces/IMassSchedule';
import type { IMassTime } from '@/interfaces/IMassTime';
import { create } from 'zustand';

interface MassState {
    massLocation: IMassLocation;
    resetMassLocation: () => void;
    setMassLocation: (data: IMassLocation) => void;
    addMassSchedule: (data: IMassSchedule) => void;
    updateMassScheduleDay: (id: string, day: string) => void;
    removeMassSchedule: (id: string) => void;
    addMassTime: (data: IMassTime) => void;
    removeMassTime: (massScheduleId: string, timeId: string) => void;
}

export const massStore = create<MassState>((set) => ({
    massLocation: {} as IMassLocation,
    resetMassLocation: () => set({ massLocation: {} as IMassLocation }),
    setMassLocation: (data: IMassLocation) => set({ massLocation: data }),
    addMassSchedule: (data: IMassSchedule) =>
        set((state) => ({
            massLocation: {
                ...state.massLocation,
                massSchedules: [...state.massLocation.massSchedules, data],
            },
        })),
    updateMassScheduleDay: (id: string, day: string) =>
        set((state) => ({
            massLocation: {
                ...state.massLocation,
                massSchedules: state.massLocation.massSchedules.map((schedule) =>
                    schedule.id === id ? { ...schedule, day } : schedule
                ),
            },
        })),
    removeMassSchedule: (id: string) =>
        set((state) => ({
            massLocation: {
                ...state.massLocation,
                massSchedules: state.massLocation.massSchedules.filter((schedule) => schedule.id !== id),
            },
        })),
    addMassTime: (data: IMassTime) =>
        set((state) => ({
            massLocation: {
                ...state.massLocation,
                massSchedules: state.massLocation.massSchedules.map((schedule) =>
                    schedule.id === data.massScheduleId
                        ? { ...schedule, massTimes: [...schedule.massTimes, data] }
                        : schedule
                ),
            },
        })),
    removeMassTime: (massScheduleId: string, timeId: string) =>
        set((state) => ({
            massLocation: {
                ...state.massLocation,
                massSchedules: state.massLocation.massSchedules.map((schedule) =>
                    schedule.id === massScheduleId
                        ? {
                              ...schedule,
                              massTimes: schedule.massTimes.filter((time) => time.id !== timeId),
                          }
                        : schedule
                ),
            },
        })),
}));
