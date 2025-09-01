import { Header } from "@/components/Header";
import { NoPrivilegies } from "@/components/NoPrivilegies";
import { Sidebar } from "@/components/Sidebar";
import { authStore } from "@/stores/authStore";
import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export function ManagerLayout() {
  const { isManager, isAuthenticated, signOut } = authStore();

  if (!isAuthenticated) {
    signOut();
  }

  return (
    <Flex maxH={"100vh"} flexDir={"column"} overflow={"hidden"}>
      <Header />
      <Flex h={"calc(100vh - 80px)"} overflow={"hidden"}>
        <Sidebar />
        <Flex w="full" justify={"center"} overflowY={"auto"}>
          {isManager ? <Outlet /> : <NoPrivilegies />}
        </Flex>
      </Flex>
    </Flex>
  );
}
