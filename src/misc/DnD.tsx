import useOrgStore from "@/context/OrgStore";
import { arrayMove } from "@dnd-kit/sortable";
import axios from "axios";
import { useSensor, PointerSensor, useSensors } from "@dnd-kit/core";

export const getDragStyle = ({ transform, transition, isDragging, ref }) => ({
  transform: CSS.Transform.toString(transform),
  transition,
  zIndex: isDragging ? 50 : undefined,
  opacity: isDragging ? 0.4 : 1,
  height: isDragging ? ref?.current?.offsetHeight : undefined,
  width: isDragging ? ref?.current?.offsetWidth : undefined,
});

//export const sensors = useSensors(
//  useSensor(PointerSensor, {
//    activationConstraint: {
//      distance: 1,
//    },
//  }),
//);
//

export const handleDragStart = (event, setActiveNavId) => {
  setActiveNavId(event.active.id);
};
export const handleDragEnd = (
  event,
  sortedNavigations,
  setSortedNavigations,
  setReordering,
  setActiveNavId,
) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const oldIndex = sortedNavigations.findIndex((nav) => nav.id === active.id);
  const newIndex = sortedNavigations.findIndex((nav) => nav.id === over.id);
  const newNavs = arrayMove(sortedNavigations, oldIndex, newIndex);

  // Update each item's order based on new index
  const updatedNavs = newNavs.map((nav, index) => ({
    ...nav,
    order: index, // update order based on new index
  }));

  setSortedNavigations(updatedNavs);
  //console.log(updatedNavs)
  setReordering(true);
  setActiveNavId(null);

  // TODO: send to backend
  // e.g., axios.patch('/api/nav-order', updatedNavs)
};

export const handleChildDragEnd = (
  event,
  parentId,
  setSortedNavigations,
  setReordering,
) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  setSortedNavigations((prevNavs) =>
    prevNavs.map((nav) => {
      if (nav.id !== parentId) return nav;

      const oldIndex = nav.children.findIndex((c) => c.id === active.id);
      const newIndex = nav.children.findIndex((c) => c.id === over.id);

      const newChildren = arrayMove(nav.children, oldIndex, newIndex).map(
        (c, i) => ({
          ...c,
          order: i,
        }),
      );

      return {
        ...nav,
        children: newChildren,
      };
    }),
  );
  //setSortedNavs(updatedNavs);
  //console.log(updatedNavs)
  setReordering(true);
  //setActiveNavId(null);
};
