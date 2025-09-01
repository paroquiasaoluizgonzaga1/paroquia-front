import type { IMenu } from '@/interfaces/IMenu';
import { HiOutlineHome, HiHome } from 'react-icons/hi';
import {
    PiChurch,
    PiChurchFill,
    PiCross,
    PiCrossFill,
    PiGlobe,
    PiGlobeFill,
    PiMegaphone,
    PiMegaphoneFill,
    PiSquaresFour,
    PiSquaresFourFill,
    PiUsers,
    PiUsersFill,
} from 'react-icons/pi';
import { create } from 'zustand';

interface ISidebarState {
    isOpen: boolean;
    toggle: () => void;
    menu: UserMenu[];
    setMenu: (userRole: string) => void;
}

type UserMenu = Omit<IMenu, 'roles'>;

const menuItems: IMenu[] = [
    {
        title: 'Página inicial',
        href: '/',
        icon: <HiOutlineHome />,
        iconActive: <HiHome />,
        roles: ['admin', 'manager', 'member'],
    },
    {
        title: 'Membros',
        href: '/admin/membros',
        icon: <PiUsers />,
        iconActive: <PiUsersFill />,
        roles: ['admin'],
    },
    {
        title: 'Comunicados',
        href: '/comunicados',
        icon: <PiMegaphone />,
        iconActive: <PiMegaphoneFill />,
        roles: ['admin', 'manager'],
    },
    {
        title: 'Matriz e capelas',
        href: '/matriz-e-capelas',
        icon: <PiChurch />,
        iconActive: <PiChurchFill />,
        roles: ['admin', 'manager'],
    },
    {
        title: 'Portal de transparência',
        href: '/portal-de-transparencia',
        icon: <PiGlobe />,
        iconActive: <PiGlobeFill />,
        roles: ['admin', 'manager'],
    },
    {
        title: 'Sacramentos',
        href: '/sacramentos',
        icon: <PiCross />,
        iconActive: <PiCrossFill />,
        roles: ['admin', 'manager'],
    },
    {
        title: 'Pastorais, grupos e serviços',
        href: '/pastorais-grupos-e-servicos',
        icon: <PiSquaresFour />,
        iconActive: <PiSquaresFourFill />,
        roles: ['admin', 'manager'],
    },
];

export const sidebarStore = create<ISidebarState>((set) => ({
    isOpen: false,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    menu: [],
    setMenu: (userRole: string) => set(() => ({ menu: menuItems.filter((x) => x.roles.includes(userRole)) })),
}));
