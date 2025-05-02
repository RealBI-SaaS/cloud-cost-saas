"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Check,
  ChevronDown,
  Search,
  ShieldUser,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompany } from "@/context/CompanyContext";
import { useOrg } from "@/context/OrganizationContext";
import axiosInstance from "@/axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import { fetchCompOrgs } from "@/utils/org/fetchers";

export default function CompanySelector() {
  const navigate = useNavigate();
  const { filteredCompanies, loading, searchTerm, handleSearchChange } =
    useCompany();
  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    name: string;
  } | null>(null);
  //const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { setUserComp, setUserOrgs, setCurrentOrg } = useOrg();
  console.log("on adminnn");

  //const companies = [
  //  { id: "1", name: "TechCorp" },
  //  { id: "2", name: "Greenify Inc." },
  //  { id: "3", name: "CloudNine Solutions" },
  //  { id: "4", name: "Innovatek" },
  //  { id: "5", name: "EcoLogix" },
  //];
  //
  //const filteredCompanies = companies.filter((company) =>
  //  company.name.toLowerCase().includes(search.toLowerCase()),
  //);
  //
  //const fetchCompOrgs = async (comp_id) => {
  //  const response = await axiosInstance.get(
  //    `organizations/company/${comp_id}/organizations/`,
  //  );
  //  return response.data;
  //};
  const handleSignIn = async () => {
    if (selectedCompany) {
      console.log(`Signed in as: ${selectedCompany.id}`);
      setUserComp(selectedCompany);
      const orgs = await fetchCompOrgs(selectedCompany.id);
      console.log(orgs);
      setUserOrgs(orgs);
      setCurrentOrg(orgs[0]);

      navigate("/home");
      //set the selected company as user's comp.
      //set all orgs in selected company as userorganizations
    }
  };

  return filteredCompanies ? (
    <div className="h-screen flex flex-col justify-start  ">
      <div className="max-w-md mx-auto grid   mt-20 p-6   shadow-none border rounded-md shadow-md  space-y-6 w-3/4">
        <div className="space-y-1 text-center">
          <ShieldUser className="w-15 h-16 mx-auto text-gray-700" />
          <h1 className="text-2xl font-bold">Welcome, Admin</h1>
          <p className="text-sm text-gray-500">Select a company to continue</p>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedCompany ? selectedCompany.name : "Choose a company..."}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-2 space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search companies..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="max-h-48 overflow-auto">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-muted",
                      selectedCompany?.id === company.id && "bg-muted",
                    )}
                    onClick={() => {
                      setSelectedCompany(company);
                      setOpen(false);
                    }}
                  >
                    <span>{company.name}</span>
                    {selectedCompany?.id === company.id && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground px-3 py-2">
                  No companies found
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          className="w-full"
          disabled={!selectedCompany}
          onClick={handleSignIn}
        >
          Sign in as Company
        </Button>
      </div>
    </div>
  ) : (
    <p>loading</p>
  );
}
