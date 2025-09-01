import { Flex, type FlexProps } from "@chakra-ui/react";

export function DefaultPage({
  children,
  ...rest
}: React.PropsWithChildren<FlexProps>) {
  return (
    <Flex w="full" maxW={1000} p={6} {...rest} flexDir={"column"}>
      {children}
    </Flex>
  );
}
