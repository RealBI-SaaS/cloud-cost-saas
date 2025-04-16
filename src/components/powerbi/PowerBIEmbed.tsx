// PowerBIReport.tsx
import React from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import { useState } from "react";

// Sample credentials from Power BI dev sandbox (safe for demo use only)
const myEmbedConfig = {
  embedUrl:
    "https://app.powerbi.com/reportEmbed?reportId=d63f5ef5-8dcf-4cbd-a17a-8aa49f83af61&groupId=4ac55bdc-66f5-49b2-b85a-d421f1d1df3a",
  accessToken: "H4sIAAAAAAAEAKtWKkktLlGyUqoFALJmAk0EAAAA",
  reportId: "d63f5ef5-8dcf-4cbd-a17a-8aa49f83af61",
};

const PowerBIReport: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  //const embedConfig = {
  //  type: "report", // Supported types: report, dashboard, tile, visual, and qna.
  //  id: myEmbedConfig.reportId,
  //  embedUrl: myEmbedConfig.embedUrl,
  //  accessToken: myEmbedConfig.accessToken,
  //  tokenType: models.TokenType.Embed, // Or models.TokenType.Aad
  //  settings: {
  //    panes: {
  //      filters: {
  //        expanded: false,
  //        visible: false,
  //      },
  //    },
  //  },
  //};
  //
  //const eventHandlers = new Map([
  //  [
  //    "loaded",
  //    () => {
  //      console.log("Report loaded");
  //    },
  //  ],
  //  [
  //    "rendered",
  //    () => {
  //      console.log("Report rendered");
  //    },
  //  ],
  //  [
  //    "error",
  //    (event: any) => {
  //      console.error(event.detail);
  //    },
  //  ],
  //]);
  //
  //const getEmbeddedComponent = (embeddedReport: any) => {
  //  (window as any).report = embeddedReport;
  //};
  //return (
  //  <div className="powerbi-container h-screen flex justify-center items-center bg-gray-100">
  //    <div
  //      style={{
  //        height: "100%",
  //        aspectRatio: "1468.34 / 900",
  //      }}
  //      className="w-auto"
  //    >
  //      <iframe
  //        title="Sample Report Demo"
  //        src="https://playground.powerbi.com/sampleReportEmbed"
  //        className="w-full h-full border-0"
  //        allowFullScreen
  //      ></iframe>
  //    </div>
  //  </div>
  //);
  //

  return (
    <div
      className="powerbi-container w-full"
      style={{ aspectRatio: "1468.34 / 900" }}
    >
      <iframe
        title="Sample Report Demo"
        src="https://playground.powerbi.com/sampleReportEmbed"
        className="w-full h-full border-0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default PowerBIReport;
