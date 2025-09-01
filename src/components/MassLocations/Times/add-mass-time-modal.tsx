import { Button, Heading } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Input } from "@/components/Form/Input";
import { useState } from "react";
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
  onConfirm: (time: string) => void;
}

export function AddMassTimeModal({
  isOpen,
  onCancel,
  onConfirm,
}: AddPendingMemberModalProps) {
  const [time, setTime] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!time) {
      toaster.error({
        title: "Erro",
        description: "Informe um horário válido",
      });
      return;
    }
    onConfirm(time);
    setTime(null);
  };

  const handleCancel = () => {
    setTime(null);
    onCancel();
  };

  return (
    <DialogRoot
      open={isOpen}
      size={["xs", "sm", "sm", "sm"]}
      placement={"center"}
    >
      <DialogContent>
        <DialogHeader>
          <Heading>Adicionar horário</Heading>
        </DialogHeader>
        <DialogBody>
          <Input
            type={"time"}
            label="Horário"
            required
            onChange={(e) => setTime(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant={"outline"} onClick={handleCancel}>
            Cancelar
          </Button>
          <Button colorPalette={"brand"} onClick={handleConfirm}>
            Salvar
          </Button>
        </DialogFooter>
        <DialogCloseTrigger onClick={onCancel} />
      </DialogContent>
    </DialogRoot>
  );
}
