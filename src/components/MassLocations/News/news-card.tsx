import { ActionButtons } from '@/components/ActionButtons';
import type { INews } from '@/interfaces/INews';
import { Card, HStack, Stack, Text } from '@chakra-ui/react';
import { DateTime } from 'luxon';

interface NewsCardProps {
    news: INews;
    deleteAction: (id: string) => void;
    editAction: (id: string) => void;
}

export function NewsCard({ news, deleteAction, editAction }: NewsCardProps) {
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
                        {news.title}
                    </Text>
                    {news.highlight && (
                        <Text fontSize={'xs'} color={'brand.500'} fontWeight={'bold'}>
                            Destacado
                        </Text>
                    )}
                    <Text>
                        {DateTime.fromISO(news.createdAt).setLocale('pt-BR').toLocaleString(DateTime.DATETIME_MED)}
                    </Text>
                </Stack>
                <HStack justify={'flex-end'}>
                    <ActionButtons
                        id={news.id}
                        alertDescription={`Tem certeza de que você deseja excluir esse comunicado?`}
                        alertTitle={'Excluir comunicado'}
                        deleteAction={deleteAction}
                        editAction={editAction}
                    />
                </HStack>
            </Card.Body>
        </Card.Root>
    );
}
