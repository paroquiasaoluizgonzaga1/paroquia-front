import { ActionButtons } from "@/components/ActionButtons";
import { BaseTable } from "@/components/BaseTable";
import { EmptyList } from "@/components/EmptyList";
import { TableLeftCell } from "@/components/Table/TableLeftCell";
import { TableMidleCell } from "@/components/Table/TableMidleCell";
import { TableRightCell } from "@/components/Table/TableRightCell";
import { TableRow } from "@/components/Table/TableRow";
import { TableSkeleton } from "@/components/Table/TableSkeleton";
import type { IMassLocationList } from "@/interfaces/IMassLocationList";
import { For, Icon } from "@chakra-ui/react";
import { LuCircleCheck } from "react-icons/lu";

interface MassLocationsTableProps {
  massLocationsList: IMassLocationList[];
  isLoaded: boolean;
  deleteAction: (id: string) => void;
  editAction?: (id: string) => void;
}

export function MassLocationsTable({
  massLocationsList,
  isLoaded,
  deleteAction,
  editAction,
}: MassLocationsTableProps) {
  return (
    <>
      <BaseTable headers={["Nome", "Endereço", "Matriz"]}>
        {massLocationsList && isLoaded && massLocationsList.length > 0 && (
          <For each={massLocationsList}>
            {(massLocation) => (
              <TableRow key={massLocation.id}>
                <TableLeftCell>{massLocation.name}</TableLeftCell>
                <TableMidleCell>{massLocation.address}</TableMidleCell>
                <TableMidleCell>
                  {massLocation.isHeadquarters && (
                    <Icon
                      fontSize={"xl"}
                      color={{ base: "brand.600", _dark: "brand.300" }}
                    >
                      <LuCircleCheck />
                    </Icon>
                  )}
                </TableMidleCell>
                <TableRightCell>
                  <ActionButtons
                    id={massLocation.id}
                    alertDescription={
                      "Tem certeza de que você deseja excluir a matriz ou capela?"
                    }
                    alertTitle={"Excluir matriz ou capela"}
                    editAction={editAction}
                    deleteAction={deleteAction}
                  />
                </TableRightCell>
              </TableRow>
            )}
          </For>
        )}
      </BaseTable>
      {!isLoaded && <TableSkeleton count={10} />}
      {(!massLocationsList || massLocationsList.length == 0) && isLoaded && (
        <EmptyList />
      )}
    </>
  );
}
