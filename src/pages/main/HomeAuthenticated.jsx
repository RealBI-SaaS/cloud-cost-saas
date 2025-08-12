//import React, { useState } from "react";
import useCloudAccountsStore from "@/stores/CloudAccountStore";

import React from "react";
//import { useNavigate } from "react-router-dom";
//import { useOrg } from "../context/OrganizationContext";
//import HomeOrgMenu from "./menu/HomeOrgMenu";
import { useEffect } from "react";
import PowerBIEmbed from "../../components/powerbi/PowerBIEmbed";
import useUserStore from "@/stores/userStore";
import { shallow } from "zustand/shallow";
// import useOrgStore from "@/stores/OrgStore";
import { useLocation, useParams } from "react-router-dom";
import CostOverTime from "@/components/data/CostOverTime";
import UsageByServiceChart from "@/components/data/DailyUsageByService";
import CostByServicePieChart from "@/components/data/CostByService";

import { Frown } from "lucide-react";

// import useCompany from "@/stores/CompanyStore";

const HomeAuthenticated = () => {
  const { parentId, subId } = useParams();
  const {
    currentAccount,
    fetchCosts,
    costOverTime,
    costByService,
    costByServicePerDay,
  } = useCloudAccountsStore();
  useEffect(() => {
    fetchCosts();
  }, [currentAccount]);
  if (
    !costByServicePerDay ||
    costByServicePerDay.length === 0 ||
    !costByService ||
    costByService.length === 0 ||
    !costOverTime ||
    costOverTime.length === 0
  ) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 text-yellow-800 h-full ">
        <Frown className="w-6 h-6 flex-shrink-0" />
        <span className="font-semibold">Sorry, No Data To Display.</span>
      </div>
    );
  }

  // const userComp = useCompany((state) => state.userComp);

  return (
    <div className="  grid grid-cols-1 justify-around items-center w-full h-full  ">
      {/*<HomeOrgMenu onItemClick={handleItemClick} />*/}
      {/* Pass the click handler */}
      {/* <h1 className="text-2xl font-bold px-5 mx-5 py-3">{title}</h1> */}

      {/* <PowerBIEmbed /> */}
      <div className="grid grid-cols-2 mx-5">
        <CostOverTime data={costOverTime} />

        <CostByServicePieChart data={costByService} />
        <div className="col-span-2  mt-10 ">
          <UsageByServiceChart data={costByServicePerDay} />
        </div>
      </div>
    </div>
  );
};

export default HomeAuthenticated;
