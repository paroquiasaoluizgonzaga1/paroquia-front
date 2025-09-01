import { ActionButtons } from '@/components/ActionButtons';
import type { IOtherSchedule } from '@/interfaces/IOtherSchedule';
import { Card, HStack, Stack, Text } from '@chakra-ui/react';
import { DateTime } from 'luxon';

interface OtherSchedulesCardProps {
    otherSchedule: IOtherSchedule;
    deleteAction: (id: string) => void;
    editAction: (id: string) => void;
}

export function OtherSchedulesCard({ otherSchedule, deleteAction, editAction }: OtherSchedulesCardProps) {
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
                        {otherSchedule.title}
                    </Text>
                    <Text>
                        {DateTime.fromISO(otherSchedule.createdAt)
                            .setLocale('pt-BR')
                            .toLocaleString(DateTime.DATETIME_MED)}
                    </Text>
                </Stack>
                <HStack justify={'flex-end'}>
                    <ActionButtons
                        id={otherSchedule.id}
                        alertDescription={`Tem certeza de que você deseja excluir esse registro?`}
                        alertTitle={'Excluir registro'}
                        deleteAction={deleteAction}
                        editAction={editAction}
                    />
                </HStack>
            </Card.Body>
        </Card.Root>
    );
}
