import { navIcons } from "@/assets/iconMap";
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
import ChildNav from "./nav/ChildNavItem";

export default function Navigation({ navigation, ind }) {
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

  //local states
  const [navigationGettingEdited, setNavigationGettingEdited] = useState(null);
  const [newNavigationLabel, setNewNavigationLabel] = useState("");
  const [newIcon, setNewIcon] = useState("");
  //handlers
  const handleNavEdit = (e) => {
    return;
  };
  const handleNavDelete = (nav_id) => {
    return;
  };

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
        <div className="flex items-center justify-between  p-4 py-2 border rounded-lg hover:bg-accent/50 transition-colors h-12 group">
          {navigationGettingEdited === navigation.id ? (
            //if navigation is getting edited
            <form className="grid gap-4 w-full p-4 " onSubmit={handleNavEdit}>
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
                  <div className="grid grid-cols-4 gap-2 p-2 border rounded-md max-h-64 overflow-y-auto mt-2">
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
                  className="cursor-grab text-2xl text-gray-500 hover:text-black pr-1 border-r-2 border-r-secondary"
                >
                  ⠿
                </button>
                {/* <span className="text-muted-foreground">{ind + 1}.</span> */}
                <span>
                  {navigation.order + 1}. {navigation.label}
                </span>
              </div>
              <div className="flex items-center gap-2 hidden group-hover:block">
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
                        className="!text-white"
                        onClick={() => handleNavDelete(navigation.id)}
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
        <div className="">
          {navigation.children?.map((childNav, subInd) => (
            <ChildNav key={childNav.id} ind={subInd} navigation={childNav} />
          ))}{" "}
        </div>
      </div>
    </>
  );
}
