import { useEffect } from "react";
import axiosInstance from "../../axios/axiosInstance";
import { useState } from "react";
import { useOrg } from "../../context/OrganizationContext";
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

const NavigationManagement = () => {
  // const { loading, setLoading } = useUser();
  const loading = useUserStore((state)=>state.loading)
  const setLoading = useUserStore((state)=>state.setLoading)
  const [label, setLabel] = useState("");
  const { currentOrg } = useOrg();
  const { navigations, fetchNavigations } = useOrg();
  const [navigationGettingEdited, setNavigationGettingEdited] = useState(null);
  const [newNavigationLabel, setNewNavigationLabel] = useState(null);
  //NOTE: for creation
  const [icon, setIcon] = useState("");
  //NOTE: for edit
  const [newIcon, setNewIcon] = useState("");

  const handleNavigationCreation = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!icon) {
        toast.error("No Icon selected! Please select an icon.");
        return;
      }
      await axiosInstance.post(`/organizations/navigation/`, {
        organization: currentOrg.id,
        label,
        icon,
      });
      toast.success("Navigation created successfully");
      setLabel("");
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
                    {navigations.map((navigation, ind) => (
                      <div
                        key={navigation.id}
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
                                  setNewIcon(navigation.icon); // 👈 set icon being edited
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
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No navigations available. Create one below!
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Create New </h3>
                <hr />
                <form
                  onSubmit={handleNavigationCreation}
                  className=" space-y-4 grid items-end"
                >
                  <Collapsible className="grid grid-cols-4 gap-2">
                    <Input
                      id="navigation-label"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      required
                      placeholder="Enter navigation label"
                      className="col-span-3"
                    />
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <span>{icon ? `Icon: ${icon}` : "Select Icon"}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="col-span-4">
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
                  <Button type="submit" className="w-3/4 sm:w-auto ">
                    <Plus className="h-4 w-4 mr-2" />
                    Create
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
