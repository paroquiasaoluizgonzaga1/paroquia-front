import { ActionButtons } from '@/components/ActionButtons';
import { BaseTable } from '@/components/BaseTable';
import { EmptyList } from '@/components/EmptyList';
import { TableLeftCell } from '@/components/Table/TableLeftCell';
import { TableMidleCell } from '@/components/Table/TableMidleCell';
import { TableRightCell } from '@/components/Table/TableRightCell';
import { TableRow } from '@/components/Table/TableRow';
import { TableSkeleton } from '@/components/Table/TableSkeleton';
import type { INews } from '@/interfaces/INews';
import { For, Icon } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { LuCircleCheck } from 'react-icons/lu';

interface NewsTableProps {
    newsList: INews[];
    isLoaded: boolean;
    deleteMessage: string;
    deleteAction: (id: string) => void;
    editAction?: (id: string) => void;
}

export function NewsTable({ newsList, isLoaded, deleteMessage, deleteAction, editAction }: NewsTableProps) {
    return (
        <>
            <BaseTable headers={['Título', 'Destacado', 'Criado em']}>
                {newsList && isLoaded && newsList.length > 0 && (
                    <For each={newsList}>
                        {(news) => (
                            <TableRow key={news.id}>
                                <TableLeftCell>{news.title}</TableLeftCell>
                                <TableMidleCell>
                                    {news.highlight && (
                                        <Icon fontSize={'xl'} color={{ base: 'brand.600', _dark: 'brand.300' }}>
                                            <LuCircleCheck />
                                        </Icon>
                                    )}
                                </TableMidleCell>
                                <TableMidleCell>
                                    {DateTime.fromISO(news.createdAt)
                                        .setLocale('pt-BR')
                                        .toLocaleString(DateTime.DATETIME_MED)}
                                </TableMidleCell>
                                <TableRightCell>
                                    <ActionButtons
                                        id={news.id}
                                        alertDescription={`Tem certeza de que você deseja excluir ${deleteMessage}?`}
                                        alertTitle={`Excluir ${deleteMessage}`}
                                        editAction={editAction}
                                        deleteAction={deleteAction}
                                    />
                                </TableRightCell>
                            </TableRow>
                        )}
                    </For>
                )}
            </BaseTable>
            {!isLoaded && <TableSkeleton count={10} />}
            {(!newsList || newsList.length == 0) && isLoaded && <EmptyList />}
        </>
    );
}
