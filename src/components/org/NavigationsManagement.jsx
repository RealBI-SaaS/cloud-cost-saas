import { useEffect } from "react";
import ChildNav from "./nav/ChildNavItem";
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axiosInstance from "../../axios/axiosInstance";
import { useState } from "react";
// import { useOrg } from "../../context/OrganizationContext";
//import { useUser } from "../../context/UserContext";
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
import { findNavById } from "@/utils/org/helpers";
import Navigation from "./NavigationListItem";
import { DragOverlay } from "@dnd-kit/core";
import { handleDragStart, handleDragEnd } from "@/misc/DnD";

const NavigationManagement = () => {
  // const { loading, setLoading } = useUser();
  const loading = useUserStore((state) => state.loading);
  const setLoading = useUserStore((state) => state.setLoading);
  const [label, setLabel] = useState("");
  // const { currentOrg } = useOrg();
  // const { navigations, fetchNavigations } = useOrg();
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const setNavigations = useOrgStore((state) => state.setNavigations);
  const navigations = useOrgStore((state) => state.navigations);
  const fetchNavigations = useOrgStore((state) => state.fetchNavigations);
  const [navigationGettingEdited, setNavigationGettingEdited] = useState(null);
  const [newNavigationLabel, setNewNavigationLabel] = useState(null);
  //NOTE: for creation
  const [icon, setIcon] = useState("");
  //NOTE: for edit
  const [newIcon, setNewIcon] = useState("");
  const [parentNavigation, setParentNavigation] = useState(null);
  const [isSubNavigation, setIsSubNavigation] = useState(false);
  const [sortedNavigations, setSortedNavigations] = useState(
    [...navigations].sort((a, b) => a.order - b.order)
  );
  const [activeId, setActiveId] = useState(null);
  const [reordering, setReordering] = useState(false);


  const handleNavigationCreation = async (e) => {
    e.preventDefault();
    if (isSubNavigation && !parentNavigation) {
      console.log("no parent");
      toast.error("No Parent Navigation selected! Please select an one.");
      return;
    }
    try {
      setLoading(true);

      await axiosInstance.post(`/organizations/${currentOrg.id}/navigation/`, {
        organization: currentOrg.id,
        label,
        icon: icon ? icon : "PieChart",
        parent: isSubNavigation ? parentNavigation : null,
      });
      toast.success("Navigation created successfully");
      setLabel("");
      setIcon("");
      setParentNavigation(null);
      setIsSubNavigation(false);
      fetchNavigations();
    } catch (err) {
      console.log("error creating navigation", err);
      toast.error("Failed to create navigation");
    } finally {
      setLoading(false);
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );


  //reorder navs if the edit is canceled
  const sortNavs = () => {
    const sorted = [...navigations].sort((a, b) => a.order - b.order).map((nav) => ({
      ...nav,
      children: [...nav.children].sort((a, b) => a.order - b.order),
    }));

    //console.log('x', sorted)
    setSortedNavigations(sorted);
  };
  useEffect(() => {
    //setSortedNavigations(navigations)
    sortNavs()
    //console.log("SS", sortedNavigations)

  }, [navigations])


  //const handleReorder = async () => {
  //  try {
  //    const payload = {
  //      parent_id: null,
  //      navigations: sortedNavigations.map((nav) => ({
  //        id: nav.id,
  //        order: nav.order,
  //      })),
  //    };
  //
  //    await axiosInstance.patch(
  //      `/organizations/${currentOrg.id}/navigation/reorder/`,
  //      payload
  //    );
  //
  //    setNavigations(sortedNavigations)
  //
  //    setReordering(false)
  //
  //    console.log("Reorder successful");
  //    toast.success("Navigations successfully re-ordered!");
  //  } catch (error) {
  //    console.error("Reorder failed:", error);
  //
  //    toast.error("Failed to re-order navigations");
  //  }
  //};

  const handleReorder = async () => {
    try {
      // Send top-level navigation reordering
      const topLevelPayload = {
        parent_id: null,
        navigations: sortedNavigations.map((nav) => ({
          id: nav.id,
          order: nav.order,
        })),
      };

      await axiosInstance.patch(
        `/organizations/${currentOrg.id}/navigation/reorder/`,
        topLevelPayload
      );

      // Send reorder requests for children of each parent
      for (const nav of sortedNavigations) {
        if (nav.children && nav.children.length > 0) {
          const childPayload = {
            parent_id: nav.id,
            navigations: nav.children.map((child, index) => ({
              id: child.id,
              order: index,
            })),
          };

          await axiosInstance.patch(
            `/organizations/${currentOrg.id}/navigation/reorder/`,
            childPayload
          );
        }
      }

      // After all updates
      setNavigations(sortedNavigations);
      setReordering(false);
      toast.success("Navigations successfully re-ordered!");
      console.log("Reorder successful");
    } catch (error) {
      console.error("Reorder failed:", error);
      toast.error("Failed to re-order navigations");
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
              <div className="space-y-4  overflow-auto">
                <h3 className="text-lg font-medium">Navigations</h3>
                <hr />

                {navigations.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}

                    onDragStart={(e) => handleDragStart(e, setActiveId)}
                    onDragEnd={(e) =>
                      handleDragEnd(
                        e,
                        sortedNavigations,
                        setSortedNavigations,
                        setReordering,
                        setActiveId
                      )
                    }
                    modifiers={[
                      restrictToParentElement,
                      restrictToVerticalAxis // if you want only vertical drag
                    ]}
                  >
                    <SortableContext
                      items={sortedNavigations.map((nav) => nav.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {sortedNavigations.map((navigation, ind) => {
                          //if (navigation.id === activeId) return null;
                          return (
                            <React.Fragment key={navigation.id}>
                              <Navigation ind={ind} navigation={navigation} reordering={reordering} setReordering={setReordering} sortedNavigations={sortedNavigations} setSortedNavigations={setSortedNavigations} activeNavId={activeId} setActiveNavId={setActiveId} />
                              {/* Children rendered, but not sortable */}
                              {/* {navigation.children?.map((childNav, subInd) => (
                              <Navigation
                                key={childNav.id}
                                ind={subInd}
                                navigation={childNav}
                              />
                            ))} */}
                            </React.Fragment>,
                          );
                        })}
                      </div>
                    </SortableContext>
                    <DragOverlay>
                      {activeId ? (
                        <Navigation
                          navigation={navigations.find(
                            (nav) => nav.id === activeId,
                          )}
                          dragOverlay
                        />
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                ) : (
                  <p className="text-muted-foreground">
                    No navigations available. Create one below!
                  </p>
                )}

                {reordering && (
                  <div className="flex justify-end gap-3">
                    <Button className="flex-1" onClick={() => { handleReorder() }}>Save</Button>

                    <Button variant="outline" onClick={() => { setReordering(false); sortNavs() }}>cancel</Button>
                  </div>)}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Create New Navigation</h3>
                <hr />
                <form onSubmit={handleNavigationCreation} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3 space-y-2">
                        <Label
                          htmlFor="navigation-label"
                          className="text-sm font-medium"
                        >
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
                      {isSubNavigation && (
                        <div className="space-y-2 col-span-3">
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
                              {navigations.map(
                                (nav) =>
                                  nav.parent === null && (
                                    <SelectItem key={nav.id} value={nav.id}>
                                      {nav.label}
                                    </SelectItem>
                                  ),
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {!isSubNavigation && (
                        <div className="space-y-2 col-span-3">
                          <Label className="text-sm font-medium">
                            Select Icon
                          </Label>
                          <Collapsible className="w-full">
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full flex items-center justify-between"
                              >
                                <span>
                                  {icon ? `Icon: ${icon}` : "Select Icon"}
                                </span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="grid grid-cols-4 gap-2 p-2 border rounded-md max-h-64 overflow-y-auto mt-2">
                                {Object.entries(navIcons).map(
                                  ([name, Icon]) => (
                                    <Button
                                      key={name}
                                      type="button"
                                      variant={
                                        icon === name ? "default" : "outline"
                                      }
                                      size="sm"
                                      className="flex flex-col items-center gap-1 h-auto py-2"
                                      onClick={() => setIcon(name)}
                                    >
                                      <Icon className="h-4 w-4" />
                                      <span className="text-xs">{name}</span>
                                    </Button>
                                  ),
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sub-nav"
                        checked={isSubNavigation}
                        onCheckedChange={(checked) =>
                          setIsSubNavigation(checked)
                        }
                      />
                      <Label
                        htmlFor="sub-nav"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Make this a sub-navigation
                      </Label>
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
