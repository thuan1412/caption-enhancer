import cssText from "data-text:~style.css";
import type {
  PlasmoCSConfig,
  PlasmoCSUIProps,
  PlasmoGetInlineAnchor
} from "plasmo";
import { useEffect, useState, type FC } from "react";

import { useMessage } from "@plasmohq/messaging/hook";

import DualCaptionComponent from "~components/DualCaption";
import { useDualCaptions } from "~hooks/useDualCaptions";
import type { DualCaption } from "~types";
import {
  findSubtitleOfTime,
  getCurrentTimeInMs,
  isVideoPlaying,
  scrollToSubtitle
} from "~utils/video";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)");
  return style;
};

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.querySelector(
    "div#columns div#secondary div#secondary-inner"
  ),
  insertPosition: "beforebegin"
});

const Captions: FC<PlasmoCSUIProps> = () => {
  const [timedtextUrl, setTimedtextUrl] = useState<string>("");
  useMessage<{ url: string }, string>(async (req, _) => {
    if (req.name === "timedtextUrl") {
      setTimedtextUrl(req.body.url);
    }
  });
  const { dualCaptions, loading } = useDualCaptions(timedtextUrl, "vi");

  const [activeSubtitle, setCurrentSubtitle] = useState<DualCaption | null>(
    null
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = getCurrentTimeInMs();
      const currentSub = findSubtitleOfTime(currentTime ?? 0, dualCaptions);
      setCurrentSubtitle(currentSub);
      if (currentSub && isVideoPlaying()) {
        scrollToSubtitle(currentSub.timestamp);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [dualCaptions]);

  if (loading) return null;

  const videoHeight = document.querySelector("video")?.clientHeight ?? 0;

  return (
    <div
      className="border-gray-100 border-2 border-solid p-2 rounded-lg text-2xl "
      style={{ maxHeight: videoHeight }}>
      <div
        id="dual-caption-container"
        className="overflow-scroll size-full pb-1"
        style={{ maxHeight: videoHeight - 16 }}>
        {dualCaptions.map((item, idx) => (
          <DualCaptionComponent
            key={idx}
            dualCaption={item}
            isActive={activeSubtitle?.timestamp == item.timestamp}
          />
        ))}
      </div>
    </div>
  );
};

export default Captions;
