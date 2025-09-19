import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { ReactNode, useState } from "react";
import { Separator } from "./ui/separator";

interface Field {
  name: string; // Label to show
  value?: string; // Initial value
  placeholder?: string;
  type?: string; // Input type (text, number, email, etc.)
}

interface Props {
  title?: string;
  message?: string;
  triggerBtn: ReactNode;
  fields: Field[];
  onConfirm?: (data: Record<string, string>) => void;
}

export function DataEditModal({
  title = "Update",
  message,
  triggerBtn,
  fields,
  onConfirm,
}: Props) {
  const [formData, setFormData] = useState<Record<string, string>>(() =>
    fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.value ?? "",
      }),
      {}
    )
  );

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onConfirm?.(formData);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{triggerBtn}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {title}
          </AlertDialogTitle>
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}{" "}
          <Separator />
        </AlertDialogHeader>

        <div className="flex flex-col gap-3 py-2">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                {field.name}
              </label>
              <Input
                type={field.type || "text"}
                placeholder={field.placeholder || field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="placeholder:text-muted-foreground/70 font-medium text-primary"
              />
            </div>
          ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSave}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
