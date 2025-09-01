import SelectedOrgContext from "@/context/selectedOrgContext";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";

const CostAnalysis = () => {
  const { selectedOrg } = useContext(SelectedOrgContext);
  return <div>cost Analysis for {selectedOrg.name}==</div>;
};

export default CostAnalysis;
