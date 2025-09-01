import { LuBox } from 'react-icons/lu';
import { EmptyState } from './ui/empty-state';

export function EmptyList() {
    return (
        <EmptyState
            icon={<LuBox />}
            title="Nenhum resultado encontrado"
            description="Nenhum resultado foi encontrado para os filtros aplicados"
        />
    );
}
