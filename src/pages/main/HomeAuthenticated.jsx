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
import CostSummaries from "@/components/data/CostSummaries";
import MonthlyServiceCostChart from "@/components/data/CostServiceMonths";
import ServiceCostBarChart from "@/components/data/CostByServiceMonthsBar";

import { CircleUserRound, Frown } from "lucide-react";
import { SideBarUser } from "@/components/sidebars/homeSidebarComponents/sidebar-footer-account";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// import useCompany from "@/stores/CompanyStore";

const HomeAuthenticated = () => {
  const { parentId, subId } = useParams();
  const {
    currentAccount,
    fetchCosts,
    costOverTime,
    costByService,
    costByServicePerDay,
    costAccountSummary,
    costByMonthService,
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
    costOverTime.length === 0 ||
    !costAccountSummary ||
    !costByMonthService ||
    costByMonthService.length == 0
  ) {
    return (
      <div className="flex  flex-col gap-5 items-center justify-center  p-4 h-full text-xl text-primary text-pretty ">
        <Frown className="w-16 h-16 flex-shrink-0" />
        <span className="font-semibold ">Sorry, No Data To Display.</span>
      </div>
    );
  }

  // const userComp = useCompany((state) => state.userComp);

  return (

    <div className="">
      {/* nav bar */}
      {/*<Navbar />*/}
      {/* main section  */}
      Hallo jo
      <div className=" bg-blue-950  grid grid-cols-2  ">


        {/* <PowerBIEmbed /> */}
        <div className=" flex flex-col gap-3 h-full   ">
          <div className=" ">
            <CostSummaries data={costAccountSummary} />
          </div>

          <div className="   ">
            <CostByServicePieChart data={costByService} />
          </div>
        </div>
        {/* <CostOverTime data={costOverTime} /> */}
        <div className="h-full   w-full">
          {/* <UsageByServiceChart data={costByServicePerDay} /> */}
          <ServiceCostBarChart data={costByMonthService} />
        </div>
        <div className="col-span-2 h-full">
          <MonthlyServiceCostChart data={costByMonthService} />
        </div>
      </div>


    </div>


  );
};

export default HomeAuthenticated;
