import { Field } from "../ui/field";
import { forwardRef, type ForwardRefRenderFunction } from "react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import {
  SelectItemText,
  Span,
  type SelectRootProps,
  Stack,
  SelectIndicatorGroup,
  SelectClearTrigger,
  SelectControl,
  SelectIndicator,
  Text,
} from "@chakra-ui/react";

interface CustomSelectProps extends SelectRootProps {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
  setValue?: (value: string[]) => void;
  isInModal?: boolean;
  isRequired?: boolean;
  isCard?: boolean;
  placeholder?: string;
  allowClear?: boolean;
  obs?: string;
}

const SelectBase: ForwardRefRenderFunction<
  HTMLInputElement,
  CustomSelectProps
> = (
  {
    label,
    helperText,
    errorText,
    optionalText,
    setValue,
    isInModal = false,
    isRequired = false,
    isCard = true,
    placeholder,
    allowClear = false,
    obs = undefined,
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
      {obs && (
        <Text fontSize={"xs"} color={{ base: "gray.500", _dark: "gray.400" }}>
          *{obs}
        </Text>
      )}
      <SelectRoot
        onValueChange={({ value }) => setValue?.(value)}
        borderColor={
          isCard ? "inherit" : { base: "gray.300", _dark: "inherit" }
        }
        bg={isCard ? "transparent" : { base: "white", _dark: "transparent" }}
        focusRingColor={{ base: "gray.400", _dark: "gray.700" }}
        rounded={"lg"}
        {...rest}
        ref={ref}
      >
        <SelectControl>
          <SelectTrigger>
            <SelectValueText placeholder={placeholder} />
          </SelectTrigger>
          {allowClear && (
            <SelectIndicatorGroup>
              <SelectClearTrigger />
              <SelectIndicator />
            </SelectIndicatorGroup>
          )}
        </SelectControl>
        <SelectContent portalled={!isInModal}>
          {rest.collection.items.map((c) => (
            <SelectItem item={c} key={c.value}>
              {c.description != "" ? (
                <Stack gap="0">
                  <SelectItemText>{c.label}</SelectItemText>
                  <Span color="fg.muted" textStyle="xs">
                    {c.description}
                  </Span>
                </Stack>
              ) : (
                <SelectItemText>{c.label}</SelectItemText>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Field>
  );
};

export const Select = forwardRef(SelectBase);
