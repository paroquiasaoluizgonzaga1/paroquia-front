import { CardSkeleton } from '@/components/Card/CardSkeleton';
import { CustomBreadcrumb } from '@/components/CustomBreadcrumb';
import { PageHeading } from '@/components/PageHeading';
import { Pagination } from '@/components/Pagination';
import { toaster } from '@/components/ui/toaster';
import type { IPageFilter } from '@/interfaces/IPageFilter';
import { DefaultPage } from '@/layouts/DefaultPage';
import { api } from '@/services/api';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import { HStack, Icon, useBreakpointValue, Button, Stack, For } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { LuCirclePlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { PiChurchFill } from 'react-icons/pi';
import type { IMassLocationList } from '@/interfaces/IMassLocationList';
import { MassLocationsTable } from '@/components/MassLocations/mass-locations-table';
import { EmptyList } from '@/components/EmptyList';
import { MassLocationsCard } from '@/components/MassLocations/mass-locations-card';

export function MassLocationsList() {
    const isWideVersion = useBreakpointValue({
        base: false,
        md: true,
    });

    const navigate = useNavigate();

    const [isLoaded, setIsLoaded] = useState(false);
    const [massLocationsList, setMassLocationsList] = useState<IMassLocationList[]>([]);
    const [filters, setFilters] = useState<IPageFilter>({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchNews = useCallback(() => {
        setIsLoaded(false);

        api.get<IMassLocationList[]>('massLocations', {
            params: filters,
        })
            .then((resp) => setMassLocationsList(resp.data))
            .catch((err) => handleError(err))
            .finally(() => setIsLoaded(true));
    }, [filters]);

    const handleDelete = (id: string): void => {
        api.delete(`/massLocations/${id}`)
            .then(() => {
                toaster.success({ title: 'Matriz ou capela excluída com sucesso' });
                filter();
            })
            .catch((err: AxiosError<IApiError>) => {
                handleError(err);
            });
    };

    const setPageSize = (pageSize: number) => {
        setFilters((state: IPageFilter) => {
            return {
                ...state,
                pageSize,
            };
        });
    };

    const setPageIndex = (pageIndex: number) => {
        setFilters((state: IPageFilter) => {
            return {
                ...state,
                pageIndex,
            };
        });
    };

    const filter = () => {
        if (filters.pageIndex == 0) fetchNews();
        else setPageIndex(0);
    };

    const addMassLocation = () => {
        navigate('/matriz-e-capelas/novo');
    };

    const editMassLocation = (id: string) => {
        navigate(`/matriz-e-capelas/editar/${id}`);
    };

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    return (
        <DefaultPage>
            <CustomBreadcrumb items={[{ title: 'Home', link: '/' }]} current="Matriz e capelas" />
            <HStack my={6} justify={'space-between'}>
                <PageHeading icon={<PiChurchFill />}>Matriz e capelas</PageHeading>
                <Button colorPalette={'brand'} onClick={addMassLocation}>
                    <Icon fontSize={'sm'}>
                        <LuCirclePlus />
                    </Icon>
                    Adicionar
                </Button>
            </HStack>
            {isWideVersion && (
                <MassLocationsTable
                    isLoaded={isLoaded}
                    massLocationsList={massLocationsList}
                    deleteAction={handleDelete}
                    editAction={editMassLocation}
                />
            )}
            {!isWideVersion && isLoaded && (
                <Stack mt={8} gap={4}>
                    <For each={massLocationsList} fallback={<EmptyList />}>
                        {(massLocation) => (
                            <MassLocationsCard
                                key={massLocation.id}
                                massLocation={massLocation}
                                deleteAction={handleDelete}
                                editAction={editMassLocation}
                            />
                        )}
                    </For>
                </Stack>
            )}
            {!isWideVersion && !isLoaded && <CardSkeleton count={10} />}
            <Pagination
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                pageIndex={filters.pageIndex}
                pageSize={filters.pageSize}
            />
        </DefaultPage>
    );
}
