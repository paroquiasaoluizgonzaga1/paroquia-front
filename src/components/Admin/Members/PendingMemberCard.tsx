import { ActionButtons } from "@/components/ActionButtons";
import type { IPendingMember } from "@/interfaces/IPendingMember";
import { Card, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { FaRegCopy } from "react-icons/fa6";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";

interface PendingMemberCardProps {
  member: IPendingMember;
  deleteAction: (id: string) => void;
}

export function PendingMemberCard({
  member,
  deleteAction,
}: PendingMemberCardProps) {
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
    <Card.Root
      color={{ base: "gray.700", _dark: "white" }}
      borderWidth={"1px"}
      borderColor={{ base: "transparent", _dark: "gray.700" }}
      bg={{ base: "white", _dark: "gray.800" }}
      shadow={{ base: "md", _dark: "none" }}
      rounded={"xl"}
    >
      <Card.Body
        fontSize={"sm"}
        flexDir={"row"}
        justifyContent={"space-between"}
      >
        <Stack gap={1} flexGrow={1} maxW={"200px"}>
          <Text
            truncate
            whiteSpace={"pre-wrap"}
            wordBreak={"break-all"}
            fontWeight={"bold"}
          >
            {member.fullName}
          </Text>
          <Text truncate color={{ base: "gray.600", _dark: "gray.400" }}>
            {member.email}
          </Text>
          <Text truncate color={{ base: "gray.600", _dark: "gray.400" }}>
            {DateTime.fromISO(member.createdOn)
              .setLocale("pt-BR")
              .toLocaleString(DateTime.DATETIME_MED)}
          </Text>
        </Stack>
        <HStack justify={"flex-end"} gap={2}>
          <Tooltip content={"Copiar link para convite"} openDelay={300}>
            <IconButton
              onClick={() => handleCopy(member.token)}
              variant={"plain"}
              colorPalette={"brand"}
            >
              <FaRegCopy />
            </IconButton>
          </Tooltip>
          <ActionButtons
            id={member.id}
            alertDescription={`Tem certeza de que você deseja excluir o convite para o membro ${member.fullName}?`}
            alertTitle={"Excluir convite"}
            deleteAction={deleteAction}
          />
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}
