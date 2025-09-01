import { IAddress } from './IProfile';

export interface IUpdateProfile {
    name: string;
    cpf: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: IAddress;
    memberType?: number;
}
