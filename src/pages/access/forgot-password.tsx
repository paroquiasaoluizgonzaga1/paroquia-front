import { Button, Flex, Stack, Card, Image, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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

// Create validation schema
const forgotPasswordSchema = zod.object({
    email: zod.email('Digite um e-mail válido'),
});

type ForgotPasswordFormData = zod.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
    const { setColorMode } = useColorMode();
    const navigate = useNavigate();

    const { register, handleSubmit, formState, reset } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const { errors, isSubmitting } = formState;

    useEffect(() => {
        setColorMode('dark');
    });

    const handleForgotPassword: SubmitHandler<ForgotPasswordFormData> = async (data) => {
        try {
            await api.post('members/forgotPassword', data);
            toaster.success({
                title: 'E-mail de recuperação de senha enviado com sucesso',
            });
            reset();

            setTimeout(() => {
                navigate('/login');
            }, 2000);
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
                onSubmit={handleSubmit(handleForgotPassword)}
            >
                <Card.Header>
                    <Flex w="full" justify={'center'} mb={6}>
                        <Image src={logo} maxH={[7, 8]} />
                    </Flex>
                    <Card.Title>Recuperar Senha</Card.Title>
                    <Card.Description>
                        Digite seu e-mail para receber as instruções de recuperação de senha
                    </Card.Description>
                </Card.Header>
                <Card.Body>
                    <Stack gap="4" w="full">
                        <Input
                            label="E-mail"
                            type="email"
                            errorText={errors.email?.message}
                            borderColor={{ base: 'gray.300', _dark: 'gray.600' }}
                            {...register('email')}
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
                        Enviar
                    </Button>
                </Card.Footer>
            </Card.Root>
        </Flex>
    );
}
