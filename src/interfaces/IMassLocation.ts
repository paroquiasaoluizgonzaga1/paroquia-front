import type { IMassSchedule } from "./IMassSchedule";

export interface IMassLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isHeadquarters: boolean;
  massSchedules: IMassSchedule[];
}
