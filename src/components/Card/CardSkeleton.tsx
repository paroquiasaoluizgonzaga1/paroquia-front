import { Skeleton, Stack } from '@chakra-ui/react';

interface TableSkeletonProps {
    count: number;
}

export function CardSkeleton({ count }: TableSkeletonProps) {
    return (
        <Stack gap={4} minW={'full'} mt={4}>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} height={'100px'} rounded={'xl'} />
            ))}
        </Stack>
    );
}
