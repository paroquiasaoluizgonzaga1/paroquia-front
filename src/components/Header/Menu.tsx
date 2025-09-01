import { Box, HStack, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../ui/menu';
import { FaBars } from 'react-icons/fa6';
import { sidebarStore } from '@/stores/sidebarStore';
import { NavLink } from 'react-router-dom';

export function Menu() {
    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    });

    const { toggle, menu } = sidebarStore();

    if (isWideVersion) {
        return (
            <IconButton
                bg={{ base: 'gray.100', _dark: 'gray.800' }}
                color={{ base: 'gray.500', _dark: 'gray.300' }}
                onClick={toggle}
            >
                <FaBars />
            </IconButton>
        );
    }

    return (
        <MenuRoot>
            <MenuTrigger>
                <IconButton
                    bg={{ base: 'gray.100', _dark: 'gray.800' }}
                    color={{ base: 'gray.500', _dark: 'gray.300' }}
                >
                    <FaBars />
                </IconButton>
            </MenuTrigger>
            <MenuContent
                rounded={'lg'}
                minW={['320px', '500px']}
                bg={{ base: 'gray.100', _dark: 'gray.900' }}
                borderWidth={'1px'}
                borderColor={{ base: 'gray.100', _dark: 'gray.800' }}
                spaceY={4}
            >
                {menu.map((m) => (
                    <MenuItem key={m.href} value={m.href}>
                        <NavLink to={m.href} end>
                            {({ isActive }) => (
                                <HStack color={isActive ? 'brand.400' : 'inherit'}>
                                    {isActive ? m.iconActive : m.icon}
                                    <Box
                                        flex={1}
                                        fontWeight={isActive ? 'semibold' : 'regular'}
                                        color={isActive ? 'inherit' : { base: 'gray.400', _dark: 'gray.400' }}
                                    >
                                        {m.title}
                                    </Box>
                                </HStack>
                            )}
                        </NavLink>
                    </MenuItem>
                ))}
            </MenuContent>
        </MenuRoot>
    );
}
