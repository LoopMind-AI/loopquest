// export const GA_TRACKING_ID = "G-L92VJ893VL";  // vercel prod 环境数据流跟踪ID
export const GA_TRACKING_ID = "G-S2237K9N4J"; // azure dev 环境数据流跟踪ID

interface Window {
  gtag(
    type: "config",
    googleAnalyticsId: string,
    { page_path }: { page_path: string }
  ): void;
  gtag(
    type: "event",
    eventAction: string,
    fieldObject: { event_label: string; event_category: string; value?: number }
  ): void;
}

declare let window: Window;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL): void => {
  if (typeof window !== "undefined") {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url.toString(),
    });
  }
};

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent): void => {
  if (typeof window !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};
