import type { ICreateMassScheduleDTO } from '@/interfaces/ICreateMassScheduleDTO';
import { create } from 'zustand';

interface TempScheduleState {
    tempSchedule: ICreateMassScheduleDTO;
    resetTempSchedule: () => void;
    setDay: (day: string) => void;
    addTime: (time: string) => void;
    removeTime: (index: number) => void;
}

export const useTempScheduleStore = create<TempScheduleState>((set) => ({
    tempSchedule: {
        day: '',
        massTimes: [],
    },
    resetTempSchedule: () => set({ tempSchedule: { day: '', massTimes: [] } }),
    setDay: (day) => set((state) => ({ tempSchedule: { ...state.tempSchedule, day } })),
    addTime: (time) =>
        set((state) => ({
            tempSchedule: { ...state.tempSchedule, massTimes: [...state.tempSchedule.massTimes, time] },
        })),
    removeTime: (index) =>
        set((state) => ({
            tempSchedule: {
                ...state.tempSchedule,
                massTimes: state.tempSchedule.massTimes.filter((_, i) => i !== index),
            },
        })),
}));
