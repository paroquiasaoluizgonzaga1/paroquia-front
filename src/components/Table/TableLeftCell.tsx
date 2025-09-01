import { TableCell, type TableCellProps } from "@chakra-ui/react";

export function TableLeftCell({
  children,
  ...rest
}: React.PropsWithChildren<TableCellProps>) {
  return (
    <TableCell
      borderLeftRadius={"10px"}
      fontWeight={"bold"}
      pl={6}
      color={{ base: "gray.700", _dark: "white" }}
      borderWidth={"1px"}
      borderColor={{ base: "transparent", _dark: "gray.700" }}
      borderRight="none"
      {...rest}
    >
      {children}
    </TableCell>
  );
}
