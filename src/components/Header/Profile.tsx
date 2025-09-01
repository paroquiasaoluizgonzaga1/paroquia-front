import { authStore } from '@/stores/authStore';
import { Avatar } from '../ui/avatar';
import { MenuContent, MenuItem, MenuItemGroup, MenuRoot, MenuTrigger } from '../ui/menu';
import { LuLogOut } from 'react-icons/lu';

export function Profile() {
    const { user, signOut } = authStore();

    return (
        <MenuRoot>
            <MenuTrigger cursor={'pointer'}>
                <Avatar name={user?.name} bg={'brand.400'} size={['md', 'xl']} />
            </MenuTrigger>
            <MenuContent
                rounded={'lg'}
                bg={{ base: 'gray.100', _dark: 'gray.900' }}
                borderWidth={'1px'}
                borderColor={{ base: 'gray.100', _dark: 'gray.800' }}
                spaceY={2}
            >
                <MenuItemGroup title="Sistema">
                    <MenuItem value="sign-out" onClick={signOut} cursor={'pointer'}>
                        <LuLogOut />
                        Sair
                    </MenuItem>
                </MenuItemGroup>
            </MenuContent>
        </MenuRoot>
    );
}
