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
import { OtherScheduleTypes } from '@/constants/OtherScheduleTypes';
import { useNavigate } from 'react-router-dom';
import { OtherSchedulesTable } from '@/components/OtherSchedules/other-schedules-table';
import { PiSquaresFourFill } from 'react-icons/pi';
import type { IOtherSchedule } from '@/interfaces/IOtherSchedule';
import { EmptyList } from '@/components/EmptyList';
import { OtherSchedulesCard } from '@/components/OtherSchedules/other-schedules-card';

export function OtherInformationsList() {
    const isWideVersion = useBreakpointValue({
        base: false,
        md: true,
    });

    const navigate = useNavigate();

    const [isLoaded, setIsLoaded] = useState(false);
    const [otherInformationsList, setOtherInformationsList] = useState<IOtherSchedule[]>([]);
    const [filters, setFilters] = useState<IPageFilter>({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchOtherInformations = useCallback(() => {
        setIsLoaded(false);

        api.get<IOtherSchedule[]>('otherSchedules', {
            params: {
                ...filters,
                type: OtherScheduleTypes.OtherInformations,
            },
        })
            .then((resp) => setOtherInformationsList(resp.data))
            .catch((err) => handleError(err))
            .finally(() => setIsLoaded(true));
    }, [filters]);

    const handleDelete = (id: string): void => {
        api.delete(`/otherSchedules/${id}`)
            .then(() => {
                toaster.success({ title: 'Registro excluído com sucesso' });
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
        if (filters.pageIndex == 0) fetchOtherInformations();
        else setPageIndex(0);
    };

    const addOtherInformation = () => {
        navigate('/outras-informacoes/novo');
    };

    const editOtherInformation = (id: string) => {
        navigate(`/outras-informacoes/editar/${id}`);
    };

    useEffect(() => {
        fetchOtherInformations();
    }, [fetchOtherInformations]);

    return (
        <DefaultPage>
            <CustomBreadcrumb items={[{ title: 'Home', link: '/' }]} current="Outras informações" />
            <HStack my={6} justify={'space-between'}>
                <PageHeading icon={<PiSquaresFourFill />}>Outras informações</PageHeading>
                <Button colorPalette={'brand'} onClick={addOtherInformation}>
                    <Icon fontSize={'sm'}>
                        <LuCirclePlus />
                    </Icon>
                    Adicionar
                </Button>
            </HStack>
            {isWideVersion && (
                <OtherSchedulesTable
                    isLoaded={isLoaded}
                    otherSchedulesList={otherInformationsList}
                    deleteMessage="o registro"
                    deleteAction={handleDelete}
                    editAction={editOtherInformation}
                />
            )}
            {!isWideVersion && isLoaded && (
                <Stack mt={8} gap={4}>
                    <For each={otherInformationsList} fallback={<EmptyList />}>
                        {(otherInformation) => (
                            <OtherSchedulesCard
                                key={otherInformation.id}
                                otherSchedule={otherInformation}
                                deleteAction={handleDelete}
                                editAction={editOtherInformation}
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
