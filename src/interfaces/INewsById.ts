import type { IBaseFileDTO } from './IBaseFileDTO';

export interface INewsById {
    id: string;
    title: string;
    content: string;
    summary: string;
    highlight: boolean;
    highlightUntil: string | null;
    createdAt: string;
    updatedAt?: string;
    files: IBaseFileDTO[];
}
