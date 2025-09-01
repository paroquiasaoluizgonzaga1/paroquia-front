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
import { useNavigate } from 'react-router-dom';
import { toaster } from '@/components/ui/toaster';
import type { AxiosError } from 'axios';
import { OtherScheduleTypes } from '@/constants/OtherScheduleTypes';

interface IAddSacramentDTO {
    title: string;
    content: string;
    type: number;
}

const createFormSchema = zod.object({
    title: zod
        .string()
        .min(5, 'O título deve ter no mínimo 5 caracteres')
        .max(250, 'O título deve ter no máximo 250 caracteres'),
    content: zod.string().min(1, 'O conteúdo é obrigatório'),
    type: zod.number(),
});

export function AddSacrament() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState, reset, setValue, watch } = useForm<IAddSacramentDTO>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            title: '',
            type: OtherScheduleTypes.Sacrament,
            content: '',
        },
    });

    const { errors, isSubmitting } = formState;

    const content = watch('content');

    const handleCreate: SubmitHandler<IAddSacramentDTO> = async (data) => {
        try {
            const { title, content, type } = data;
            const form = new FormData();

            form.append('title', title);
            form.append('type', type.toString());

            if (content) form.append('content', content);

            await api.postForm('otherSchedules', form);
            toaster.success({ title: 'Sacramento criado com sucesso' });
            navigate('/sacramentos');
            reset();
        } catch (error: unknown) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    const handleCancel = () => {
        reset();
        navigate('/sacramentos');
    };

    return (
        <DefaultPage>
            <CustomBreadcrumb
                current={'Novo sacramento'}
                items={[
                    { title: 'Home', link: '/' },
                    { title: 'Sacramentos', link: '/sacramentos' },
                ]}
            />
            <PageHeading icon={<LuMegaphone />} my={6}>
                Novo sacramento
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
                <Input type="text" label={'Título'} errorText={errors?.title?.message} {...register('title')} />
                <RichTextEditor
                    value={content || ''}
                    onChange={(value) => setValue('content', value)}
                    label="Descrição"
                    errorText={errors?.content?.message}
                    placeholder="Digite o conteúdo do sacramento aqui..."
                />
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
