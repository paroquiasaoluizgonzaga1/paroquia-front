import { ActionButtons } from "@/components/ActionButtons";
import { BaseTable } from "@/components/BaseTable";
import { EmptyList } from "@/components/EmptyList";
import { TableLeftCell } from "@/components/Table/TableLeftCell";
import { TableMidleCell } from "@/components/Table/TableMidleCell";
import { TableRightCell } from "@/components/Table/TableRightCell";
import { TableRow } from "@/components/Table/TableRow";
import { TableSkeleton } from "@/components/Table/TableSkeleton";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import type { IPendingMember } from "@/interfaces/IPendingMember";
import { For, IconButton } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { FaRegCopy } from "react-icons/fa6";

interface PendingMembersTableProps {
  members: IPendingMember[];
  isLoaded: boolean;
  deleteAction: (id: string) => void;
}

export function PendingMembersTable({
  members,
  isLoaded,
  deleteAction,
}: PendingMembersTableProps) {
  const handleCopy = (token: string) => {
    navigator.clipboard
      .writeText(window.location.origin + "/criar-conta?token=" + token)
      .then(() =>
        toaster.success({
          title: "Link copiado para a área de transferências com sucesso",
        })
      )
      .catch(() => toaster.error({ title: "Erro ao copiar o link" }));
  };

  return (
    <>
      <BaseTable headers={["Nome", "E-mail", "Enviado em", "Link"]}>
        {members && isLoaded && members.length > 0 && (
          <For each={members}>
            {(member) => (
              <TableRow key={member.id}>
                <TableLeftCell>{member.fullName}</TableLeftCell>
                <TableMidleCell>{member.email}</TableMidleCell>
                <TableMidleCell>
                  {DateTime.fromISO(member.createdOn)
                    .setLocale("pt-BR")
                    .toLocaleString(DateTime.DATETIME_MED)}
                </TableMidleCell>
                <TableMidleCell>
                  <Tooltip content={"Copiar link para convite"} openDelay={300}>
                    <IconButton
                      onClick={() => handleCopy(member.token)}
                      variant={"plain"}
                      colorPalette={"brand"}
                    >
                      <FaRegCopy />
                    </IconButton>
                  </Tooltip>
                </TableMidleCell>
                <TableRightCell>
                  <ActionButtons
                    id={member.id}
                    alertDescription={`Tem certeza de que você deseja excluir o convite para o membro ${member.fullName}?`}
                    alertTitle={"Excluir convite"}
                    deleteAction={deleteAction}
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
