import { Table } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface BaseTableProps {
    headers: string[];
    hasActions?: boolean;
    children: ReactNode;
}

export function BaseTable({ headers, children, hasActions = true }: BaseTableProps) {
    return (
        <Table.Root style={{ borderCollapse: 'separate', borderSpacing: '0 1em' }} size={'md'}>
            <Table.Header>
                <Table.Row bg={'transparent'}>
                    {headers.map((header, idx) => (
                        <Table.ColumnHeader key={idx} borderColor={{ base: 'gray.300', _dark: 'gray.800' }}>
                            {header}
                        </Table.ColumnHeader>
                    ))}
                    {hasActions && (
                        <Table.ColumnHeader borderColor={{ base: 'gray.300', _dark: 'gray.800' }} textAlign={'right'}>
                            Ações
                        </Table.ColumnHeader>
                    )}
                </Table.Row>
            </Table.Header>
            <Table.Body>{children}</Table.Body>
        </Table.Root>
    );
}
