import { Input } from "@/components/Form/Input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createListCollection,
  type ListCollection,
  Stack,
} from "@chakra-ui/react";
import { type Resolver, type SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import { api } from "@/services/api";
import { handleError, type IApiError } from "@/utils/exceptionHandler";
import { use, useState } from "react";
import { toaster } from "../ui/toaster";
import { Select } from "../Form/Select";
import { MEMBER_TYPES_WITH_NAMES, MemberTypes } from "@/constants/MemberTypes";
import type { ICollection } from "@/interfaces/ICollection";
import type { IProfile } from "@/interfaces/IProfile";
import type { AxiosError } from "axios";

type PersonalDataFormType = {
  name: string;
  memberType?: number;
};

interface PersonalDataFormProps {
  isAdminEdit?: boolean;
  memberId?: string;
  memberPromise: Promise<IProfile>;
}

export function PersonalDataFormManager({
  isAdminEdit,
  memberId,
  memberPromise,
}: PersonalDataFormProps) {
  const member = use(memberPromise);

  const [memberTypes] = useState<ListCollection<ICollection>>(() => {
    return createListCollection({
      items: MEMBER_TYPES_WITH_NAMES.filter(
        (type) => Number(type.value) !== MemberTypes.TeamMember
      ),
    });
  });

  const createFormSchema = zod.object({
    name: zod
      .string()
      .min(5, "O nome deve ter no mínimo 5 caracteres")
      .refine((value) => value.split(" ").length > 1, {
        message: "É obrigatório informar o nome completo",
      }),
    memberType: zod.coerce
      .number({ message: "Informe um tipo de membro válido" })
      .optional()
      .refine(
        (value) => {
          if (!isAdminEdit) return true;
          return value !== undefined;
        },
        {
          message: "Informe um tipo de membro válido",
        }
      ),
  });

  const { register, handleSubmit, formState, reset } =
    useForm<PersonalDataFormType>({
      resolver: zodResolver(createFormSchema) as Resolver<PersonalDataFormType>,
    });

  const { errors, isSubmitting, isDirty } = formState;

  const handleUpdate: SubmitHandler<PersonalDataFormType> = async (data) => {
    try {
      if (isAdminEdit && memberId) {
        await api.put(`members/${memberId}/manager/profile`, data);
      } else {
        await api.put("members/profile", data);
      }
      toaster.success({ title: "Dados atualizados com sucesso" });
      reset(data);
    } catch (error: unknown) {
      handleError(error as AxiosError<IApiError>);
    }
  };

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit(handleUpdate)}
      gap={4}
      py={4}
      mb={[36, 10]}
    >
      <Input
        type="text"
        label="Nome completo"
        defaultValue={member.name}
        {...register("name")}
        errorText={errors.name?.message}
        fontSize="16px"
        isCard={false}
      />
      {isAdminEdit && (
        <Select
          collection={memberTypes}
          defaultValue={[member.memberType.toString()]}
          label="Perfil"
          {...register("memberType")}
          errorText={errors.memberType?.message}
          isCard={false}
          disabled={member.memberType === MemberTypes.TeamMember}
        />
      )}
      <Input
        type="email"
        disabled
        defaultValue={member.email}
        label="E-mail"
        isCard={false}
      />
      <Button
        type="submit"
        colorPalette="brand"
        alignSelf="flex-end"
        mt={2}
        disabled={!isDirty}
        loading={isSubmitting}
      >
        Salvar alterações
      </Button>
    </Stack>
  );
}
