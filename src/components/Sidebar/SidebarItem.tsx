import { HStack, Icon, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Tooltip } from '../ui/tooltip';

interface SidebarItemProps {
    icon: ReactNode;
    iconActive: ReactNode;
    href: string;
    title: string;
    displayTitle: boolean;
}

export function SidebarItem({ icon, iconActive, href, title, displayTitle }: SidebarItemProps) {
    return (
        <Tooltip
            content={title}
            openDelay={300}
            disabled={displayTitle}
            positioning={{ placement: 'right' }}
            contentProps={{
                px: 4,
                py: 3,
                color: 'inherit',
                bg: { base: 'gray.300', _dark: 'gray.700' },
            }}
        >
            <NavLink to={href} style={{ width: '100%' }}>
                {({ isActive }) => (
                    <HStack
                        w="full"
                        p={3}
                        rounded={displayTitle ? 'lg' : '2xl'}
                        bg={
                            isActive
                                ? { base: 'gray.200', _dark: 'gray.800' }
                                : {
                                      base: 'transparent',
                                      _dark: 'transparent',
                                      _hover: {
                                          base: 'gray.200',
                                          _dark: 'gray.800',
                                      },
                                  }
                        }
                        gap={4}
                    >
                        <Icon
                            ml={'2px'}
                            size={'lg'}
                            color={isActive ? 'brand.400' : { base: 'gray.400', _dark: 'gray.500' }}
                        >
                            {isActive ? iconActive : icon}
                        </Icon>
                        {displayTitle && (
                            <Text
                                fontWeight={isActive ? 'semibold' : 'regular'}
                                color={isActive ? 'inherit' : { base: 'gray.400', _dark: 'gray.400' }}
                            >
                                {title}
                            </Text>
                        )}
                    </HStack>
                )}
            </NavLink>
        </Tooltip>
    );
}
