import { MemberTypes } from "@/constants/MemberTypes";

export interface IPendingMember {
  id: string;
  email: string;
  fullName: string;
  token: string;
  createdOn: string;
  memberType: typeof MemberTypes;
}
