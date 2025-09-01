import { Input as ChakraInput, type InputProps } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { forwardRef, type ForwardRefRenderFunction } from "react";

interface CustomInputProps extends InputProps {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
  isRequired?: boolean;
  isCard?: boolean;
}

const InputBase: ForwardRefRenderFunction<
  HTMLInputElement,
  CustomInputProps
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
      <ChakraInput
        rounded={"md"}
        fontSize={"16px"}
        borderColor={
          isCard ? "inherit" : { base: "gray.300", _dark: "inherit" }
        }
        bg={isCard ? "transparent" : { base: "white", _dark: "transparent" }}
        focusRingColor={{ base: "gray.400", _dark: "gray.700" }}
        ref={ref}
        {...rest}
      />
    </Field>
  );
};

export const Input = forwardRef(InputBase);
