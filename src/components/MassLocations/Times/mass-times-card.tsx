import { Tag } from '@/components/ui/tag';
import type { IMassTime } from '@/interfaces/IMassTime';
import { HStack, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';
import { AddMassTimeModal } from './add-mass-time-modal';
import { massStore } from '@/stores/massStore';
import { api } from '@/services/api';
import type { AxiosError, AxiosResponse } from 'axios';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import { toaster } from '@/components/ui/toaster';
import { Alert } from '@/components/Alert';
import { useState } from 'react';

interface ICreateMassTimeDTO {
    time: string;
}

export function MassTimesCard({ massScheduleId }: { massScheduleId: string }) {
    const { open, onOpen, onClose } = useDisclosure();
    const { open: openAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
    const { massLocation, addMassTime, removeMassTime } = massStore();
    const [massTimeToRemove, setMassTimeToRemove] = useState<string | null>(null);

    const massTimes = massLocation.massSchedules.find((schedule) => schedule.id === massScheduleId)?.massTimes;

    const handleConfirm = async (time: string) => {
        try {
            const { data } = await api.post<ICreateMassTimeDTO, AxiosResponse<IMassTime>>(
                `massLocations/${massLocation.id}/schedules/${massScheduleId}/times`,
                {
                    time,
                }
            );

            addMassTime({
                id: data.id,
                massScheduleId,
                time,
            });
            toaster.success({ title: 'Horário adicionado com sucesso' });
        } catch (error) {
            handleError(error as AxiosError<IApiError>);
        } finally {
            onClose();
        }
    };

    const handleRemoveMassTime = async () => {
        if (!massTimeToRemove) return;

        try {
            await api.delete(`massLocations/${massLocation.id}/schedules/${massScheduleId}/times/${massTimeToRemove}`);
            removeMassTime(massScheduleId, massTimeToRemove);
            toaster.success({ title: 'Horário excluído com sucesso' });
        } catch (error) {
            handleError(error as AxiosError<IApiError>);
        } finally {
            onCloseAlert();
        }
    };

    const handleOpenAlertToRemoveMassTime = (id: string) => {
        setMassTimeToRemove(id);
        onOpenAlert();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Stack>
            <HStack gap={2} mb={2} mt={1}>
                <Text fontSize={'sm'}>Horários</Text>
            </HStack>
            {!massTimes || massTimes.length === 0 ? (
                <Tag
                    rounded={'full'}
                    px={3}
                    py={1}
                    cursor={'pointer'}
                    w="fit-content"
                    colorPalette={'brand'}
                    onClick={onOpen}
                >
                    <HStack>
                        <LuPlus />
                        Novo
                    </HStack>
                </Tag>
            ) : (
                <HStack gap={2}>
                    {massTimes.map((massTime) => (
                        <Tag
                            rounded={'full'}
                            w="fit-content"
                            onClose={() => handleOpenAlertToRemoveMassTime(massTime.id)}
                            key={massTime.id}
                            px={3}
                            py={1}
                            colorPalette={'orange'}
                        >
                            {massTime.time.substring(0, 5)}
                        </Tag>
                    ))}
                    <Tag
                        rounded={'full'}
                        px={3}
                        py={1}
                        cursor={'pointer'}
                        w="fit-content"
                        colorPalette={'brand'}
                        onClick={onOpen}
                    >
                        <HStack>
                            <LuPlus />
                            Novo
                        </HStack>
                    </Tag>
                </HStack>
            )}
            <AddMassTimeModal isOpen={open} onCancel={handleCancel} onConfirm={handleConfirm} />
            <Alert
                title="Tem certeza que deseja excluir o horário?"
                onCancel={onClose}
                onConfirm={handleRemoveMassTime}
                isOpen={openAlert}
            />
        </Stack>
    );
}
