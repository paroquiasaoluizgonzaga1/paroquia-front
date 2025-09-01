import { PendingMembersTable } from "@/components/Admin/Members/PendingMembersTable";
import { CardSkeleton } from "@/components/Card/CardSkeleton";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";
import { PageHeading } from "@/components/PageHeading";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { toaster } from "@/components/ui/toaster";
import type { IPageFilter } from "@/interfaces/IPageFilter";
import type { IPendingMember } from "@/interfaces/IPendingMember";
import { DefaultPage } from "@/layouts/DefaultPage";
import { api } from "@/services/api";
import { handleError, type IApiError } from "@/utils/exceptionHandler";
import {
  HStack,
  Icon,
  useBreakpointValue,
  useDisclosure,
  Stack,
  For,
  Button,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { LuCirclePlus, LuTimer } from "react-icons/lu";
import { PendingMemberCard } from "@/components/Admin/Members/PendingMemberCard";
import { EmptyList } from "@/components/EmptyList";
import { AddPendingMemberModal } from "@/components/Admin/Members/AddPendingMemberModal";

export function PendingMembers({ isFromManager }: { isFromManager?: boolean }) {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
  });

  const { onOpen, open, onClose } = useDisclosure();

  const [isLoaded, setIsLoaded] = useState(false);
  const [members, setMembers] = useState<IPendingMember[]>([]);
  const [filters, setFilters] = useState<IPageFilter>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchMembers = () => {
    setIsLoaded(false);

    api
      .get<IPendingMember[]>("pendingMembers", {
        params: filters,
      })
      .then((resp) => setMembers(resp.data))
      .catch((err) => handleError(err))
      .finally(() => setIsLoaded(true));
  };

  const handleDelete = (id: string): void => {
    api
      .delete("/pendingMembers", {
        params: {
          id: id,
        },
      })
      .then(() => {
        toaster.success({ title: "Convite excluído com sucesso" });
        filter();
      })
      .catch((err: AxiosError<IApiError>) => {
        handleError(err);
      });
  };

  const setPageSize = (pageSize: number) => {
    setFilters((state: IPageFilter) => {
      return {
        ...state,
        pageSize,
      };
    });
  };

  const setPageIndex = (pageIndex: number) => {
    setFilters((state: IPageFilter) => {
      return {
        ...state,
        pageIndex,
      };
    });
  };

  const setSearch = (value: string) => {
    setFilters((state: IPageFilter) => {
      return {
        ...state,
        search: value.trim(),
      };
    });
  };

  const filter = () => {
    if (filters.pageIndex == 0) fetchMembers();
    else setPageIndex(0);
  };

  const handleAdd = () => {
    filter();
    onClose();
  };

  useEffect(() => {
    fetchMembers();
  }, [filters.pageSize, filters.pageIndex]);

  return (
    <DefaultPage>
      <CustomBreadcrumb
        items={[
          { title: "Home", link: "/" },
          {
            title: isFromManager ? "Clientes" : "Membros",
            link: isFromManager ? "/admin/clientes" : "/admin/membros",
          },
        ]}
        current="Convites"
      />
      <HStack my={6} justify={"space-between"}>
        <PageHeading icon={<LuTimer />}>Convites</PageHeading>
        <Button colorPalette={"brand"} onClick={onOpen}>
          <Icon fontSize={"sm"}>
            <LuCirclePlus />
          </Icon>
          Adicionar
        </Button>
      </HStack>
      <SearchBar
        onSearch={setSearch}
        onKeyPress={filter}
        placeholder="Busque por nome ou e-mail"
      />
      {isWideVersion && (
        <PendingMembersTable
          isLoaded={isLoaded}
          members={members}
          deleteAction={handleDelete}
        />
      )}
      {!isWideVersion && isLoaded && (
        <Stack mt={8} gap={4}>
          <For each={members} fallback={<EmptyList />}>
            {(member) => (
              <PendingMemberCard
                key={member.id}
                member={member}
                deleteAction={handleDelete}
              />
            )}
          </For>
        </Stack>
      )}
      {!isWideVersion && !isLoaded && <CardSkeleton count={10} />}
      <Pagination
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        pageIndex={filters.pageIndex}
        pageSize={filters.pageSize}
      />
      <AddPendingMemberModal
        isOpen={open}
        onCancel={onClose}
        onConfirm={handleAdd}
      />
    </DefaultPage>
  );
}
