import { CustomBreadcrumb } from '@/components/CustomBreadcrumb';
import { Input } from '@/components/Form/Input';
import { PageHeading } from '@/components/PageHeading';
import { DefaultPage } from '@/layouts/DefaultPage';
import { HStack, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuMegaphone } from 'react-icons/lu';
import { type SubmitHandler, useForm } from 'react-hook-form';
import * as zod from 'zod';
import { RichTextEditor } from '@/components/Form/RichTextEditor';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toaster } from '@/components/ui/toaster';
import type { AxiosError } from 'axios';
import type { IOtherSchedule } from '@/interfaces/IOtherSchedule';
import { OtherScheduleTypes } from '@/constants/OtherScheduleTypes';

interface IEditOtherInformationDTO {
    title: string;
    content: string;
    type: number;
}

const editFormSchema = zod.object({
    title: zod
        .string()
        .min(5, 'O título deve ter no mínimo 5 caracteres')
        .max(250, 'O título deve ter no máximo 250 caracteres'),
    content: zod.string(),
    type: zod.number(),
});

export function EditOtherInformation() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { register, handleSubmit, formState, reset, setValue, watch } = useForm<IEditOtherInformationDTO>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            title: '',
            type: OtherScheduleTypes.OtherInformations,
            content: '',
        },
    });

    const { errors, isSubmitting } = formState;

    const content = watch('content');

    useEffect(() => {
        const fetchNews = async () => {
            if (!id) return;
            try {
                const response = await api.get<IOtherSchedule>(`otherSchedules/${id}`);
                const groupOrService = response.data;
                reset({
                    title: groupOrService.title,
                    content: groupOrService.content ?? '',
                    type: groupOrService.type,
                });
            } catch (error: unknown) {
                handleError(error as AxiosError<IApiError>);
            }
        };
        fetchNews();
    }, [id, reset]);

    const handleUpdate: SubmitHandler<IEditOtherInformationDTO> = async (data) => {
        if (!id) return;
        try {
            const { title, content, type } = data;
            const form = new FormData();

            form.append('title', title);
            form.append('type', type.toString());
            if (content) form.append('content', content);

            await api.putForm(`otherSchedules/${id}`, form);
            toaster.success({ title: 'Informação atualizada com sucesso' });
            navigate('/outras-informacoes');
            reset();
        } catch (error: unknown) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    const handleCancel = () => {
        reset();
        navigate('/outras-informacoes');
    };

    return (
        <DefaultPage>
            <CustomBreadcrumb
                current={'Editar informação'}
                items={[
                    { title: 'Home', link: '/' },
                    { title: 'Outras informações', link: '/outras-informacoes' },
                ]}
            />
            <PageHeading icon={<LuMegaphone />} my={6}>
                Editar informação
            </PageHeading>
            <Stack
                maxW={'800px'}
                gap={[4, 6]}
                as={'form'}
                onSubmit={handleSubmit(handleUpdate)}
                bg={{ base: 'white', _dark: 'gray.900' }}
                px={[6, 8]}
                py={[6, 8]}
                rounded={'lg'}
                mb={[36, 10]}
            >
                <Input type="text" label={'Título'} errorText={errors?.title?.message} {...register('title')} />
                {content && (
                    <RichTextEditor
                        value={content}
                        onChange={(value) => setValue('content', value)}
                        label="Descrição"
                        errorText={errors?.content?.message}
                        placeholder="Digite o conteúdo da informação aqui..."
                    />
                )}
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
        </DefaultPage>
    );
}
