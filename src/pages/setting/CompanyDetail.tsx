import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import OrganizationContext from "@/context/OrganizationContext";
import useCompany from "@/hooks/useCompany";
import company_service from "@/services/company_service";
import { Building2, Plus, Edit3, Eye, Save } from "lucide-react";
import React, { FormEvent, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyDetail = () => {
  const { companies, setCompany, error, isLoading } = useCompany();
  const { organizations } = useContext(OrganizationContext);
  const [companyDetail, setCompanyDetail] = useState({
    name: "",
    theme: "light",
    created_at: "",
    updated_at: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (companies.length > 0) {
      setCompanyDetail({
        name: companies[0].name || "",
        theme: companies[0].theme || "light",
        created_at: companies[0].created_at || "",
        updated_at: companies[0].updated_at || "",
      });
    }
    // if (organizations.length > 0 && companies.length === 0) {
    //   company_service.getCompany(organizations[0].company).then((res) => {
    //     setCompanyDetail(res.data);
    //   });
      //   setCompanyDetail({
      //     name: organizations[0].company_name || "",
      //     theme: organizations[0].theme || "light",
      //     created_at: organizations[0].created_at || "",
      //     updated_at: organizations[0].updated_at || "",
      //   });
    }
  }, [companies, organizations]);

  const handleCreateOrUpdateCompany = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: companyDetail.name,
      theme: companyDetail.theme,
    };

    const serviceCall =
      companies.length > 0
        ? company_service.updateCompany(companies[0].id, payload)
        : company_service.CreateCompany(payload);

    serviceCall
      .then((res) => {
        toast.success(
          companies.length > 0
            ? "Company updated successfully"
            : "Company created successfully"
        );
        setCompany(res.data);
        setIsEditing(false);
      })
      .catch((e) => {
        toast.error(
          e.response?.data?.message || e.message || "Operation failed"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleInputChange = (field: string, value: string) => {
    setCompanyDetail((prev) => ({ ...prev, [field]: value }));
  };

  const handleThemeChange = (theme: string) => {
    setCompanyDetail((prev) => ({ ...prev, theme }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6  ">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6  ">
        <Card className="border-destructive">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive mb-4">
              <Building2 className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-destructive">
              Error Loading Company Data
            </h3>
            <p className="text-muted-foreground mt-2">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=" ">
      <Card className="border-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                {companies.length > 0 ? "Company Profile" : "Create Company"}
              </CardTitle>
              <CardDescription>
                {companies.length > 0
                  ? "Manage your company information and appearance"
                  : "Set up your company profile to get started"}
              </CardDescription>
            </div>

            {companies.length > 0 && !isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Company Profile
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Company Owner with existing company - Edit Mode */}
          {companies.length >= 1 && isEditing && (
            <form
              onSubmit={handleCreateOrUpdateCompany}
              className="flex flex-col md:flex-row gap-6"
            >
              {/* Left side */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={companyDetail.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Created At</Label>
                    <Input
                      disabled
                      value={
                        companyDetail.created_at
                          ? new Date(companyDetail.created_at).toLocaleString()
                          : "Not available"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Updated</Label>
                    <Input
                      disabled
                      value={
                        companyDetail.updated_at
                          ? new Date(companyDetail.updated_at).toLocaleString()
                          : "Not available"
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="animate-spin mr-2">
                        <Save className="h-4 w-4" />
                      </div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Right side */}
              <div className="flex-1 space-y-2">
                <Label>Theme Preference</Label>
                <div className="flex items-center justify-center h-full">
                  <ThemeSwitcher
                    disabled={false}
                    currentTheme={companyDetail.theme}
                    onChange={handleThemeChange}
                  />
                </div>
              </div>
            </form>
          )}

          {/* Company Owner with existing company - View Mode */}
          {companies.length >= 1 &&
            !isEditing &&
            "not used"
            // <div className="flex flex-col md:flex-row gap-6">
            //   {/* Left side */}
            //   <div className="flex-1 space-y-4">
            //     <div>
            //       <Label className="text-muted-foreground">Company Name</Label>
            //       <p className="text-lg font-semibold">{companies[0].name}</p>
            //     </div>
            //     <div>
            //       <Label className="text-muted-foreground">Created At</Label>
            //       <p className="text-lg">
            //         {companies[0].created_at
            //           ? new Date(companies[0].created_at).toLocaleString()
            //           : "Not available"}
            //       </p>
            //     </div>
            //     <div>
            //       <Label className="text-muted-foreground">Last Updated</Label>
            //       <p className="text-lg">
            //         {companies[0].updated_at
            //           ? new Date(companies[0].updated_at).toLocaleString()
            //           : "Not available"}
            //       </p>
            //     </div>
            //   </div>

            //   {/* Right side */}
            //   <div className="flex-1 space-y-2">
            //     <Label className="text-muted-foreground">Theme</Label>
            //     <div className="flex items-center justify-center h-full">
            //       <ThemeSwitcher
            //         disabled={true}
            //         currentTheme={companies[0].theme || "light"}
            //         onChange={() => {}}
            //       />
            //     </div>
            //   </div>
            // </div>
          }

          {/* Organization Member - View Only */}
          {organizations && companies.length === 0 && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left side */}
              <div className="flex-1 space-y-4">
                <div>
                  <Label className="text-muted-foreground">Company Name</Label>
                  <p className="text-lg font-semibold">
                    {organizations.company?.company_name || "Not set"}
                  </p>
                </div>
              </div>

              {/* Right side */}
              <div className="flex-1 space-y-2">
                <Label className="text-muted-foreground">Theme</Label>
                <div className="flex items-center justify-center h-full">
                  <ThemeSwitcher
                    disabled={true}
                    currentTheme={organizations.company?.theme || "light"}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>
          )}

          {/* No Company or Organization - Create Mode */}
          {!organizations && companies.length === 0 && (
            <form
              onSubmit={handleCreateOrUpdateCompany}
              className="flex flex-col md:flex-row gap-6"
            >
              {/* Left side */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Company Name *</Label>
                  <Input
                    id="create-name"
                    value={companyDetail.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <div className="animate-spin mr-2">
                      <Save className="h-4 w-4" />
                    </div>
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Create Company
                </Button>
              </div>

              {/* Right side */}
              <div className="flex-1 space-y-2">
                <Label>Theme Preference</Label>
                <div className="flex items-center justify-center h-full">
                  <ThemeSwitcher
                    disabled={false}
                    currentTheme={companyDetail.theme}
                    onChange={handleThemeChange}
                  />
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDetail;
