import type { ICreateMassScheduleDTO } from '@/interfaces/ICreateMassScheduleDTO';
import type { IMassSchedule } from '@/interfaces/IMassSchedule';
import { massStore } from '@/stores/massStore';
import { useTempScheduleStore } from '@/stores/tempScheduleStore';
import { Card, Editable, HStack, IconButton, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { LuCheck, LuPencilLine, LuTrash, LuX } from 'react-icons/lu';
import { TempSchedule } from './temp-schedule';
import type { AxiosError, AxiosResponse } from 'axios';
import { api } from '@/services/api';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import { MassTimesCard } from '../Times/mass-times-card';
import { Alert } from '@/components/Alert';
import { toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';

export function MassSchedulesSection() {
    const { massLocation, addMassSchedule, updateMassScheduleDay, removeMassSchedule } = massStore();
    const massSchedules = massLocation.massSchedules;
    const [scheduleToRemove, setScheduleToRemove] = useState<string | null>(null);

    const { open, onOpen, onClose } = useDisclosure();

    const { resetTempSchedule } = useTempScheduleStore();

    const handleAddMassSchedule = async (schedule: ICreateMassScheduleDTO) => {
        try {
            const { data } = await api.post<ICreateMassScheduleDTO, AxiosResponse<IMassSchedule>>(
                `massLocations/${massLocation.id}/schedules`,
                schedule
            );

            addMassSchedule(data);
            resetTempSchedule();
            toaster.success({ title: 'Programação adicionada com sucesso' });
        } catch (error) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    const handleOpenAlertToRemoveSchedule = (id: string) => {
        setScheduleToRemove(id);
        onOpen();
    };

    const handleRemoveMassSchedule = async () => {
        if (!scheduleToRemove) return;

        try {
            await api.delete(`massLocations/${massLocation.id}/schedules/${scheduleToRemove}`);
            removeMassSchedule(scheduleToRemove);
            toaster.success({ title: 'Programação excluída com sucesso' });
        } catch (error) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    const handleUpdateMassSchedule = async (id: string, day: string) => {
        if (massSchedules.find((x) => x.id === id && x.day === day)) return;

        try {
            await api.put(`massLocations/${massLocation.id}/schedules/${id}`, { day });
            updateMassScheduleDay(id, day);
            toaster.success({ title: 'Programação atualizada com sucesso' });
        } catch (error) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    useEffect(() => {
        resetTempSchedule();
    }, []);

    return (
        <Stack gap={4}>
            <TempSchedule onAdd={handleAddMassSchedule} />
            {massSchedules.length === 0 ? (
                <Card.Root>
                    <Card.Body>
                        <Text>Nenhuma programação adicionada</Text>
                    </Card.Body>
                </Card.Root>
            ) : (
                massSchedules.map((massSchedule, index) => (
                    <Card.Root key={index}>
                        <Card.Body>
                            <HStack justify={'space-between'}>
                                <Stack>
                                    <Editable.Root
                                        defaultValue={massSchedule.day}
                                        onValueCommit={({ value }) => handleUpdateMassSchedule(massSchedule.id, value)}
                                        color={{ base: 'brand.600', _dark: 'brand.300' }}
                                        fontSize={'lg'}
                                        fontWeight={500}
                                    >
                                        <Editable.Preview />
                                        <Editable.Input minW={'300px'} />
                                        <Editable.Control>
                                            <Editable.EditTrigger asChild>
                                                <IconButton variant="ghost" size="xs">
                                                    <LuPencilLine />
                                                </IconButton>
                                            </Editable.EditTrigger>
                                            <Editable.CancelTrigger asChild>
                                                <IconButton variant="outline" size="xs">
                                                    <LuX />
                                                </IconButton>
                                            </Editable.CancelTrigger>
                                            <Editable.SubmitTrigger asChild>
                                                <IconButton variant="outline" size="xs">
                                                    <LuCheck />
                                                </IconButton>
                                            </Editable.SubmitTrigger>
                                        </Editable.Control>
                                    </Editable.Root>
                                    <MassTimesCard massScheduleId={massSchedule.id} />
                                </Stack>
                                <IconButton
                                    colorPalette={'red'}
                                    size={'xs'}
                                    onClick={() => handleOpenAlertToRemoveSchedule(massSchedule.id)}
                                >
                                    <LuTrash />
                                </IconButton>
                            </HStack>
                        </Card.Body>
                    </Card.Root>
                ))
            )}
            <Alert
                title="Tem certeza que deseja excluir a programação?"
                onCancel={onClose}
                onConfirm={handleRemoveMassSchedule}
                isOpen={open}
            />
        </Stack>
    );
}
