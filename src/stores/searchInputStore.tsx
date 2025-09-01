import type { IMember } from "@/interfaces/IMember";
import { create } from "zustand";

interface SearchInputState {
  suggestions: IMember[];
  setSuggestions: (data: IMember[]) => void;
  isLoaded: boolean;
  setIsLoaded: (value: boolean) => void;
  search: string | null;
  setSearch: (value: string) => void;
  selectedValue: IMember | null;
  setSelectedValue: (value: IMember | null) => void;
}

export const searchInputStore = create<SearchInputState>((set) => ({
  suggestions: [],
  setSuggestions: (data) => set({ suggestions: data }),
  isLoaded: false,
  setIsLoaded: (value) => set({ isLoaded: value }),
  search: null,
  setSearch: (value) => set({ search: value }),
  selectedValue: null,
  setSelectedValue: (value) => set({ selectedValue: value }),
}));
