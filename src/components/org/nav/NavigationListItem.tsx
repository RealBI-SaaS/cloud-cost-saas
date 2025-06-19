import { navIcons } from "@/data/iconMap";

import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Pointer,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useState } from "react";
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
import useUserStore from "@/stores/userStore";
import ChildNav from "./ChildNavItem";
import { handleNavDelete, handleNavEdit } from "@/utils/org/navigationHandlers";
import useOrgStore from "@/stores/OrgStore";
import axiosInstance from "@/config/axios/axiosInstance";

import { handleDragStart, handleDragEnd, handleChildDragEnd } from "@/components/misc/DnD";

export default function Navigation({
  navigation,
  ind,
  reordering,
  setReordering,
  sortedNavigations,
  setSortedNavigations,
  activeNavId,
  setActiveNavId,
}) {
  const setLoading = useUserStore((state) => state.setLoading);
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const navigations = useOrgStore((state) => state.navigations);
  const fetchNavigations = useOrgStore((state) => state.fetchNavigations);
  //dnd stuff
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: navigation.id });
  const ref = useRef();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.2 : 1,
    // 👇 Freeze dimensions to prevent layout shifting
    height: isDragging ? ref?.current?.offsetHeight : undefined,
    width: isDragging ? ref?.current?.offsetWidth : undefined,
  };

  //for child reorder
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );
  //const [childNavs, setChildNavs] = useState(navigation.children);
  //const [activeNavId, setActiveNavId] = useState(null);

  //const [reordering, setReordering] = useState(false);
  //const [sortedChildNavs, setSortedChildNavs] = useState(
  //  [...childNavs].sort((a, b) => a.order - b.order),
  //);
  //const sortNavs = () => {
  //  setSortedChildNavs([...childNavs].sort((a, b) => a.order - b.order));
  //};

  //const handleChildReorder = async () => {
  //  try {
  //    const payload = {
  //      parent_id: null,
  //      //FIX:  include parent
  //      navigations: sortedChildNavs.map((nav) => ({
  //        id: nav.id,
  //        order: nav.order,
  //      })),
  //    };
  //
  //    await axiosInstance.patch(
  //      `/organizations/${currentOrg.id}/navigation/reorder/`,
  //      payload,
  //    );
  //
  //    //(sortedNavigations);
  //
  //    setReordering(false);
  //
  //    console.log("Reorder successful");
  //    toast.success("Navigations successfully re-ordered!");
  //  } catch (error) {
  //    console.error("Reorder failed:", error);
  //
  //    toast.error("Failed to re-order navigations");
  //  }
  //};
  //const handleDragStart = (event) => {
  //  setActiveNavId(event.active.id);
  //};
  //const handleDragEnd = (event) => {
  //  const { active, over } = event;
  //  if (!over || active.id === over.id) return;
  //
  //  const oldIndex = sortedChildNavs.findIndex((nav) => nav.id === active.id);
  //  const newIndex = sortedChildNavs.findIndex((nav) => nav.id === over.id);
  //
  //  const newNavs = arrayMove(sortedChildNavs, oldIndex, newIndex);
  //
  //  // Update each item's order based on new index
  //  const updatedNavs = newNavs.map((nav, index) => ({
  //    ...nav,
  //    order: index, // update order based on new index
  //  }));
  //
  //  setSortedChildNavs(updatedNavs);
  //  //console.log(updatedNavs)
  //  setReordering(true);
  //  setActiveNavId(null);
  //
  //  // TODO: send to backend
  //  // e.g., axios.patch('/api/nav-order', updatedNavs)
  //};

  const handleNavigationEdit = (e) => {
    e.preventDefault();

    //console.log("sub");
    handleNavEdit({
      navigationGettingEdited,
      newNavigationLabel,
      newIcon,
      setNavigationGettingEdited,
      currentOrg,
      setLoading,
      navigations,
      fetchNavigations,
    });
  };
  //local states
  const [navigationGettingEdited, setNavigationGettingEdited] = useState(null);
  const [newNavigationLabel, setNewNavigationLabel] = useState("");
  const [newIcon, setNewIcon] = useState("");

  //console.log("sorted", sortedNavigations);
  if (!sortedNavigations) {
    console.log("no  navs");
    return;
  }
  //
  const parent = sortedNavigations.find((nav) => nav.id === navigation.id);
  const children = parent?.children || [];
  return (
    <>
      <div
        ref={(el) => {
          setNodeRef(el);
          ref.current = el;
        }}
        style={style}
        className=""
      >
        <div className="flex items-center justify-between  p-4 py-2 border rounded-lg hover:bg-accent/50 transition-colors min-h-12 group">
          {navigationGettingEdited === navigation.id ? (
            //if navigation is getting edited
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
                    onChange={(e) => setNewNavigationLabel(e.target.value)}
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
                        {newIcon ? `Icon: ${newIcon}` : "Select Icon"}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="col-span-4">
                  <div className="grid grid-cols-4 gap-2 p-2 border rounded-md max-h-64  overflow-y-auto mt-2">
                    {Object.entries(navIcons).map(([name, Icon]) => (
                      <Button
                        key={name}
                        type="button"
                        variant={newIcon === name ? "default" : "outline"}
                        size="sm"
                        className="flex flex-col items-center gap-1 h-auto py-2"
                        onClick={() => setNewIcon(name)}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{name}</span>
                      </Button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="grid grid-cols-4 justify-between items-center">
                <Button type="submit" size="sm" className="col-span-3">
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
            //navigation not being editing
            <>
              <div className="flex items-center gap-4  ">
                <button
                  {...attributes}
                  {...listeners}
                  className="cursor-grab h-10 text-2xl text-gray-500 hover:text-black pr-1 border-r-2 border-r-secondary"
                >
                  ⠿
                </button>
                {/* <span className="text-muted-foreground">{ind + 1}.</span> */}
                <span>
                  {ind + 1}. {navigation.label}
                </span>
              </div>
              {!reordering && (
                <div className="flex items-center gap-2  hidden group-hover:block">
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
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the navigation "
                          {navigation.label}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive"
                          onClick={() =>
                            handleNavDelete({
                              navigationId: navigation.id,
                              currentOrg,
                              setLoading,
                              fetchNavigations,
                            })
                          }
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </>
          )}
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(e) => handleDragStart(e, setActiveNavId)}
          onDragEnd={(e) =>
            handleChildDragEnd(
              e,
              navigation.id,
              setSortedNavigations,
              setReordering,
            )
          }
          modifiers={[
            restrictToParentElement,
            restrictToVerticalAxis, // if you want only vertical drag
          ]}
        >
          <SortableContext
            items={children.map((childNav) => childNav.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="">
              {children.map((childNav, subInd) => (
                <ChildNav
                  key={childNav.id}
                  ind={subInd}
                  navigation={childNav}
                  reordering={reordering}
                />
              ))}{" "}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}
