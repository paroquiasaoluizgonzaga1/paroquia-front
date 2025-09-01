import { NavLink } from 'react-router-dom';
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from './ui/breadcrumb';

interface IBreadcrumbLink {
    title: string;
    link?: string;
}

interface CustomBreadcrumbProps {
    items: IBreadcrumbLink[];
    current: string;
}

export function CustomBreadcrumb({ items, current }: CustomBreadcrumbProps) {
    return (
        <BreadcrumbRoot mb={4}>
            {items.map((item) =>
                !!item.link ? (
                    <NavLink to={item.link} key={item.title}>
                        <BreadcrumbLink as={'p'}>{item.title}</BreadcrumbLink>
                    </NavLink>
                ) : (
                    <BreadcrumbLink as={'p'} key={item.title}>
                        {item.title}
                    </BreadcrumbLink>
                )
            )}
            <BreadcrumbCurrentLink color={{ base: 'brand.400', _dark: 'brand.300' }}>{current}</BreadcrumbCurrentLink>
        </BreadcrumbRoot>
    );
}
