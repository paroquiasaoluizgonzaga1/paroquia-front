import { CustomBreadcrumb } from '@/components/CustomBreadcrumb';
import { PageHeading } from '@/components/PageHeading';
import { DefaultPage } from '@/layouts/DefaultPage';
import { HStack, Spinner, Stack } from '@chakra-ui/react';
import { LuMegaphone } from 'react-icons/lu';
import { RichTextEditor } from '@/components/Form/RichTextEditor';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import type { AxiosError } from 'axios';
import type { ITransparencyPortal } from '@/interfaces/ITransparencyPortal';
import { OtherScheduleTypes } from '@/constants/OtherScheduleTypes';

export function WorksAndRenovations() {
    const navigate = useNavigate();

    const [worksAndRenovations, setWorksAndRenovations] = useState<ITransparencyPortal | null>(null);
    const [content, setContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchWorksAndRenovations = async () => {
            try {
                const response = await api.get<ITransparencyPortal>(
                    `otherSchedules/first/${OtherScheduleTypes.WorksAndRenovations}`
                );
                setWorksAndRenovations(response.data);
                setContent(response.data.content ?? '');
            } catch (error: unknown) {
                handleError(error as AxiosError<IApiError>);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorksAndRenovations();
    }, []);

    const handleUpdate = async () => {
        setIsLoadingUpdate(true);
        try {
            const form = new FormData();

            form.append('content', content);
            form.append('type', OtherScheduleTypes.WorksAndRenovations.toString());
            form.append('title', 'Obras e reformas');

            await api.putForm(`otherSchedules/${worksAndRenovations?.id}`, form);
            toaster.success({ title: 'Obras e reformas atualizadas com sucesso' });
        } catch (error: unknown) {
            handleError(error as AxiosError<IApiError>);
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <DefaultPage>
            <CustomBreadcrumb current={'Obras e reformas'} items={[{ title: 'Home', link: '/' }]} />
            <PageHeading icon={<LuMegaphone />} my={6}>
                Obras e reformas
            </PageHeading>
            <Stack
                maxW={'1000px'}
                gap={[4, 6]}
                as={'form'}
                onSubmit={handleUpdate}
                bg={{ base: 'white', _dark: 'gray.900' }}
                px={[6, 8]}
                py={[6, 8]}
                rounded={'lg'}
                mb={[36, 10]}
            >
                {isLoading && <Spinner />}
                {!isLoading && worksAndRenovations?.id && (
                    <RichTextEditor
                        value={content}
                        onChange={(value) => setContent(value)}
                        placeholder="Digite o conteúdo das obras e reformas aqui..."
                        minEditorHeight="400px"
                        maxEditorHeight="600px"
                    />
                )}
                <HStack w="full" justify={'flex-end'}>
                    <Button variant={'outline'} w="fit-content" px={6} onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" colorPalette={'brand'} w="fit-content" px={6} loading={isLoadingUpdate}>
                        Salvar
                    </Button>
                </HStack>
            </Stack>
            <Stack minH={'1px'} />
        </DefaultPage>
    );
}
