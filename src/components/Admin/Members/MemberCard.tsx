import { ActionButtons } from "@/components/ActionButtons";
import type { IMember } from "@/interfaces/IMember";
import { Card, HStack, Stack, Text } from "@chakra-ui/react";

interface MemberCardProps {
  member: IMember;
  deleteAction: (id: string) => void;
  editAction: (id: string) => void;
}

export function MemberCard({
  member,
  deleteAction,
  editAction,
}: MemberCardProps) {
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
            CPF {member.cpf ?? "não informado"}
          </Text>
        </Stack>
        <HStack justify={"flex-end"}>
          <ActionButtons
            id={member.id}
            alertDescription={`Tem certeza de que você deseja excluir o membro ${member.fullName}`}
            alertTitle={"Excluir membro"}
            deleteAction={deleteAction}
            editAction={editAction}
          />
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}
