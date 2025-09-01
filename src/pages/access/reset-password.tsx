import { Button, Flex, Stack, Card, Image, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useColorMode } from '@/components/ui/color-mode';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Input } from '@/components/Form/Input';
import { api } from '@/services/api';
import { toaster } from '@/components/ui/toaster';
import type { AxiosError } from 'axios';

import logo from '/src/assets/logo_dark.png';

const resetPasswordSchema = zod
    .object({
        newPassword: zod
            .string()
            .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
            .regex(/[!@#$%^&*(),.?":{}|<>]/, 'A senha deve conter pelo menos um caractere especial')
            .min(8, 'A senha deve ter pelo menos 8 caracteres'),
        confirmNewPassword: zod.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'As senhas não conferem',
        path: ['confirmNewPassword'],
    });

type ResetPasswordFormData = zod.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setColorMode } = useColorMode();
    const token = searchParams.get('token');

    const { register, handleSubmit, formState } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const { errors, isSubmitting } = formState;

    useEffect(() => {
        if (!token) {
            toaster.error({ title: 'Link inválido' });
            navigate('/login');
        }
    }, [token]);

    useEffect(() => {
        setColorMode('dark');
    }, []);

    const handleResetPassword: SubmitHandler<ResetPasswordFormData> = async (data) => {
        try {
            await api.post('members/resetPassword', {
                token,
                ...data,
            });

            toaster.success({ title: 'Senha alterada com sucesso' });
            navigate('/login');
        } catch (error) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    return (
        <Flex w={'100vw'} h="100vh" justifyContent="center" alignItems={'center'}>
            <Card.Root
                maxW={['xs', 'sm']}
                color={{ base: 'gray.700', _dark: 'white' }}
                borderWidth={'1px'}
                borderColor={{ base: 'transparent', _dark: 'gray.700' }}
                bg={{ base: 'white', _dark: 'gray.800' }}
                shadow={{ base: 'md', _dark: 'none' }}
                as={'form'}
                onSubmit={handleSubmit(handleResetPassword)}
            >
                <Card.Header>
                    <Flex w="full" justify={'center'} mb={6}>
                        <Image src={logo} maxH={[7, 8]} />
                    </Flex>
                    <Card.Title>Nova Senha</Card.Title>
                    <Card.Description>Digite sua nova senha</Card.Description>
                </Card.Header>
                <Card.Body>
                    <Stack gap="4" w="full">
                        <Input
                            label="Nova senha"
                            type="password"
                            errorText={errors.newPassword?.message}
                            borderColor={{ base: 'gray.300', _dark: 'gray.600' }}
                            {...register('newPassword')}
                        />
                        <Input
                            label="Confirme a nova senha"
                            type="password"
                            errorText={errors.confirmNewPassword?.message}
                            borderColor={{ base: 'gray.300', _dark: 'gray.600' }}
                            {...register('confirmNewPassword')}
                        />
                    </Stack>
                </Card.Body>
                <Card.Footer justifyContent="space-between">
                    <NavLink to="/login">
                        <Text fontSize={'xs'} textDecoration="underline">
                            Voltar para o login
                        </Text>
                    </NavLink>
                    <Button colorPalette={'brand'} variant="solid" type="submit" loading={isSubmitting}>
                        Alterar senha
                    </Button>
                </Card.Footer>
            </Card.Root>
        </Flex>
    );
}
