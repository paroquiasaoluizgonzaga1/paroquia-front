import type { ICollection } from "@/interfaces/ICollection";

export const MEMBER_TYPES = {
  0: "Membro",
  1: "Gerente",
  2: "Administrador",
} as const;

export const MemberTypes = {
  Member: 0,
  Manager: 1,
  Admin: 2,
} as const;

export const MEMBER_TYPES_WITH_NAMES: ICollection[] = [
  {
    label: "Membro",
    value: "0",
    description: "",
  },
  {
    label: "Gerente",
    value: "1",
    description: "",
  },
  {
    label: "Administrador",
    value: "2",
    description: "",
  },
];

export const MEMBER_TYPES_WITH_NAMES_FOR_MANAGER: ICollection[] = [
  {
    label: "Membro",
    value: "0",
    description: "",
  },
];
