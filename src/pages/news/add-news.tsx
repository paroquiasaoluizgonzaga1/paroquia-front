import { CustomBreadcrumb } from '@/components/CustomBreadcrumb';
import { Input } from '@/components/Form/Input';
import { PageHeading } from '@/components/PageHeading';
import { DefaultPage } from '@/layouts/DefaultPage';
import { HStack, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuMegaphone } from 'react-icons/lu';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import * as zod from 'zod';
import { RichTextEditor } from '@/components/Form/RichTextEditor';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import { MultipleFileUpload } from '@/components/File/MultipleFileUpload';
import type { AxiosError } from 'axios';
import { Textarea } from '@/components/Form/TextArea';
import { Field } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';

interface IAddNewsDTO {
    title: string;
    content: string;
    summary: string;
    highlight: boolean;
    highlightUntil: string | null;
    files: File[];
}

const createFormSchema = zod.object({
    title: zod
        .string()
        .min(5, 'O título deve ter no mínimo 5 caracteres')
        .max(250, 'O título deve ter no máximo 250 caracteres'),
    content: zod.string(),
    summary: zod
        .string()
        .min(10, 'O resumo deve ter no mínimo 10 caracteres')
        .max(200, 'O resumo deve ter no máximo 200 caracteres'),
    highlight: zod.boolean(),
    highlightUntil: zod.string().nullable(),
    files: zod.array(zod.instanceof(File)),
});

export function AddNews() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState, reset, setValue, watch, control } = useForm<IAddNewsDTO>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            highlight: false,
            highlightUntil: null,
            files: [],
        },
    });

    const { errors, isSubmitting } = formState;

    const [filesToAdd, setFilesToAdd] = useState<File[]>([]);
    const content = watch('content');
    const highlight = watch('highlight');

    const handleClearFile = (file: File) => {
        setFilesToAdd(filesToAdd.filter((f) => f !== file));
    };

    const handleCreate: SubmitHandler<IAddNewsDTO> = async (data) => {
        try {
            const { title, content, summary, highlight, highlightUntil } = data;
            const form = new FormData();

            form.append('title', title);
            form.append('summary', summary);
            form.append('highlight', highlight.toString());

            if (highlightUntil) form.append('highlightUntil', highlightUntil + 'T00:00:00.000Z');

            if (content) form.append('content', content);

            filesToAdd.forEach((file) => {
                form.append('files', file);
            });

            await api.postForm('news', form);
            toaster.success({ title: 'Comunicado criado com sucesso' });
            navigate('/comunicados');
            reset();
        } catch (error: unknown) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    const handleCancel = () => {
        setFilesToAdd([]);
        reset();
        navigate('/comunicados');
    };

    return (
        <DefaultPage>
            <CustomBreadcrumb
                current={'Novo comunicado'}
                items={[
                    { title: 'Home', link: '/' },
                    { title: 'Comunicados', link: '/comunicados' },
                ]}
            />
            <PageHeading icon={<LuMegaphone />} my={6}>
                Novo comunicado
            </PageHeading>
            {Object.keys(errors).length > 0 && (
                <>
                    <Text>{errors?.title?.message}</Text>
                    <Text>{errors?.summary?.message}</Text>
                    <Text>{errors?.content?.message}</Text>
                    <Text>{errors?.highlight?.message}</Text>
                    <Text>{errors?.highlightUntil?.message}</Text>
                    <Text>{errors?.files?.message}</Text>
                </>
            )}
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
                <Textarea label="Resumo" errorText={errors?.summary?.message} {...register('summary')} />
                <RichTextEditor
                    value={content || ''}
                    onChange={(value) => setValue('content', value)}
                    label="Descrição"
                    errorText={errors?.content?.message}
                    placeholder="Digite o conteúdo do comunicado aqui..."
                />
                <MultipleFileUpload onUpload={setFilesToAdd} onClear={handleClearFile} label="Carregar imagens" />
                <Controller
                    control={control}
                    name={'highlight'}
                    render={({ field: { onChange, value } }) => (
                        <Field label={'Destacar na tela inicial?'}>
                            <Switch colorPalette={'brand'} mt={1} checked={value} onChange={onChange}></Switch>
                        </Field>
                    )}
                />
                {highlight && (
                    <Input
                        type="date"
                        label="Data de fim de destaque"
                        errorText={errors?.highlightUntil?.message}
                        {...register('highlightUntil')}
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
