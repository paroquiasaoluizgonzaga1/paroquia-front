import { Flex, Heading } from '@chakra-ui/react';

export function NoPrivilegies() {
    return (
        <Flex
            bg={{ base: 'white', _dark: 'gray.800' }}
            borderRadius={4}
            p={['6', '8']}
            flexDir={'column'}
            w={'full'}
            h={'full'}
            align={'center'}
            justify={'center'}
        >
            <Heading>Você não possui privilégios para acessar essa página.</Heading>
        </Flex>
    );
}
