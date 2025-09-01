import { Box, createListCollection, HStack, Icon, IconButton, Text, useBreakpointValue } from '@chakra-ui/react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../ui/select';

interface PaginationProps {
    pageIndex: number;
    pageSize: number;
    setPageIndex: (p: number) => void;
    setPageSize: (n: number) => void;
}

export function Pagination({ pageIndex, pageSize, setPageIndex, setPageSize }: PaginationProps) {
    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    });

    const isMobile = useBreakpointValue({
        base: true,
        md: false,
    });

    const collection = createListCollection({
        items: [
            {
                label: '10',
                value: 10,
            },
            {
                label: '25',
                value: 25,
            },
            {
                label: '50',
                value: 50,
            },
            {
                label: '100',
                value: 100,
            },
        ],
    });

    const handlePageSize = (value: number[]) => {
        setPageSize(value[0]);
        setPageIndex(0);
    };

    return (
        <HStack
            justify={'space-between'}
            mt="8"
            gap={'6'}
            align="center"
            mb={8}
            pb={isMobile ? 40 : 8}
            w="full"
            fontSize={'sm'}
        >
            <HStack
                w="full"
                justify={'flex-start'}
                flexDir={isWideVersion ? 'row' : 'column'}
                align={isWideVersion ? 'center' : 'flex-start'}
            >
                <Text>Itens por página</Text>
                <SelectRoot collection={collection} onValueChange={(ev: any) => handlePageSize(ev.value)} maxW={20}>
                    <SelectTrigger>
                        <SelectValueText placeholder={pageSize.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                        {collection.items.map((c) => (
                            <SelectItem item={c} key={c.value}>
                                {c.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectRoot>
            </HStack>
            <HStack
                w="full"
                justify={'flex-end'}
                flexDir={isWideVersion ? 'row' : 'column'}
                align={isWideVersion ? 'center' : 'flex-end'}
            >
                <Box order={isWideVersion ? 1 : 2}>
                    <strong>
                        {pageIndex == 0 ? 1 : pageIndex * pageSize + 1} -{' '}
                        {pageIndex == 0 ? pageSize : pageIndex * pageSize + pageSize}
                    </strong>
                    <span> de </span>
                    <strong>{pageIndex * pageSize + 2 * pageSize}</strong>
                </Box>
                <HStack order={isWideVersion ? 2 : 1}>
                    {pageIndex == 0 && (
                        <Icon>
                            <MdKeyboardArrowLeft />
                        </Icon>
                    )}
                    {pageIndex > 0 && (
                        <IconButton
                            aria-label={'Página anterior'}
                            onClick={() => setPageIndex(pageIndex - 1)}
                            size={'sm'}
                            bg={'brand.400'}
                            color={'white'}
                        >
                            <MdKeyboardArrowLeft />
                        </IconButton>
                    )}

                    <IconButton
                        bg={'brand.400'}
                        color={'white'}
                        aria-label={'Página anterior'}
                        onClick={() => setPageIndex(pageIndex + 1)}
                        size={'sm'}
                    >
                        <MdKeyboardArrowRight />
                    </IconButton>
                </HStack>
            </HStack>
        </HStack>
    );
}
