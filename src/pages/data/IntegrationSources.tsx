import useCompany from "@/stores/CompanyStore";
import React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AWSOnboardingModal from "./AWSOnboardingModal.tsx";
import VendorSelectModal from "./VendorSelectModal.tsx";

import { toast } from "sonner";

interface props {
  label?: boolean;
}
const IntegrationSources = ({ label }: props) => {
  const userComp = useCompany((state) => state.userComp);

  // for aws
  const [awsExternaId, setAWSExternalId] = useState(false);
  const [awsARN, setAWSARN] = useState(false);
  const [awsOpen, setAwsOpen] = useState(false);
  const [connectionName, setConnectionName] = useState("");
  const handleGoogleIntegration = async () => {
    const client_id = import.meta.env.VITE_GOOGLE_DATA_CLIENT_ID;
    const state = crypto.randomUUID();
    localStorage.setItem("latestCSRFToken", state);

    const googleOauthURL = `${
      import.meta.env.VITE_BASE_URL
    }/data/google/oauth/start/${userComp.id}/${connectionName}`;

    window.location.href = googleOauthURL;
  };
  // const handleAWSIntegration = () => {};
  const handleAzureIntegration = () => {
    window.location.href = `${
      import.meta.env.VITE_BASE_URL
    }/data/azure/oauth/start/${userComp.id}/${connectionName}`;
  };

  const onNext = ({ vendor, connectionName }) => {
    // console.log(vendor, connectionName);
    if (vendor == "aws") {
      setAwsOpen(true);
    } else {
      toast("Redirecting to OAuth");
      if (vendor == "gcp") {
        handleGoogleIntegration();
      } else if (vendor == "azure") {
        handleAzureIntegration();
      }
    }
  };

  return (
    <div className="flex flex-col items-end justify-center">
      {/* <h1 className="text-2xl font-bold mb-4 text-primary"> */}
      {/*   Manage integrated sources and add new ones{" "} */}
      {/* </h1> */}
      <div className="w-full flex justify-center ">
        {/* <Button */}
        {/*   onClick={() => { */}
        {/*     handleGoogleIntegration(); */}
        {/*   }} */}
        {/*   className="text-secondary bg-amber-300 p-5" */}
        {/* > */}
        {/*   GOOGLE */}
        {/* </Button> */}
        {/**/}
        {/* <Button */}
        {/*   onClick={() => { */}
        {/*     // handleAWSIntegration(); */}
        {/*     setAwsOpen(!awsOpen); */}
        {/*   }} */}
        {/*   className="text-secondary bg-amber-300 p-5" */}
        {/* > */}
        {/*   AWS */}
        {/* </Button> */}
        {/* <Button */}
        {/*   onClick={() => { */}
        {/*     handleAzureIntegration(); */}
        {/*   }} */}
        {/*   className="text-secondary bg-amber-300 p-5" */}
        {/* > */}
        {/*   Azure */}
        {/* </Button> */}
        <VendorSelectModal
          onNext={onNext}
          connectionName={connectionName}
          setConnectionName={setConnectionName}
          label={label}
        />
        <AWSOnboardingModal
          open={awsOpen}
          onOpenChange={setAwsOpen}
          setAWSExternalId={setAWSExternalId}
          setAWSARN={setAWSARN}
          connectionName={connectionName}
        />
        {/* <AWSOnboardingModal /> */}
      </div>
    </div>
  );
};

export default IntegrationSources;
