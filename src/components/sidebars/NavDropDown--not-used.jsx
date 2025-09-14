import React, { useState } from "react";
import { DownOutlined, TeamOutlined } from "@ant-design/icons";
import { Dropdown, message, Space } from "antd";
import { useOrg } from "../../context/organizationContext";
import { useEffect } from "react";

const OrganizationDropDown = () => {
  const { userOrgs, currentOrg, setCurrentOrg } = useOrg();
  //const [selectedOrg, setSelectedOrg] = useState(currentOrg); // Local state to track selection

  useEffect(() => {
    if (userOrgs.length > 0 && !currentOrg) {
      setCurrentOrg(userOrgs[0]);
      //setSelectedOrg(userOrgs[0]); // Update local state
    }
  }, [userOrgs, currentOrg, setCurrentOrg]);

  // Map userOrgs to dropdown items
  const items = userOrgs.map((org) => ({
    label: org.name, // ✅ Fixed Typo (was 'lable')
    key: org.id,
    icon: <TeamOutlined />,
  }));

  //setCurrentOrg(userOrgs[0]);

  const handleMenuClick = (e) => {
    const selectedOrg = userOrgs.find((org) => org.id === e.key);
    if (selectedOrg) {
      setCurrentOrg(selectedOrg);
      console.log("organization changed");
      //setSelectedOrg(selectedOrg);
      message.info(`Selected: ${selectedOrg.name}`);
    }
  };

  return (
    <Dropdown menu={{ items, onClick: handleMenuClick }}>
      <button className="bg-gray-50 hover:gray-bg-200 border rounded-sm p-2 border-l-black">
        <Space>
          {currentOrg?.name || "Select an Organization"}{" "}
          {/* Prevent empty label */}
          <DownOutlined />
        </Space>
      </button>
    </Dropdown>
  );
};

export default OrganizationDropDown;
