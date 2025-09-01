import { Box, Grid, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { sidebarStore } from '@/stores/sidebarStore';
import { authStore } from '@/stores/authStore';
import { HiOutlineHome } from 'react-icons/hi';
import { PiChurch, PiCross, PiGlobe, PiMegaphone, PiSquaresFour, PiUsers } from 'react-icons/pi';

interface MenuCardProps {
    title: string;
    href: string;
    icon: React.ReactNode;
    description?: string;
}

function MenuCard({ title, href, icon, description }: MenuCardProps) {
    const navigate = useNavigate();

    return (
        <Box
            as="button"
            onClick={() => navigate(href)}
            p={6}
            bg="white"
            _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            boxShadow="sm"
            transition="all 0.2s"
            _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
                borderColor: 'blue.300',
                _dark: { borderColor: 'blue.500' },
            }}
            _active={{
                transform: 'translateY(0)',
                boxShadow: 'md',
            }}
            textAlign="left"
            w="full"
            h="full"
        >
            <VStack gap={4} align="start">
                <Box
                    p={3}
                    bg="blue.50"
                    _dark={{ bg: 'blue.900', color: 'blue.300' }}
                    borderRadius="lg"
                    color="blue.600"
                >
                    {icon}
                </Box>
                <VStack gap={2} align="start" w="full">
                    <Heading size="md" color="gray.800" _dark={{ color: 'white' }}>
                        {title}
                    </Heading>
                    {description && (
                        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                            {description}
                        </Text>
                    )}
                </VStack>
            </VStack>
        </Box>
    );
}

export function Home() {
    const { menu } = sidebarStore();
    const { user } = authStore();

    // Filter out the home page itself and admin-only routes for managers
    const availableMenuItems = menu.filter(
        (item) => item.href !== '/' && !(item.href.startsWith('/admin') && user?.role !== 'Admin')
    );

    const getMenuDescription = (href: string) => {
        const descriptions: Record<string, string> = {
            '/comunicados': 'Gerencie comunicados e notícias da paróquia',
            '/matriz-e-capelas': 'Configure locais e horários das missas',
            '/portal-de-transparencia': 'Acesse informações de transparência',
            '/sacramentos': 'Gerencie sacramentos e eventos religiosos',
            '/pastorais-grupos-e-servicos': 'Organize pastorais, grupos e serviços',
            '/admin/membros': 'Gerencie membros da paróquia',
        };
        return descriptions[href] || 'Acesse esta seção do sistema';
    };

    const getMenuIcon = (href: string) => {
        const icons: Record<string, React.ReactNode> = {
            '/comunicados': <PiMegaphone size={24} />,
            '/matriz-e-capelas': <PiChurch size={24} />,
            '/portal-de-transparencia': <PiGlobe size={24} />,
            '/sacramentos': <PiCross size={24} />,
            '/pastorais-grupos-e-servicos': <PiSquaresFour size={24} />,
            '/admin/membros': <PiUsers size={24} />,
        };
        return icons[href] || <HiOutlineHome size={24} />;
    };

    return (
        <Box p={8} maxW="1200px" mx="auto" w="full">
            <VStack gap={8} align="start" w="full">
                <VStack gap={2} align="start" w="full">
                    <Heading size="lg" color="gray.800" _dark={{ color: 'white' }}>
                        Bem-vindo ao Sistema da Paróquia
                    </Heading>
                    <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                        Selecione uma das opções abaixo para acessar as funcionalidades do sistema
                    </Text>
                </VStack>

                <Grid
                    templateColumns={{
                        base: '1fr',
                        md: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)',
                    }}
                    gap={6}
                    w="full"
                >
                    {availableMenuItems.map((item, index) => (
                        <MenuCard
                            key={index}
                            title={item.title}
                            href={item.href}
                            icon={getMenuIcon(item.href)}
                            description={getMenuDescription(item.href)}
                        />
                    ))}
                </Grid>
            </VStack>
        </Box>
    );
}
