"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Building2, Plus, ChevronRight } from "lucide-react";
import { useOrg } from "@/context/OrganizationContext";
import { useNavigate } from "react-router-dom";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export const orgNavItems: NavItem[] = [
  {
    title: "Organizations",
    href: "#organizations",
    icon: <Building2 className="h-5 w-5" />,
  },
];

export default function OrganizationSettings() {
  const navigate = useNavigate();
  const { createOrganization, userOrgs, setCurrentOrg } = useOrg();
  const [showNewOrgForm, setShowNewOrgForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [organizations, setOrganizations] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const orgs = userOrgs.map((org) => ({
      id: org.id,
      name: org.name,
    }));
    setOrganizations(orgs);
  }, [userOrgs]);

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrgName.trim()) {
      createOrganization(newOrgName);
      toast.success(`${newOrgName} has been created successfully.`);
      setNewOrgName("");
      setShowNewOrgForm(false);
    }
  };

  const handleOrgClick = (org: { id: number; name: string }) => {
    setCurrentOrg(org);
    navigate('/settings/organization/detail/');
  };

  return (
    <div className="space-y-6 mx-10 my-5 ">
      <Card className="shadow-none border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <CardTitle>Your Organizations</CardTitle>
            </div>
            <Button
              size="sm"
              onClick={() => setShowNewOrgForm(!showNewOrgForm)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Organization
            </Button>
          </div>
          <CardDescription>
            Manage your organizations and teams.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showNewOrgForm && (
            <form
              onSubmit={handleCreateOrg}
              className="mb-6 p-4 border rounded-lg"
            >
              <h3 className="text-sm font-medium mb-3">
                Create New Organization
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  {/* <Label htmlFor="orgName">Organization Name</Label> */}
                  <Input
                    id="orgName"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="Enter organization name"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowNewOrgForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="!text-white" disabled={!newOrgName.trim()}>
                    Create
                  </Button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => handleOrgClick(org)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
                    {org.name.charAt(0)}
                  </div>
                  <span className="font-medium">{org.name}</span>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 