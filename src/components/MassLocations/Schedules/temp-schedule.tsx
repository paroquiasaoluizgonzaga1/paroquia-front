import { Input } from '@/components/Form/Input';
import { Tag } from '@/components/ui/tag';
import { useTempScheduleStore } from '@/stores/tempScheduleStore';
import { Button, Card, HStack, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { LuClock, LuPlus } from 'react-icons/lu';
import { AddMassTimeModal } from '../Times/add-mass-time-modal';
import type { ICreateMassScheduleDTO } from '@/interfaces/ICreateMassScheduleDTO';

interface ITempScheduleProps {
    onAdd: (schedule: ICreateMassScheduleDTO) => void;
}

export function TempSchedule({ onAdd }: ITempScheduleProps) {
    const { tempSchedule, setDay, addTime, removeTime } = useTempScheduleStore();
    const { open, onOpen, onClose } = useDisclosure();
    const [showAddSchedule, setShowAddSchedule] = useState(false);

    const handleConfirmTimeModal = (time: string) => {
        addTime(time);
        onClose();
    };

    const handleCancelTimeModal = () => {
        onClose();
    };

    const handleAddSchedule = () => {
        onAdd(tempSchedule);
        setShowAddSchedule(false);
    };

    return (
        <Stack>
            <HStack color={{ base: 'brand.600', _dark: 'brand.300' }}>
                <LuClock />
                <Text fontWeight={500}>Programação de Missas</Text>
            </HStack>
            {!showAddSchedule && (
                <Button w="fit-content" colorPalette={'brand'} onClick={() => setShowAddSchedule(true)}>
                    <LuPlus /> Adicionar
                </Button>
            )}

            {showAddSchedule && (
                <Stack gap={4}>
                    <Input
                        value={tempSchedule.day}
                        type="text"
                        label="Dia / dias"
                        placeholder="Ex: Segunda-feira, Quartas e sábados, etc."
                        onChange={(e) => setDay(e.target.value)}
                    />
                    <HStack gap={2} mb={2} mt={1}>
                        <Text fontSize={'sm'}>Horários</Text>
                        <Tag
                            rounded={'full'}
                            px={3}
                            py={1}
                            cursor={'pointer'}
                            onClick={onOpen}
                            w="fit-content"
                            colorPalette={'brand'}
                        >
                            <HStack>
                                <LuPlus />
                                Novo
                            </HStack>
                        </Tag>
                    </HStack>
                    {tempSchedule.massTimes.length === 0 ? (
                        <Card.Root>
                            <Card.Body p={4}>
                                <Text fontSize={'sm'}>Nenhum horário adicionado</Text>
                            </Card.Body>
                        </Card.Root>
                    ) : (
                        <HStack gap={2}>
                            {tempSchedule.massTimes.map((time, index) => (
                                <Tag
                                    rounded={'full'}
                                    w="fit-content"
                                    onClose={() => removeTime(index)}
                                    key={index}
                                    px={3}
                                    py={1}
                                    colorPalette={'orange'}
                                >
                                    {time}
                                </Tag>
                            ))}
                        </HStack>
                    )}

                    <HStack w="full" justify={'flex-start'} mt={4}>
                        <Button variant={'outline'} w="fit-content" px={6} onClick={() => setShowAddSchedule(false)}>
                            Cancelar
                        </Button>
                        <Button
                            colorPalette={'brand'}
                            w="fit-content"
                            px={6}
                            onClick={handleAddSchedule}
                            disabled={tempSchedule.day.length < 3 || tempSchedule.massTimes.length === 0}
                        >
                            Adicionar programação
                        </Button>
                    </HStack>
                </Stack>
            )}
            <AddMassTimeModal isOpen={open} onCancel={handleCancelTimeModal} onConfirm={handleConfirmTimeModal} />
        </Stack>
    );
}
