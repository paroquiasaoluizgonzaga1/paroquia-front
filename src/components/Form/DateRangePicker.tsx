import {
  createListCollection,
  HStack,
  type ListCollection,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";

interface DateRangePickerProps {
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  disabled: boolean;
  initialMonth?: number;
  initialYear?: number;
}

interface ICollection {
  label: string;
  value: string;
}

interface InitialDate {
  month: string[];
  year: string[];
}

export function DateRangePicker({
  setMonth,
  setYear,
  disabled,
  initialMonth,
  initialYear,
}: DateRangePickerProps) {
  const [initialDate] = useState<InitialDate>(() => {
    const m = initialMonth ?? new Date().getMonth() + 1;
    const y = initialYear ?? new Date().getFullYear();

    return {
      month: [m.toString()],
      year: [y.toString()],
    };
  });

  const [months] = useState<ListCollection<ICollection>>(() => {
    return createListCollection<ICollection>({
      items: [
        { value: "1", label: "Janeiro" },
        { value: "2", label: "Fevereiro" },
        { value: "3", label: "Março" },
        { value: "4", label: "Abril" },
        { value: "5", label: "Maio" },
        { value: "6", label: "Junho" },
        { value: "7", label: "Julho" },
        { value: "8", label: "Agosto" },
        { value: "9", label: "Setembro" },
        { value: "10", label: "Outubro" },
        { value: "11", label: "Novembro" },
        { value: "12", label: "Dezembro" },
      ],
    });
  });

  const [years] = useState<ListCollection<ICollection>>(() => {
    const currentYear = new Date().getFullYear();
    const yearRange = Array.from({ length: 12 }, (_, i) => currentYear - 2 + i);

    return createListCollection<ICollection>({
      items: yearRange.map((yy) => ({
        value: yy.toString(),
        label: yy.toString(),
      })),
    });
  });

  const handleMonthChange = (value: string[]) => {
    setMonth(parseInt(value[0]));
  };

  const handleYearChange = (value: string[]) => {
    setYear(parseInt(value[0]));
  };

  useEffect(() => {
    if (!disabled) {
      setMonth(parseInt(initialDate.month[0]));
      setYear(parseInt(initialDate.year[0]));
    }
  }, [disabled]);

  return (
    <HStack gap={4} justify={"flex-start"} minW={"300px"}>
      <SelectRoot
        maxW={["130px", "200px"]}
        defaultValue={initialDate.month}
        collection={months}
        onValueChange={({ value }) => handleMonthChange(value)}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValueText />
        </SelectTrigger>
        <SelectContent>
          {months.items.map((c) => (
            <SelectItem item={c} key={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
      <SelectRoot
        defaultValue={initialDate.year}
        collection={years}
        onValueChange={({ value }) => handleYearChange(value)}
        maxW={"100px"}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValueText />
        </SelectTrigger>
        <SelectContent>
          {years.items.map((c) => (
            <SelectItem item={c} key={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </HStack>
  );
}
