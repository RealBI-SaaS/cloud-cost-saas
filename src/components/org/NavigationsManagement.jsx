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
import { navIcons } from "@/assets/iconMap";

const NavigationManagement = () => {
  const { loading, setLoading } = useUser();
  const [label, setLabel] = useState("");
  const { currentOrg } = useOrg();
  const { navigations, fetchNavigations } = useOrg();
  const [navigationGettingEdited, setNavigationGettingEdited] = useState(null);
  const [newNavigationLabel, setNewNavigationLabel] = useState(null);
  const [icon, setIcon] = useState("");
  const [newIcon, setNewIcon] = useState("");

  const handleNavigationCreation = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
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
      await axiosInstance.patch(
        `/organizations/navigation/${navigationGettingEdited}/`,
        {
          organization: currentOrg.id,
          label: newNavigationLabel,
          icon: newIcon,
        },
      );
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
    <div className="container mx-auto p-6">
      <Card className="w-full shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Manage {currentOrg?.name} Navigations
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
                <h3 className="text-lg font-medium">Current Navigations</h3>
                {navigations.length > 0 ? (
                  <div className="space-y-2">
                    {navigations.map((navigation, ind) => (
                      <div
                        key={navigation.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        {navigationGettingEdited === navigation.id ? (
                          <form
                            className="flex flex-col gap-4 w-full p-4 "
                            onSubmit={handleNavigationEdit}
                          >
                            <div className="flex flex-col gap-1">
                              <label
                                htmlFor="navigation-label"
                                className="text-sm font-medium text-gray-700"
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
                              <span className="text-sm font-medium text-gray-700">
                                Select an Icon
                              </span>
                              <div className="grid grid-cols-4 gap-2 p-2 border rounded-md">
                                {Object.entries(navIcons).map(
                                  ([name, Icon]) => (
                                    <Button
                                      key={name}
                                      type="button"
                                      variant={
                                        newIcon === name ? "default" : "outline"
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
                            </div>

                            <div className="flex justify-between items-center">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setNavigationGettingEdited(null)}
                              >
                                <X className="h-4 w-4" />
                                cancel
                              </Button>
                              <Button
                                type="submit"
                                size="sm"
                                className="!text-white"
                              >
                                Save
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
                <h3 className="text-lg font-medium">Create New Navigation</h3>
                <form onSubmit={handleNavigationCreation} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="navigation-label"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      required
                      placeholder="Enter navigation label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Select Icon</Label>
                    <div className="grid grid-cols-4 gap-2 p-2 border rounded-md">
                      {Object.entries(navIcons).map(([name, Icon]) => (
                        <Button
                          key={name}
                          type="button"
                          variant={icon === name ? "default" : "outline"}
                          size="sm"
                          className="flex flex-col items-center gap-1 h-auto py-2"
                          onClick={() => {
                            setIcon(name);
                          }}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-xs">{name}</span>
                        </Button>
                      ))}
                    </div>
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
