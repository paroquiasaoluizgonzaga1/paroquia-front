import type { IAlertProps } from "@/interfaces/IAlertProps";
import { useRef } from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "./ui/dialog";
import { Button } from "./ui/button";

export function Alert({
  onCancel,
  onConfirm,
  isOpen,
  title,
  description = null,
  isDeleteAction = true,
}: IAlertProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <DialogRoot lazyMount open={isOpen}>
      <DialogContent>
        <DialogHeader fontWeight={"semibold"} fontSize={"md"}>
          {title}
        </DialogHeader>
        {description && <DialogBody>{description}</DialogBody>}
        <DialogFooter>
          <DialogActionTrigger>
            <Button
              variant={"outline"}
              ref={cancelRef}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onCancel();
              }}
            >
              Cancelar
            </Button>
          </DialogActionTrigger>
          <Button
            colorPalette={isDeleteAction ? "red" : "blackAlpha"}
            ml={3}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onConfirm();
            }}
          >
            Confirmar
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
