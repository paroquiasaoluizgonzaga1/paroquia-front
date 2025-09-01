import type { IBaseFileDTO } from '@/interfaces/IBaseFileDTO';
import { HStack, Stack, Button, Image } from '@chakra-ui/react';
import { LuX } from 'react-icons/lu';

interface ImagePreviewCardProps {
    file: IBaseFileDTO;
    onRemove: (id: string) => void;
    allowChanges: boolean;
}

export function ImagePreviewCard({ file, onRemove, allowChanges }: ImagePreviewCardProps) {
    const handleOpenFile = () => {
        window.open(file.url, '_blank');
    };

    return (
        <HStack w="full" rounded={'lg'} p={4} bg={{ base: 'white', _dark: 'gray.800' }} justify={'space-between'}>
            <Stack gap={4}>
                <Image src={file.url} alt={file.name} maxH={20} />
                <Button colorPalette={'brand'} w="fit-content" onClick={handleOpenFile}>
                    Ver imagem completa
                </Button>
            </Stack>
            {allowChanges && (
                <Button variant={'ghost'} onClick={() => onRemove(file.id)}>
                    <LuX />
                </Button>
            )}
        </HStack>
    );
}
