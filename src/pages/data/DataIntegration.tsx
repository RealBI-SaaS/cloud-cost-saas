import useCompany from "@/stores/CompanyStore";

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
  const [integratedAccounts, setIntegratedAccounts] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const { accounts, currentAccount, setCurrentAccount, fetchAccounts } =
    useCloudAccountsStore();

  // Start editing
  const onEditClick = (acc) => {
    setEditingId(acc.id);
    setEditedName(acc.account_name);
  };

  // Cancel editing
  const onCancelEdit = () => {
    setEditingId(null);
    setEditedName("");
  };

  // Submit edited name
  const onEditSubmit = async (accId) => {
    if (!editedName.trim()) {
      alert("Account name cannot be empty");
      return;
    }

    // setLoading(true);
    try {
      await axiosInstance.patch(
        `${import.meta.env.VITE_BASE_URL}/data/companies/${userComp.id}/cloud-accounts/${accId}/`,
        { account_name: editedName },
      );
      setEditingId(null);
      setEditedName("");
      fetchAccounts(userComp.id);
    } catch (error) {
      console.error("Error updating account name", error);
      alert("Failed to update account name");
    }
    //   } finally {
    //     setLoading(false);
    //   }
  };

  // Delete with confirmation
  const onDelete = async (acc) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete account "${acc.account_name}"?`,
    );
    if (!confirmed) return;

    // setLoading(true);
    try {
      await axiosInstance.delete(
        `${import.meta.env.VITE_BASE_URL}/data/companies/${userComp.id}/cloud-accounts/${acc.id}/`,
      );
      fetchAccounts(userComp.id);
    } catch (error) {
      console.error("Error deleting account", error);
      alert("Failed to delete account");
    }
    // } finally {
    //   setLoading(false);
    // }
  };

  // if (loading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-full p-8 text-white">
  //       <h1>Loading...</h1>
  //     </div>
  //   );
  // }

  console.log(userComp);
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

        <div className="flex justify-end pr-10">
          <IntegrationSources />
        </div>
      </div>

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

                  {editingId === acc.id ? (
                    <input
                      className="border rounded p-1 text-black w-3/4"
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

                {userComp.membership.role != "member" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {editingId === acc.id ? (
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
                            onClick={() => onDelete(acc)}
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
    </div>
  );
};

export default DataIntegration;
