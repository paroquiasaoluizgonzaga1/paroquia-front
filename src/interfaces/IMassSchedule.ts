import type { IMassTime } from "./IMassTime";

export interface IMassSchedule {
  id: string;
  massLocationId: string;
  day: string;
  massTimes: IMassTime[];
}
