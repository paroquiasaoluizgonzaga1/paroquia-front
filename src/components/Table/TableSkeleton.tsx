import { Skeleton, Stack } from '@chakra-ui/react';

interface TableSkeletonProps {
    count: number;
}

export function TableSkeleton({ count }: TableSkeletonProps) {
    return (
        <Stack gap={4} minW={'full'}>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} height={'64px'} rounded={'xl'} />
            ))}
        </Stack>
    );
}
