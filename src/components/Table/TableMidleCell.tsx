import { TableCell, type TableCellProps } from "@chakra-ui/react";

export function TableMidleCell({
  children,
  ...rest
}: React.PropsWithChildren<TableCellProps>) {
  return (
    <TableCell
      {...rest}
      borderWidth={"1px"}
      borderColor={{ base: "transparent", _dark: "gray.700" }}
      borderX="none"
    >
      {children}
    </TableCell>
  );
}
