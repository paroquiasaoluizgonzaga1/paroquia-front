import { HStack, IconButton, useDisclosure } from '@chakra-ui/react';
import { Alert } from './Alert';
import { LuPencilLine, LuTrash } from 'react-icons/lu';

interface ActionButtonsProps {
    id: string;
    editAction?: (id: string) => void;
    deleteAction?: (id: string) => void;
    alertTitle: string;
    alertDescription: string;
}

export function ActionButtons({ id, editAction, deleteAction, alertTitle, alertDescription }: ActionButtonsProps) {
    const { onClose, open, onOpen } = useDisclosure();

    const handleDelete = () => {
        if (!!deleteAction) {
            deleteAction(id);
        }
        onClose();
    };

    return (
        <HStack gap={0}>
            {!!editAction && (
                <IconButton onClick={() => editAction(id)} variant={'plain'} ml={'auto'}>
                    <LuPencilLine />
                </IconButton>
            )}
            {!!deleteAction && (
                <IconButton
                    colorPalette={'red'}
                    ml={!!editAction ? 'inherit' : 'auto'}
                    onClick={onOpen}
                    variant={'plain'}
                >
                    <LuTrash />
                </IconButton>
            )}
            <Alert
                onCancel={onClose}
                onConfirm={handleDelete}
                isOpen={open}
                title={alertTitle}
                description={alertDescription}
            />
        </HStack>
    );
}
