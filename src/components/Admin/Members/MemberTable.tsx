import { ActionButtons } from "@/components/ActionButtons";
import { BaseTable } from "@/components/BaseTable";
import { EmptyList } from "@/components/EmptyList";
import { TableLeftCell } from "@/components/Table/TableLeftCell";
import { TableMidleCell } from "@/components/Table/TableMidleCell";
import { TableRightCell } from "@/components/Table/TableRightCell";
import { TableRow } from "@/components/Table/TableRow";
import { TableSkeleton } from "@/components/Table/TableSkeleton";
import type { IMember } from "@/interfaces/IMember";
import { For } from "@chakra-ui/react";

interface MembersTableProps {
  members: IMember[];
  isLoaded: boolean;
  deleteAction: (id: string) => void;
  editAction: (id: string) => void;
}

export function MembersTable({
  members,
  isLoaded,
  deleteAction,
  editAction,
}: MembersTableProps) {
  return (
    <>
      <BaseTable headers={["Nome", "E-mail", "CPF", "Perfil"]}>
        {members && isLoaded && members.length > 0 && (
          <For each={members}>
            {(member) => (
              <TableRow key={member.id}>
                <TableLeftCell>{member.fullName}</TableLeftCell>
                <TableMidleCell>{member.email}</TableMidleCell>
                <TableMidleCell>{member.cpf ?? "Não informado"}</TableMidleCell>
                <TableMidleCell>{member.memberType}</TableMidleCell>
                <TableRightCell>
                  <ActionButtons
                    id={member.id}
                    alertDescription={`Tem certeza de que você deseja excluir o membro ${member.fullName}?`}
                    alertTitle={"Excluir membro"}
                    deleteAction={deleteAction}
                    editAction={editAction}
                  />
                </TableRightCell>
              </TableRow>
            )}
          </For>
        )}
      </BaseTable>
      {!isLoaded && <TableSkeleton count={10} />}
      {(!members || members.length == 0) && isLoaded && <EmptyList />}
    </>
  );
}
