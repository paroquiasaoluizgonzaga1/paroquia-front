/* eslint-disable @typescript-eslint/no-explicit-any */
import { toaster } from "@/components/ui/toaster";
import { AxiosError } from "axios";

export interface IApiError {
  title: string;
  status: number;
  detail: string;
  errors?: any;
}

export function handleError(
  error: AxiosError<IApiError>,
  title: string = "Erro"
) {
  if (error.response?.data?.detail) {
    toaster.error({
      title: title,
      description: getMessageFromDetail(error.response?.data?.detail),
    });
  } else if (error.response?.data?.errors) {
    throwErrorFromErrorsObject(error.response?.data?.errors, title);
  } else if (error?.response?.status === 403) {
    toaster.error({
      title: "Sem permissão",
      description: "Você não possui privilégios para realizar essa ação",
    });
  } else {
    toaster.error({
      title: title,
      description:
        "Erro ao processar a sua requisição. Por favor, tente novamente",
    });
  }
}

const getMessageFromDetail = (detail: string): string => {
  return detail.split("*")[1];
};

const throwErrorFromErrorsObject = (error: any, title: string): void => {
  Object.keys(error).forEach((prop) => {
    const mensagensDeErro = error[prop];
    mensagensDeErro.forEach((message: string) => {
      toaster.error({
        title: title,
        description: message,
      });
    });
  });
};
