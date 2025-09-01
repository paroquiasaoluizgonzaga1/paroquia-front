import {
  TableRow as ChakraTableRow,
  type TableRowProps,
} from "@chakra-ui/react";

export function TableRow({
  children,
  ...rest
}: React.PropsWithChildren<TableRowProps>) {
  return (
    <ChakraTableRow
      bg={{ base: "white", _dark: "gray.800" }}
      my={0}
      py={0}
      color={{ base: "gray.600", _dark: "gray.400" }}
      shadow={{ base: "sm", _dark: "none" }}
      rounded={"10px"}
      _hover={{ bg: { base: "gray.50", _dark: "gray.700" } }}
      {...rest}
    >
      {children}
    </ChakraTableRow>
  );
}
