import React from "react";
import { useParams } from "react-router-dom";

const CostAnalysis = () => {
  const { orgId } = useParams();

  return <div>cost Analysis for {orgId}==</div>;
};

export default CostAnalysis;
