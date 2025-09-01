import { ActionButtons } from '@/components/ActionButtons';
import { BaseTable } from '@/components/BaseTable';
import { EmptyList } from '@/components/EmptyList';
import { TableLeftCell } from '@/components/Table/TableLeftCell';
import { TableMidleCell } from '@/components/Table/TableMidleCell';
import { TableRightCell } from '@/components/Table/TableRightCell';
import { TableRow } from '@/components/Table/TableRow';
import { TableSkeleton } from '@/components/Table/TableSkeleton';
import type { IOtherSchedule } from '@/interfaces/IOtherSchedule';
import { For } from '@chakra-ui/react';
import { DateTime } from 'luxon';

interface OtherSchedulesTableProps {
    otherSchedulesList: IOtherSchedule[];
    isLoaded: boolean;
    deleteMessage: string;
    deleteAction: (id: string) => void;
    editAction?: (id: string) => void;
}

export function OtherSchedulesTable({
    otherSchedulesList,
    isLoaded,
    deleteMessage,
    deleteAction,
    editAction,
}: OtherSchedulesTableProps) {
    return (
        <>
            <BaseTable headers={['Título', 'Criado em']}>
                {otherSchedulesList && isLoaded && otherSchedulesList.length > 0 && (
                    <For each={otherSchedulesList}>
                        {(otherSchedule) => (
                            <TableRow key={otherSchedule.id}>
                                <TableLeftCell>{otherSchedule.title}</TableLeftCell>
                                <TableMidleCell>
                                    {DateTime.fromISO(otherSchedule.createdAt)
                                        .setLocale('pt-BR')
                                        .toLocaleString(DateTime.DATETIME_MED)}
                                </TableMidleCell>
                                <TableRightCell>
                                    <ActionButtons
                                        id={otherSchedule.id}
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
            {(!otherSchedulesList || otherSchedulesList.length == 0) && isLoaded && <EmptyList />}
        </>
    );
}
