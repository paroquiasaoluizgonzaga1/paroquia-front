import { Flex, Spinner } from "@chakra-ui/react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authStore } from "@/stores/authStore";
import { useColorMode } from "@/components/ui/color-mode";
import { handleError, type IApiError } from "@/utils/exceptionHandler";
import { api } from "@/services/api";
import { toaster } from "@/components/ui/toaster";
import type { IPendingMember } from "@/interfaces/IPendingMember";
import CreatePendingMemberForm from "@/components/PendingMembers/create-pending-member-form";
import type { AxiosError } from "axios";

export default function CreateAccount() {
  const { setColorMode } = useColorMode();
  const { isAuthenticated } = authStore();
  const [query] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);

  const getPendingMemberFromToken = async (): Promise<IPendingMember> => {
    try {
      const response = await api.get<IPendingMember>(
        "pendingMembers/getByToken",
        {
          params: {
            token,
          },
        }
      );

      return response.data;
    } catch (err: unknown) {
      handleError(err as AxiosError<IApiError>);
      toaster.error({
        title:
          "Você será redirecionado para a página de login. Tente novamente mais tarde.",
      });
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
    return {} as IPendingMember;
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const tempToken = query.get("token");

    if (tempToken) {
      setToken(tempToken);
    } else {
      navigate("/login");
    }

    setColorMode("dark");
  }, []);

  return (
    <Flex
      flexDir={"column"}
      maxH={"100vh"}
      justifyContent="flex-start"
      alignItems={"center"}
      overflowY={"auto"}
      pb={[32, 16]}
    >
      {token && (
        <Suspense fallback={<Spinner />}>
          <CreatePendingMemberForm
            memberPromise={getPendingMemberFromToken()}
          />
        </Suspense>
      )}
    </Flex>
  );
}
