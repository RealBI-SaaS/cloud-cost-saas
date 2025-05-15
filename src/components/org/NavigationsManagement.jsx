import { useEffect } from "react";
import axiosInstance from "../../axios/axiosInstance";
import { useState } from "react";
// import { useOrg } from "../../context/OrganizationContext";
import { useUser } from "../../context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Home,
  Building2,
  Settings,
  User,
  Lock,
  Map,
  Database,
  Calendar,
  Inbox,
  Search,
  ChevronDown,
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { navIcons } from "@/assets/iconMap";
import useUserStore from "@/context/userStore";
import useOrgStore from "@/context/OrgStore";
import { Checkbox } from "@/components/ui/checkbox";

const NavigationManagement = () => {
  // const { loading, setLoading } = useUser();
  const loading = useUserStore((state)=>state.loading)
  const setLoading = useUserStore((state)=>state.setLoading)
  const [label, setLabel] = useState("");
  // const { currentOrg } = useOrg();
  // const { navigations, fetchNavigations } = useOrg();
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const navigations = useOrgStore((state) => state.navigations);
  const fetchNavigations = useOrgStore((state) => state.fetchNavigations);
  const [navigationGettingEdited, setNavigationGettingEdited] = useState(null);
  const [newNavigationLabel, setNewNavigationLabel] = useState(null);
  //NOTE: for creation
  const [icon, setIcon] = useState("");
  //NOTE: for edit
  const [newIcon, setNewIcon] = useState("");
  const [parentNavigation, setParentNavigation] = useState("none");
  const [isSubNavigation, setIsSubNavigation] = useState(false);

  const handleNavigationCreation = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // if (!icon) {
      //   toast.error("No Icon selected! Please select an icon.");
      //   return;
      // }
      await axiosInstance.post(`/organizations/navigation/`, {
        organization: currentOrg.id,
        label,
        icon: icon ? icon : 'PieChart',
        parent: isSubNavigation ? parentNavigation : null,
      });
      toast.success("Navigation created successfully");
      setLabel("");
      setIcon("");
      setParentNavigation("none");
      setIsSubNavigation(false);
      fetchNavigations();
    } catch (err) {
      console.log("error creating navigation", err);
      toast.error("Failed to create navigation");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationEdit = async (e) => {
    e.preventDefault();

    const currentNav = navigations.find(
      (nav) => nav.id === navigationGettingEdited,
    );

    if (
      currentNav &&
      newNavigationLabel === currentNav.label &&
      newIcon === currentNav.icon
    ) {
      toast.info("No changes made.");
      setNavigationGettingEdited(null);
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.patch(
        `/organizations/navigation/${navigationGettingEdited}/`,
        {
          organization: currentOrg.id,
          label: newNavigationLabel,
          icon: newIcon,
        },
      );
      //console.log(res);
      toast.success("Navigation updated successfully");
      setNavigationGettingEdited(null);
      fetchNavigations();
    } catch (err) {
      console.log("error editing navigation", err);
      toast.error("Failed to update navigation");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationDelete = async (navigationId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/organizations/navigation/${navigationId}/`, {
        organization: currentOrg.id,
      });
      toast.success("Navigation deleted successfully");
      fetchNavigations();
    } catch (err) {
      console.log("error deleting navigation", err);
      toast.error("Failed to delete navigation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 ">
      <Card className="w-full shadow-none border-none ">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Manage{" "}
            <span className="text-primary text-2xl">{currentOrg?.name}</span>{" "}
            Navigations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading || !currentOrg ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Navigations</h3>
                <hr />
                {navigations.length > 0 ? (
                  <div className="space-y-2">
                    {navigations
                      .filter(nav => !nav.parent) // Only show parent navigations
                      .map((navigation, ind) => (
                      <div key={navigation.id}>
                        <div
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          {navigationGettingEdited === navigation.id ? (
                            <form
                              className="grid gap-4 w-full p-4 "
                              onSubmit={handleNavigationEdit}
                            >
                              <Collapsible className="grid grid-cols-4 space-x-2">
                                <div className="col-span-3 flex flex-col gap-1 ">
                                  <label
                                    htmlFor="navigation-label"
                                    className="text-sm  mb-1 text-foreground"
                                  >
                                    Navigation Label
                                  </label>
                                  <Input
                                    id="navigation-label"
                                    value={newNavigationLabel}
                                    onChange={(e) =>
                                      setNewNavigationLabel(e.target.value)
                                    }
                                    className="w-full"
                                    placeholder="Enter navigation label"
                                  />
                                </div>

                                <div className="flex flex-col gap-2">
                                  <span className="text-sm text-foreground">
                                    Select an Icon
                                  </span>

                                  <CollapsibleTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="flex items-center gap-2"
                                    >
                                      <span>
                                        {newIcon
                                          ? `Icon: ${newIcon}`
                                          : "Select Icon"}
                                      </span>
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="col-span-4">
                                  <div className="grid grid-cols-4 gap-2 p-2 border rounded-md max-h-64 overflow-y-auto mt-2">
                                    {Object.entries(navIcons).map(
                                      ([name, Icon]) => (
                                        <Button
                                          key={name}
                                          type="button"
                                          variant={
                                            newIcon === name
                                              ? "default"
                                              : "outline"
                                          }
                                          size="sm"
                                          className="flex flex-col items-center gap-1 h-auto py-2"
                                          onClick={() => setNewIcon(name)}
                                        >
                                          <Icon className="h-4 w-4" />
                                          <span className="text-xs">{name}</span>
                                        </Button>
                                      ),
                                    )}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>

                              <div className="grid grid-cols-4 justify-between items-center">
                                <Button
                                  type="submit"
                                  size="sm"
                                  className="col-span-3"
                                >
                                  Save
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => setNavigationGettingEdited(null)}
                                >
                                  <X className="h-4 w-4" />
                                  cancel
                                </Button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="flex items-center gap-4">
                                <span className="text-muted-foreground">
                                  {ind + 1}.
                                </span>
                                <span>{navigation.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setNavigationGettingEdited(navigation.id);
                                    setNewNavigationLabel(navigation.label);
                                    setNewIcon(navigation.icon);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the
                                        navigation "{navigation.label}". This
                                        action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        className="!text-white"
                                        onClick={() =>
                                          handleNavigationDelete(navigation.id)
                                        }
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </>
                          )}
                        </div>
                        
                        {/* Sub-navigations */}
                        {navigation.sub_navigations && navigation.sub_navigations.length > 0 && (
                          <div className="ml-8 mt-2 space-y-2">
                            {navigation.sub_navigations.map((subNavId, subInd) => {
                              const subNav = navigations.find(nav => nav.id === subNavId);
                              if (!subNav) return null;
                              
                              return (
                                <div
                                  key={subNav.id}
                                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors bg-muted/30"
                                >
                                  {navigationGettingEdited === subNav.id ? (
                                    <form
                                      className="grid gap-4 w-full p-4"
                                      onSubmit={handleNavigationEdit}
                                    >
                                      <div className="grid grid-cols-4 space-x-2">
                                        <div className="col-span-3 flex flex-col gap-1">
                                          <label
                                            htmlFor="sub-navigation-label"
                                            className="text-sm mb-1 text-foreground"
                                          >
                                            Sub-navigation Label
                                          </label>
                                          <Input
                                            id="sub-navigation-label"
                                            value={newNavigationLabel}
                                            onChange={(e) =>
                                              setNewNavigationLabel(e.target.value)
                                            }
                                            className="w-full"
                                            placeholder="Enter sub-navigation label"
                                          />
                                        </div>

                                        {/* <div className="flex flex-col gap-2">
                                          <span className="text-sm text-foreground">
                                            Select an Icon
                                          </span>

                                          <CollapsibleTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className="flex items-center gap-2"
                                            >
                                              <span>
                                                {newIcon
                                                  ? `Icon: ${newIcon}`
                                                  : "Select Icon"}
                                              </span>
                                              <ChevronDown className="h-4 w-4" />
                                            </Button>
                                          </CollapsibleTrigger>
                                        </div> */}
                                        {/* <CollapsibleContent className="col-span-4">
                                          <div className="grid grid-cols-4 gap-2 p-2 border rounded-md max-h-64 overflow-y-auto mt-2">
                                            {Object.entries(navIcons).map(
                                              ([name, Icon]) => (
                                                <Button
                                                  key={name}
                                                  type="button"
                                                  variant={
                                                    newIcon === name
                                                      ? "default"
                                                      : "outline"
                                                  }
                                                  size="sm"
                                                  className="flex flex-col items-center gap-1 h-auto py-2"
                                                  onClick={() => setNewIcon(name)}
                                                >
                                                  <Icon className="h-4 w-4" />
                                                  <span className="text-xs">{name}</span>
                                                </Button>
                                              ),
                                            )}
                                          </div>
                                        </CollapsibleContent> */}
                                      </div>

                                      <div className="grid grid-cols-4 justify-between items-center">
                                        <Button
                                          type="submit"
                                          size="sm"
                                          className="col-span-3"
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          onClick={() => setNavigationGettingEdited(null)}
                                        >
                                          <X className="h-4 w-4" />
                                          cancel
                                        </Button>
                                      </div>
                                    </form>
                                  ) : (
                                    <>
                                      <div className="flex items-center gap-4">
                                        <span className="text-muted-foreground">
                                          {ind + 1}.{subInd + 1}
                                        </span>
                                        <span>{subNav.label}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => {
                                            setNavigationGettingEdited(subNav.id);
                                            setNewNavigationLabel(subNav.label);
                                            setNewIcon(subNav.icon);
                                          }}
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>
                                                Are you sure?
                                              </AlertDialogTitle>
                                              <AlertDialogDescription>
                                                This will permanently delete the
                                                sub-navigation "{subNav.label}". This
                                                action cannot be undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>
                                                Cancel
                                              </AlertDialogCancel>
                                              <AlertDialogAction
                                                className="!text-white"
                                                onClick={() =>
                                                  handleNavigationDelete(subNav.id)
                                                }
                                              >
                                                Delete
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No navigations available. Create one below!
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Create New Navigation</h3>
                <hr />
                <form
                  onSubmit={handleNavigationCreation}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3 space-y-2">
                        <Label htmlFor="navigation-label" className="text-sm font-medium">
                          Navigation Label
                        </Label>
                        <Input
                          id="navigation-label"
                          value={label}
                          onChange={(e) => setLabel(e.target.value)}
                          required
                          placeholder="Enter navigation label"
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sub-nav"
                          checked={isSubNavigation}
                          onCheckedChange={(checked) => setIsSubNavigation(checked)}
                        />
                        <Label
                          htmlFor="sub-nav"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Make this a sub-navigation
                        </Label>
                      </div>
                    </div>
                  
                    {isSubNavigation && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Select Parent Navigation
                        </Label>
                        <Select
                          value={parentNavigation}
                          onValueChange={setParentNavigation}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select parent navigation" />
                          </SelectTrigger>
                          <SelectContent>
                            {navigations.map((nav) => 
                              nav.parent === null && (
                                <SelectItem key={nav.id} value={nav.id}>
                                  {nav.label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  
                    {!isSubNavigation && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Select Icon
                        </Label>
                        <Collapsible className="w-full">
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full flex items-center justify-between"
                            >
                              <span>{icon ? `Icon: ${icon}` : "Select Icon"}</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="grid grid-cols-4 gap-2 p-2 border rounded-md max-h-64 overflow-y-auto mt-2">
                              {Object.entries(navIcons).map(([name, Icon]) => (
                                <Button
                                  key={name}
                                  type="button"
                                  variant={icon === name ? "default" : "outline"}
                                  size="sm"
                                  className="flex flex-col items-center gap-1 h-auto py-2"
                                  onClick={() => setIcon(name)}
                                >
                                  <Icon className="h-4 w-4" />
                                  <span className="text-xs">{name}</span>
                                </Button>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Navigation
                  </Button>
                </form>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationManagement;
