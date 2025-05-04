import SideMenu from "./menu/ManageAllSideMenu";
import { useState, useEffect } from "react";
import Account from "./Account";
//import Organizations from "./Organizations";
import NavigationManagement from "./org/NavigationsManagement";
import { useSearchParams } from "react-router-dom";
import SettingsSidebar from "./menu/SettingSidebar";

const menuItems = [
  {
    key: "sub1",
    label: "Account",
    component: <Account />,
  },
  {
    key: "sub4",
    label: "Organizations",
    component: <Organizations />,
  },
  {
    key: "sub2",
    label: "Organizations",
    component: <Organizations />,
  },
  {
    key: "9",
    label: "Organizations",
    component: <Organizations />,
  },
  {
    key: "10",
    label: "Organizations",
    component: <NavigationManagement />,
  },
];

function ManageAll() {
  const [searchParams] = useSearchParams();
  const [selectedMenu, setSelectedMenu] = useState(
    searchParams.get("section") === "organizations" ? "sub4" : "sub1",
  );

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setSelectedMenu(section === "organizations" ? "sub4" : "sub1");
    }
  }, [searchParams]);

  const selectedComponent = menuItems.find(
    (item) => item.key === selectedMenu,
  )?.component;

  return (
    <div className="grid grid-cols-6 h-full mt-10 border">
      <div className="border rounded-lg shadow-md col-span-5 overflow-auto">
        <div className="w-full h-full">{selectedComponent}</div>
      </div>
    </div>
  );
}

export default ManageAll;
