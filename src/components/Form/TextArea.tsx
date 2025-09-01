import {
  Textarea as ChakraTextarea,
  type TextareaProps,
} from "@chakra-ui/react";
import { Field } from "../ui/field";
import { forwardRef, type ForwardRefRenderFunction } from "react";

interface CustomTextareaProps extends TextareaProps {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
  isRequired?: boolean;
  isCard?: boolean;
}

const TextareaBase: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  CustomTextareaProps
> = (
  {
    label,
    helperText,
    errorText,
    optionalText,
    isRequired = false,
    isCard = true,
    ...rest
  },
  ref
) => {
  return (
    <Field
      invalid={!!errorText}
      label={label}
      helperText={helperText}
      errorText={errorText}
      optionalText={optionalText}
      required={isRequired}
    >
      <ChakraTextarea
        rounded={"md"}
        fontSize={"16px"}
        focusRingColor={{ base: "gray.300", _dark: "gray.700" }}
        bg={isCard ? "transparent" : { base: "white", _dark: "transparent" }}
        borderColor={
          isCard ? "inherit" : { base: "gray.300", _dark: "inherit" }
        }
        ref={ref}
        {...rest}
      />
    </Field>
  );
};

export const Textarea = forwardRef(TextareaBase);
