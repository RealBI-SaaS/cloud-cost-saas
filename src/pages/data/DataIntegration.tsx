import useCompany from "@/stores/CompanyStore";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import useCloudAccountsStore from "@/stores/CloudAccountStore";
import IntegrationSources from "./IntegrationSources.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Cloud,
  Server,
  Database,
  Pencil,
  Trash2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/config/axios/axiosInstance";
import vendorMeta from "@/data/VendorMeta";

const DataIntegration: React.FC = () => {
  const userComp = useCompany((state) => state.userComp);
  const [editedName, setEditedName] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState<any>(null);

  const { accounts, currentAccount, setCurrentAccount, fetchAccounts } =
    useCloudAccountsStore();

  // --- Edit Handlers ---
  const onEditClick = (acc) => {
    setCurrentAccount(acc.id);
    setEditedName(acc.account_name);
  };

  const onCancelEdit = () => {
    setCurrentAccount(null);
    setEditedName("");
  };

  const onEditSubmit = async (accId) => {
    if (!editedName.trim()) {
      toast.error("Account name cannot be empty");
      return;
    }
    try {
      await axiosInstance.patch(
        `${import.meta.env.VITE_BASE_URL}/data/companies/${
          userComp.id
        }/cloud-accounts/${accId}/`,
        { account_name: editedName }
      );
      setCurrentAccount(null);
      setEditedName("");
      fetchAccounts(userComp.id);
      toast.success("Account name updated!");
    } catch (error) {
      console.error("Error updating account name", error);
      toast.error("Failed to update account name");
    }
  };

  // --- Delete Handlers ---
  const handleDeleteClick = (acc) => {
    setSelectedAcc(acc);
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAcc) return;
    try {
      await axiosInstance.delete(
        `${import.meta.env.VITE_BASE_URL}/data/companies/${
          userComp.id
        }/cloud-accounts/${selectedAcc.id}/`
      );
      fetchAccounts(userComp.id);
      setOpen(false);
      setSelectedAcc(null);
      toast.success("Account deleted!");
    } catch (error) {
      console.error("Error deleting account", error);
      toast.error("Failed to delete account!");
    }
  };

  const userHasPermission = (comp) => {
    return comp?.membership?.role !== "member";
  };

  return (
    <div className="flex flex-col h-full p-8 space-y-6">
      <div className="grid grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Data Integrations
          </h1>
          <p className="text-muted-foreground">
            Add and manage your connected cloud accounts
          </p>
        </div>
        {userHasPermission(userComp) && (
          <div className="flex justify-end pr-10">
            <IntegrationSources label="" />
          </div>
        )}
      </div>

      {/* Accounts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => {
          const meta = vendorMeta[acc.vendor] || vendorMeta.AWS;
          const Icon = meta.icon;

          return (
            <Card
              key={acc.id}
              className="border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${meta.badgeColor} text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {currentAccount === acc.id ? (
                    <input
                      className="border border-border rounded p-1 text-black w-3/4"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onEditSubmit(acc.id);
                        }
                        if (e.key === "Escape") {
                          onCancelEdit();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <CardTitle className="text-lg font-semibold">
                      {acc.account_name}
                    </CardTitle>
                  )}
                </div>

                {userHasPermission(userComp) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {currentAccount === acc.id ? (
                        <>
                          <DropdownMenuItem
                            onClick={() => onEditSubmit(acc.id)}
                          >
                            Save
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={onCancelEdit}>
                            Cancel
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => onEditClick(acc)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Name
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteClick(acc)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </CardHeader>

              <CardContent>
                <Badge variant="secondary" className="uppercase">
                  {acc.vendor}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedAcc?.account_name}</span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataIntegration;
