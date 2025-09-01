import type { ICreateMassScheduleDTO } from "./ICreateMassScheduleDTO";

export interface ICreateMassLocationDTO {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isHeadQuarters: boolean;
  massSchedules: ICreateMassScheduleDTO[];
}
