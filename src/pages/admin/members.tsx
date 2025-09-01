import { MemberCard } from "@/components/Admin/Members/MemberCard";
import { MembersTable } from "@/components/Admin/Members/MemberTable";
import { CardSkeleton } from "@/components/Card/CardSkeleton";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";
import { EmptyList } from "@/components/EmptyList";
import { PageHeading } from "@/components/PageHeading";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import type { IMember } from "@/interfaces/IMember";
import type { IPageFilter } from "@/interfaces/IPageFilter";
import { DefaultPage } from "@/layouts/DefaultPage";
import { api } from "@/services/api";
import { handleError, type IApiError } from "@/utils/exceptionHandler";
import { For, HStack, Icon, Stack, useBreakpointValue } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { LuTimer } from "react-icons/lu";
import { MdOutlineGroups } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export function Members() {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
  });

  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);
  const [members, setMembers] = useState<IMember[]>([]);
  const [filters, setFilters] = useState<IPageFilter>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchMembers = () => {
    setIsLoaded(false);

    api
      .get<IMember[]>("members", {
        params: filters,
      })
      .then((resp) => setMembers(resp.data))
      .catch((err) => handleError(err))
      .finally(() => setIsLoaded(true));
  };

  const deleteMember = (id: string) => {
    api
      .delete("/members", {
        params: {
          id: id,
        },
      })
      .then(() => {
        toaster.success({ title: "Membro excluído com sucesso" });
        filter();
      })
      .catch((err: AxiosError<IApiError>) => {
        handleError(err);
      });
  };

  const editMember = (id: string) => {
    navigate(`/admin/membros/editar/${id}`);
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

  useEffect(() => {
    fetchMembers();
  }, [filters.pageSize, filters.pageIndex]);

  return (
    <DefaultPage>
      <CustomBreadcrumb
        items={[{ title: "Home", link: ".." }]}
        current="Membros"
      />
      <HStack justify={"space-between"}>
        <PageHeading my={6} icon={<MdOutlineGroups />}>
          Membros
        </PageHeading>
        <Button colorPalette={"brand"} onClick={() => navigate("./convites")}>
          <Icon fontSize={"sm"}>
            <LuTimer />
          </Icon>
          Convites
        </Button>
      </HStack>
      <SearchBar
        onSearch={setSearch}
        onKeyPress={filter}
        placeholder="Busque por nome ou e-mail"
      />
      {isWideVersion && (
        <MembersTable
          isLoaded={isLoaded}
          members={members}
          deleteAction={deleteMember}
          editAction={editMember}
        />
      )}
      {!isWideVersion && isLoaded && (
        <Stack mt={8} gap={4}>
          <For each={members} fallback={<EmptyList />}>
            {(member) => (
              <MemberCard
                key={member.id}
                member={member}
                deleteAction={deleteMember}
                editAction={editMember}
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
    </DefaultPage>
  );
}
