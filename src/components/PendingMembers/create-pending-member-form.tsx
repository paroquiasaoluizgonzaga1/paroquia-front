import {
  Flex,
  Button,
  Stack,
  Card,
  Image,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { handleError, type IApiError } from "@/utils/exceptionHandler";
import { api } from "@/services/api";
import { toaster } from "@/components/ui/toaster";
import * as zod from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Form/Input";
import { use, useEffect } from "react";
import type { IPendingMember } from "@/interfaces/IPendingMember";
import type { AxiosError } from "axios";

interface ICreateAccountDTO {
  name: string;
  password: string;
  confirmPassword: string;
  token?: string;
}

export default function CreatePendingMemberForm({
  memberPromise,
}: {
  memberPromise: Promise<IPendingMember>;
}) {
  const navigate = useNavigate();

  const member = use(memberPromise);

  const createFormSchema = zod
    .object({
      name: zod
        .string()
        .min(5, "O nome deve ter no mínimo 5 caracteres")
        .refine((value) => value.split(" ").length > 1, {
          message: "É obrigatório informar o nome completo",
        }),
      password: zod
        .string()
        .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
        .regex(
          /[!@#$%^&*(),.?":{}|<>]/,
          "A senha deve conter pelo menos um caractere especial"
        )
        .min(8, "A senha deve ter pelo menos 8 caracteres"),
      confirmPassword: zod.string(),
      token: zod.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas digitadas devem ser iguais",
      path: ["confirmPassword"],
    });

  const { register, handleSubmit, formState, setValue } =
    useForm<ICreateAccountDTO>({
      resolver: zodResolver(createFormSchema),
    });

  const { errors, isSubmitting } = formState;

  const handleCreate: SubmitHandler<ICreateAccountDTO> = async (data) => {
    try {
      data.token = member.token;

      await api.post<ICreateAccountDTO>("members", data);

      toaster.success({
        title: "Conta criada com sucesso",
        description: "Você será redirecionado para a página de login",
      });

      setTimeout(() => {
        navigate("..");
      }, 1500);
    } catch (err: unknown) {
      handleError(err as AxiosError<IApiError>);
    }
  };

  useEffect(() => {
    setValue("name", member.fullName);
  });

  return (
    <Card.Root
      maxW={["xs", "md"]}
      color={{ base: "gray.700", _dark: "white" }}
      borderWidth={"1px"}
      borderColor={{ base: "transparent", _dark: "gray.800" }}
      bg={{ base: "white", _dark: "gray.900" }}
      shadow={{ base: "md", _dark: "none" }}
      as={"form"}
      onSubmit={handleSubmit(handleCreate)}
      rounded={"xl"}
      mt={12}
    >
      <Card.Header>
        <Flex w="full" justify={"center"}>
          <Image src={"/logo_amitie_dark.png"} maxH={[7, 8]} />
        </Flex>
      </Card.Header>
      <Card.Body>
        <Stack gap={4} w="full">
          <Stack gap={"4"}>
            <Heading as="h4" textAlign={"center"} fontSize={"lg"}>
              Olá, {member.fullName}!
            </Heading>
            <Text color={"brand.400"} fontWeight={"500"} textAlign={"center"}>
              Vamos criar a sua conta para o e-mail {member.email}
            </Text>
            <Input
              type={"text"}
              label="Nome completo"
              {...register("name")}
              errorText={errors.name?.message}
            />
            <Input
              type={"password"}
              label="Senha"
              {...register("password")}
              errorText={errors.password?.message}
            />
            <Input
              type={"password"}
              label="Confirmar Senha"
              {...register("confirmPassword")}
              errorText={errors.confirmPassword?.message}
            />
            <Stack rounded={"lg"} p={4}>
              <Text fontSize={"medium"} fontWeight={"bold"}>
                Algumas dicas para a senha:
              </Text>
              <Text fontSize={"small"}>
                - A senha deve ter pelo menos 8 caracteres
              </Text>
              <Text fontSize={"small"}>
                - A senha deve conter pelo menos uma letra maiúscula
              </Text>
              <Text fontSize={"small"}>
                - A senha deve conter pelo menos um caractere especial
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="center">
        <Button
          variant="solid"
          type={"submit"}
          colorPalette={"brand"}
          disabled={isSubmitting}
        >
          Criar conta
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
