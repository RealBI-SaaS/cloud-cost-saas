// src/components/dialogs/CreateCompanyDialog.tsx
import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onCreateCompany: () => void;
}

const CreateCompanyDialog = ({ open, setOpen, onCreateCompany }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <DialogTitle className="text-lg font-semibold dark:text-foreground">
              No Company Found
            </DialogTitle>
          </div>
          <DialogDescription>
            You are not currently part of any company. You can create a new
            company and invite team members, or contact your administrator to
            send you an invite.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button
            onClick={() => {
              setOpen(false);
              onCreateCompany();
            }}
          >
            Create Company
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCompanyDialog;
