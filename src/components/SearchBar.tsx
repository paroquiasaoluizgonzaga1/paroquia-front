import { Input } from "@chakra-ui/react";
import { InputGroup } from "./ui/input-group";
import { Button } from "./ui/button";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (searchValue: string) => void;
  onKeyPress: () => void;
}

export function SearchBar({
  placeholder,
  onSearch,
  onKeyPress,
}: SearchBarProps) {
  const handleSearch = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      onKeyPress();
    }
  };

  return (
    <InputGroup
      endElement={
        <Button colorPalette={"brand"} mr={"-6px"}>
          Buscar
        </Button>
      }
      endElementProps={{ onClick: () => onKeyPress() }}
      rounded={"lg"}
      w={"100%"}
    >
      <Input
        type={"search"}
        py={6}
        placeholder={placeholder}
        onChange={(ev) => onSearch(ev.target.value)}
        onKeyDown={handleSearch}
        borderColor={{ base: "gray.300", _dark: "gray.800" }}
        focusRingColor={{ base: "brand.300", _dark: "brand.400" }}
        bg={{ base: "white", _dark: "inherit" }}
        rounded={"lg"}
        fontSize={"16px"}
        my={4}
      />
    </InputGroup>
  );
}
