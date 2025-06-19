import React, { useEffect, useState } from "react";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useOrg } from "../../context/OrganizationContext";
//import { useMenu } from "../../context/MenuContext";

const ManageAllSideMenu = () => {
  //const { selectedMenu, selectMenu } = useMenu();
  const { currentOrg } = useOrg();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const onClick = (e) => {
    selectMenu(e.key);
    navigate(e.item.props.url);
    console.log(selectedMenu);
  };

  useEffect(() => {
    if (currentOrg) {
      setItems([
        {
          key: "sub1",
          label: "Account",
          url: "/account",
          icon: <UserOutlined />,
        },
        {
          key: "sub4",
          label: "Organization",
          icon: <TeamOutlined />,
          children: [
            {
              key: "9",
              url: `/Organizations/${currentOrg.id}`,
              label: "List and Create",
            },
            { key: "10", url: "/manage-all/navigations", label: "Navigations" },
          ],
        },
      ]);
    }
  }, [currentOrg]);

  return (
    <div className="bg-white pt-15">
      <Menu
        onClick={onClick}
        defaultSelectedKeys={["sub1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
        className="text-black text-lg"
      />
    </div>
  );
};

export default ManageAllSideMenu;
