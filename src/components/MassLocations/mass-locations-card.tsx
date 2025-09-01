import { ActionButtons } from '@/components/ActionButtons';
import type { IMassLocationList } from '@/interfaces/IMassLocationList';
import { Card, HStack, Stack, Text } from '@chakra-ui/react';

interface MassLocationsCardProps {
    massLocation: IMassLocationList;
    deleteAction: (id: string) => void;
    editAction: (id: string) => void;
}

export function MassLocationsCard({ massLocation, deleteAction, editAction }: MassLocationsCardProps) {
    return (
        <Card.Root
            color={{ base: 'gray.700', _dark: 'white' }}
            borderWidth={'1px'}
            borderColor={{ base: 'transparent', _dark: 'gray.700' }}
            bg={{ base: 'white', _dark: 'gray.800' }}
            shadow={{ base: 'md', _dark: 'none' }}
            rounded={'xl'}
        >
            <Card.Body fontSize={'sm'} flexDir={'row'} justifyContent={'space-between'}>
                <Stack gap={1} flexGrow={1} maxW={'200px'}>
                    <Text whiteSpace={'pre-wrap'} wordBreak={'break-all'} fontWeight={'bold'}>
                        {massLocation.name}
                    </Text>
                    <Text>{massLocation.address}</Text>
                    {massLocation.isHeadquarters && (
                        <Text fontSize={'xs'} color={'brand.500'} fontWeight={'bold'}>
                            Matriz
                        </Text>
                    )}
                </Stack>
                <HStack justify={'flex-end'}>
                    <ActionButtons
                        id={massLocation.id}
                        alertDescription={`Tem certeza de que você deseja excluir a matriz ou capela?`}
                        alertTitle={'Excluir matriz ou capela'}
                        deleteAction={deleteAction}
                        editAction={editAction}
                    />
                </HStack>
            </Card.Body>
        </Card.Root>
    );
}
