"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Cloud, CloudCog, Server, Plus } from "lucide-react";

export default function VendorSelectModal({
  onNext,
  connectionName,
  setConnectionName,
}) {
  const [vendor, setVendor] = useState("");
  // const [connectionName, setConnectionName] = useState("");
  const [open, setOpen] = useState(false);

  const handleProceed = () => {
    if (vendor && connectionName) {
      setOpen(false);
      onNext({ vendor, connectionName });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          New Connection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="dark:text-foreground">
            Connect Your Cloud Provider
          </DialogTitle>
          <DialogDescription>
            Choose your vendor and name this connection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Connection Name"
            value={connectionName}
            className="dark:text-foreground"
            onChange={(e) => setConnectionName(e.target.value)}
          />

          <RadioGroup
            value={vendor}
            onValueChange={setVendor}
            className="grid grid-cols-3 gap-4"
          >
            <Label
              className="cursor-pointer flex flex-col items-center p-4 border  border-foreground/30 rounded-lg hover:bg-muted dark:text-foreground"
              htmlFor="aws"
            >
              <RadioGroupItem value="aws" id="aws" className="mb-2" />
              <Cloud className="w-6 h-6 text-yellow-500" />
              AWS
            </Label>
            <Label
              className="cursor-pointer flex flex-col items-center p-4 border border-foreground/30 rounded-lg hover:bg-muted dark:text-foreground"
              htmlFor="azure"
            >
              <RadioGroupItem value="azure" id="azure" className="mb-2" />
              <CloudCog className="w-6 h-6 text-blue-500" />
              Azure
            </Label>
            <Label
              className="cursor-pointer flex flex-col items-center p-4 border border-foreground/30 rounded-lg hover:bg-muted dark:text-foreground"
              htmlFor="gcp"
            >
              <RadioGroupItem value="gcp" id="gcp" className="mb-2" />
              <Server className="w-6 h-6 text-red-500" />
              Google
            </Label>
          </RadioGroup>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button className="dark:text-foreground" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleProceed} disabled={!vendor || !connectionName}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
