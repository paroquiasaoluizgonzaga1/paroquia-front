export interface IAlertProps {
    title: string;
    description?: string | null;
    onCancel: () => void;
    onConfirm: () => void;
    isOpen: boolean;
    isDeleteAction?: boolean;
}