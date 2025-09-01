import { PageHeading } from "@/components/PageHeading";
import { DefaultPage } from "@/layouts/DefaultPage";
import { LuUserCog } from "react-icons/lu";
import { Suspense } from "react";
import { api } from "@/services/api";
import { handleError, type IApiError } from "@/utils/exceptionHandler";
import { useParams } from "react-router-dom";
import type { IProfile } from "@/interfaces/IProfile";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";
import type { AxiosError } from "axios";
import { Spinner } from "@chakra-ui/react";
import { PersonalDataFormManager } from "@/components/Profile/edit-profile-form";

export function EditMember() {
  const { id } = useParams();

  const fetchMemberData = async (): Promise<IProfile> => {
    try {
      const response = await api.get<IProfile>(`members/${id}`);
      return response.data;
    } catch (error: unknown) {
      handleError(error as AxiosError<IApiError>);
    }

    return {} as IProfile;
  };

  return (
    <DefaultPage>
      <CustomBreadcrumb
        items={[
          { title: "Home", link: "/" },
          {
            title: "Membros",
            link: "/admin/membros",
          },
        ]}
        current={`Editar membro`}
      />
      <PageHeading icon={<LuUserCog />} my={6}>
        Editar membro
      </PageHeading>
      <Suspense fallback={<Spinner />}>
        <PersonalDataFormManager
          memberId={id}
          memberPromise={fetchMemberData()}
          isAdminEdit
        />
      </Suspense>
    </DefaultPage>
  );
}
