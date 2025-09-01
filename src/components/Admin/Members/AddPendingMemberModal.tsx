import { type Resolver, type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
  Button,
  createListCollection,
  Heading,
  Stack,
  type ListCollection,
} from "@chakra-ui/react";
import { api } from "@/services/api";
import { toaster } from "@/components/ui/toaster";
import { handleError, type IApiError } from "@/utils/exceptionHandler";
import { Input } from "@/components/Form/Input";
import { useEffect, useState } from "react";
import { MEMBER_TYPES_WITH_NAMES, MemberTypes } from "@/constants/MemberTypes";
import { Select } from "@/components/Form/Select";
import { authStore } from "@/stores/authStore";
import { Textarea } from "@/components/Form/TextArea";
import type { ICollection } from "@/interfaces/ICollection";
import type { AxiosError } from "axios";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";

interface AddPendingMemberModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

interface IAddPendingMemberDTO {
  fullName: string;
  email: string;
  memberType: number;
  observation?: string;
}

export function AddPendingMemberModal({
  isOpen,
  onCancel,
  onConfirm,
}: AddPendingMemberModalProps) {
  const { isAdmin } = authStore();

  const createFormSchema = zod.object({
    fullName: zod.string().min(4, "É obrigatório informar o nome completo"),
    email: zod.email("É obrigatório informar o e-mail"),
    memberType: zod.coerce.number({
      message: "Informe um tipo de membro válido",
    }),
    observation: zod.string().optional(),
  });

  const { register, handleSubmit, reset, formState, setValue } =
    useForm<IAddPendingMemberDTO>({
      resolver: zodResolver(createFormSchema) as Resolver<IAddPendingMemberDTO>,
      defaultValues: {
        fullName: "",
        email: "",
        memberType: MemberTypes.Member,
        observation: "",
      },
    });

  const [roles] = useState<ListCollection<ICollection>>(() =>
    createListCollection({
      items: MEMBER_TYPES_WITH_NAMES,
    })
  );

  const handleCreate: SubmitHandler<IAddPendingMemberDTO> = async (data) => {
    const endpoint = "pendingMembers";

    try {
      await api.post<IAddPendingMemberDTO>(endpoint, data);
      toaster.success({
        title: "Sucesso",
        description: "Convite enviado com sucesso",
      });
      onConfirm();
    } catch (err) {
      handleError(err as AxiosError<IApiError>);
      onCancel();
    }
  };
  const { errors, isSubmitting } = formState;

  const setMemberTypeValue = (ev: string[]) => {
    setValue("memberType", parseInt(ev[0]), { shouldValidate: true });
  };

  useEffect(() => {
    if (isOpen && !isAdmin) {
      setValue("memberType", MemberTypes.Manager);
    }
    if (!isOpen) reset();
  }, [isOpen]);

  return (
    <DialogRoot open={isOpen} size={["xs", "sm", "sm", "sm"]}>
      <DialogContent as={"form"} onSubmit={handleSubmit(handleCreate)}>
        <DialogHeader>
          <Heading>Convidar novo membro</Heading>
        </DialogHeader>
        <DialogBody>
          <Stack gap={4}>
            <Input
              type={"text"}
              label="Nome completo"
              errorText={errors?.fullName?.message}
              {...register("fullName")}
            />
            <Input
              type={"email"}
              label="E-mail"
              errorText={errors?.email?.message}
              {...register("email")}
            />
            {isAdmin && (
              <Select
                label="Perfil"
                errorText={errors?.memberType?.message}
                setValue={setMemberTypeValue}
                collection={roles}
                isInModal={true}
              />
            )}
            <Textarea
              label="Observação"
              errorText={errors?.observation?.message}
              minH={"120px"}
              {...register("observation")}
            />
          </Stack>
        </DialogBody>
        <DialogFooter>
          <Button variant={"outline"} onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            colorPalette={"brand"}
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Salvar
          </Button>
        </DialogFooter>
        <DialogCloseTrigger onClick={onCancel} />
      </DialogContent>
    </DialogRoot>
  );
}
