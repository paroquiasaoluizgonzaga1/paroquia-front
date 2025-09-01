import { CustomBreadcrumb } from '@/components/CustomBreadcrumb';
import { DefaultPage } from '@/layouts/DefaultPage';
import { AddressAutocomplete } from '@/components/Form/AddressAutocomplete';
import { Input } from '@/components/Form/Input';
import { PageHeading } from '@/components/PageHeading';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Field } from '@/components/ui/field';
import { Card, Editable, HStack, IconButton, Separator, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuCheck, LuMapPin, LuPlus, LuPencilLine, LuX, LuTrash } from 'react-icons/lu';
import { type SubmitHandler, useForm } from 'react-hook-form';
import * as zod from 'zod';
import { api } from '@/services/api';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import { useNavigate } from 'react-router-dom';
import { toaster } from '@/components/ui/toaster';
import type { AxiosError } from 'axios';
import type { ICreateMassScheduleDTO } from '@/interfaces/ICreateMassScheduleDTO';
import { useEffect, useState } from 'react';
import { AddMassTimeModal } from '@/components/MassLocations/Times/add-mass-time-modal';
import { Tag } from '@/components/ui/tag';
import { TempSchedule } from '@/components/MassLocations/Schedules/temp-schedule';
import { useTempScheduleStore } from '@/stores/tempScheduleStore';

interface IAddMassLocationDTO {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    isHeadquarters: boolean;
    massSchedules: ICreateMassScheduleDTO[];
}

const createFormSchema = zod.object({
    name: zod
        .string()
        .min(3, 'O nome deve ter no mínimo 3 caracteres')
        .max(250, 'O nome deve ter no máximo 250 caracteres'),
    address: zod
        .string()
        .min(10, 'O endereço deve ter no mínimo 10 caracteres')
        .max(500, 'O endereço deve ter no máximo 500 caracteres'),
    latitude: zod.number().min(-90).max(90),
    longitude: zod.number().min(-180).max(180),
    isHeadquarters: zod.boolean(),
    massSchedules: zod
        .array(
            zod.object({
                day: zod.string().min(3, 'O dia deve ter no mínimo 3 caracteres'),
                massTimes: zod.array(zod.string()).min(1, 'Deve ter pelo menos 1 horário'),
            })
        )
        .min(1, 'Ao menos uma programação deve ser adicionada'),
});

export function AddMassLocation() {
    const navigate = useNavigate();
    const { open, onOpen, onClose } = useDisclosure();
    const { resetTempSchedule } = useTempScheduleStore();

    const [massSchedules, setMassSchedules] = useState<ICreateMassScheduleDTO[]>([]);

    const [currentScheduleIndex, setCurrentScheduleIndex] = useState<number | null>(null);

    const { register, handleSubmit, formState, reset, setValue, watch } = useForm<IAddMassLocationDTO>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            name: '',
            address: '',
            latitude: 0,
            longitude: 0,
            isHeadquarters: false,
            massSchedules: [],
        },
    });

    const { errors, isSubmitting } = formState;

    const handleAddressSelect = (address: string, latitude: number, longitude: number) => {
        setValue('address', address);
        setValue('latitude', latitude);
        setValue('longitude', longitude);
    };

    const handleCreate: SubmitHandler<IAddMassLocationDTO> = async (data) => {
        try {
            await api.post('massLocations', data);
            toaster.success({ title: 'Matriz ou capela criada com sucesso' });
            navigate('/matriz-e-capelas');
            reset();
        } catch (error: unknown) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    const handleCancel = () => {
        reset();
        navigate('/matriz-e-capelas');
    };

    const handleAddMassSchedule = (schedule: ICreateMassScheduleDTO) => {
        setMassSchedules([...massSchedules, schedule]);
        resetTempSchedule();
    };

    const handleRemoveMassSchedule = (index: number) => {
        setMassSchedules(massSchedules.filter((_, i) => i !== index));
    };

    const handleAddMassTime = (time: string) => {
        if (currentScheduleIndex !== null) {
            const newSchedules = [...massSchedules];

            newSchedules[currentScheduleIndex].massTimes.push(time);

            setMassSchedules(newSchedules);
            setCurrentScheduleIndex(null);
        }

        onClose();
    };

    const handleOpenMassTimeModal = (scheduleIndex: number) => {
        setCurrentScheduleIndex(scheduleIndex);
        onOpen();
    };

    const handleRemoveMassTime = (scheduleIndex: number, timeIndex: number) => {
        setMassSchedules((prev) => {
            const newSchedules = [...prev];

            newSchedules[scheduleIndex].massTimes = newSchedules[scheduleIndex].massTimes.filter(
                (_, i) => i !== timeIndex
            );

            return newSchedules;
        });
    };

    const handleEditMassSchedule = (index: number, value: string) => {
        setMassSchedules((prev) => {
            const newSchedules = [...prev];

            newSchedules[index].day = value;

            return newSchedules;
        });
    };

    useEffect(() => {
        setValue('massSchedules', massSchedules);
    }, [massSchedules]);

    useEffect(() => {
        resetTempSchedule();
    }, []);

    return (
        <DefaultPage>
            <CustomBreadcrumb
                current={'Nova matriz ou capela'}
                items={[
                    { title: 'Home', link: '/' },
                    { title: 'Matriz e capelas', link: '/matriz-e-capelas' },
                ]}
            />
            <PageHeading icon={<LuMapPin />} my={6}>
                Nova matriz ou capela
            </PageHeading>
            <Stack
                maxW={'800px'}
                gap={[4, 6]}
                as={'form'}
                onSubmit={handleSubmit(handleCreate)}
                bg={{ base: 'white', _dark: 'gray.900' }}
                px={[6, 8]}
                py={[6, 8]}
                rounded={'lg'}
                mb={[36, 10]}
            >
                <Input
                    type="text"
                    label="Nome da matriz/capela"
                    errorText={errors?.name?.message}
                    placeholder="Ex: Igreja Matriz São Luiz Gonzaga"
                    {...register('name')}
                />

                <AddressAutocomplete
                    label="Endereço completo"
                    onAddressSelect={handleAddressSelect}
                    errorText={errors?.address?.message}
                    placeholder="Digite o endereço completo..."
                />

                <Field label="Matriz?">
                    <Switch
                        checked={watch('isHeadquarters')}
                        onCheckedChange={(details) => setValue('isHeadquarters', details.checked)}
                    >
                        Marque se esta é a matriz da paróquia
                    </Switch>
                </Field>

                <Separator />

                <Stack gap={4}>
                    <TempSchedule onAdd={handleAddMassSchedule} />

                    {errors?.massSchedules?.message && (
                        <Text fontSize={'sm'} color={{ base: 'red.600', _dark: 'red.300' }}>
                            {errors?.massSchedules?.message}
                        </Text>
                    )}

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
                                                value={massSchedule.day}
                                                onValueChange={({ value }) => handleEditMassSchedule(index, value)}
                                                color={{ base: 'brand.600', _dark: 'brand.300' }}
                                                fontSize={'lg'}
                                                fontWeight={500}
                                            >
                                                <Editable.Preview w="full" />
                                                <Editable.Input />
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
                                            <Text fontSize={'sm'} mt={2} mb={1}>
                                                Horários
                                            </Text>
                                            <HStack gap={2}>
                                                <>
                                                    {massSchedule.massTimes.map((time, timeIdx) => (
                                                        <Tag
                                                            rounded={'full'}
                                                            w="fit-content"
                                                            onClose={() => handleRemoveMassTime(index, timeIdx)}
                                                            key={timeIdx + time}
                                                            px={3}
                                                            py={1}
                                                            colorPalette={'orange'}
                                                        >
                                                            {time}
                                                        </Tag>
                                                    ))}
                                                    <Tag
                                                        rounded={'full'}
                                                        px={3}
                                                        py={1}
                                                        cursor={'pointer'}
                                                        onClick={() => handleOpenMassTimeModal(index)}
                                                    >
                                                        <HStack>
                                                            <LuPlus />
                                                            Novo
                                                        </HStack>
                                                    </Tag>
                                                </>
                                            </HStack>
                                        </Stack>
                                        <IconButton
                                            colorPalette={'red'}
                                            size={'xs'}
                                            onClick={() => handleRemoveMassSchedule(index)}
                                        >
                                            <LuTrash />
                                        </IconButton>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                        ))
                    )}
                </Stack>

                <Separator />

                <HStack w="full" justify={'flex-end'}>
                    <Button variant={'outline'} w="fit-content" px={6} onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        colorPalette={'brand'}
                        w="fit-content"
                        px={6}
                        disabled={isSubmitting}
                        loading={isSubmitting}
                    >
                        Salvar
                    </Button>
                </HStack>
            </Stack>
            <Stack minH={'1px'} />
            <AddMassTimeModal isOpen={open} onCancel={onClose} onConfirm={handleAddMassTime} />
        </DefaultPage>
    );
}
