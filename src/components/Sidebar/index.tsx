import { Stack, useBreakpointValue } from '@chakra-ui/react';
import { SidebarItem } from './SidebarItem';
import { sidebarStore } from '@/stores/sidebarStore';

export function Sidebar() {
    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    });

    const { isOpen, menu } = sidebarStore();

    if (!isWideVersion) {
        return <></>;
    }

    return (
        <Stack
            as="aside"
            w={isOpen ? '250px' : 20}
            borderRightWidth={'1px'}
            bg={{ base: 'gray.100', _dark: 'gray.900' }}
            borderColor={{ base: 'gray.300', _dark: 'gray.800' }}
            h={'calc(100vh - 80px)'}
            align={isOpen ? 'flex-start' : 'center'}
            gap={4}
            pt={8}
            px={3}
            transition={'all 0.3s ease'}
        >
            {menu.map((item, idx) => (
                <SidebarItem
                    key={idx}
                    displayTitle={isOpen}
                    icon={item.icon}
                    iconActive={item.iconActive}
                    href={item.href}
                    title={item.title}
                />
            ))}
        </Stack>
    );
}
