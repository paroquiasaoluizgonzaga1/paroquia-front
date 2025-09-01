import { Button, Flex, Stack, Card, Image, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { authStore } from '@/stores/authStore';
import { useColorMode } from '@/components/ui/color-mode';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Input } from '@/components/Form/Input';
import type { AxiosError } from 'axios';

import logo from '/src/assets/logo_dark.png';

const loginFormSchema = zod.object({
    email: zod.email('Digite um e-mail válido'),
    password: zod.string().min(1, 'A senha é obrigatória'),
});

type LoginFormData = zod.infer<typeof loginFormSchema>;

export default function Login() {
    const [query] = useSearchParams();
    const { setColorMode } = useColorMode();
    const { signIn, isAuthenticated } = authStore();
    const navigate = useNavigate();

    const { register, handleSubmit, formState } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
    });

    const { errors, isSubmitting } = formState;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        setColorMode('dark');
    }, []);

    const handleLogin: SubmitHandler<LoginFormData> = async (data) => {
        try {
            await signIn(data, query.get('redirect') ?? undefined);
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
                onSubmit={handleSubmit(handleLogin)}
            >
                <Card.Header>
                    <Flex w="full" justify={'center'}>
                        <Image src={logo} alt="Logo Paróquia São Luiz Gonzaga" maxH={[7, 8]} />
                    </Flex>
                    <Card.Title>Login</Card.Title>
                    <Card.Description>Faça o login para acessar a área de membros</Card.Description>
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
                        <Input
                            label="Senha"
                            type="password"
                            errorText={errors.password?.message}
                            borderColor={{ base: 'gray.300', _dark: 'gray.600' }}
                            {...register('password')}
                        />
                    </Stack>
                </Card.Body>
                <Card.Footer justifyContent="space-between">
                    <NavLink to="/recuperar-senha">
                        <Text fontSize={'xs'} textDecoration="underline">
                            Esqueci minha senha
                        </Text>
                    </NavLink>
                    <Button colorPalette={'brand'} variant="solid" type="submit" loading={isSubmitting}>
                        Entrar
                    </Button>
                </Card.Footer>
            </Card.Root>
        </Flex>
    );
}
