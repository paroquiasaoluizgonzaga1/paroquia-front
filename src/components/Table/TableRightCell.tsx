import { TableCell, type TableCellProps } from "@chakra-ui/react";

export function TableRightCell({
  children,
  ...rest
}: React.PropsWithChildren<TableCellProps>) {
  return (
    <TableCell
      borderRightRadius={"10px"}
      {...rest}
      borderWidth={"1px"}
      borderColor={{ base: "transparent", _dark: "gray.700" }}
      borderLeft="none"
    >
      {children}
    </TableCell>
  );
}
