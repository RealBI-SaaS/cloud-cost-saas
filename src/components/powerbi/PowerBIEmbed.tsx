import { useEffect, useRef } from "react";
import { models, service } from "powerbi-client";

interface PowerBIEmbedProps {
  embedUrl: string;
  accessToken: string;
  reportId: string;
}

const PowerBIEmbed = ({ embedUrl, accessToken, reportId }: PowerBIEmbedProps) => {
  const embedContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!embedContainer.current) return;

    const embedConfig: models.IReportEmbedConfiguration = {
      type: "report",
      id: reportId,
      embedUrl: embedUrl,
      accessToken: accessToken,
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: true },
        },
        layoutType: models.LayoutType.Custom,
      },
    };

    const powerbiService = new service.Service(
      service.factories.hpmFactory,
      service.factories.wpmpFactory,
      service.factories.routerFactory
    );

    const report = powerbiService.embed(embedContainer.current, embedConfig);

    return () => {
      powerbiService.reset(embedContainer.current!);
    };
  }, [embedUrl, accessToken, reportId]);

  return <div ref={embedContainer} style={{ height: "600px", width: "100%" }} />;
};

export default PowerBIEmbed;
