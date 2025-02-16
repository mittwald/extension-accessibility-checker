import { Button, ModalTrigger } from "@mittwald/flow-react-components";
import { CreateModal } from "./createModal.tsx";

export function CreateProfileButton() {
  return (
    <ModalTrigger>
      <Button color="accent">Anlegen</Button>
      <CreateModal />
    </ModalTrigger>
  );
}
