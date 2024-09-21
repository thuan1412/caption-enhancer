import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import cssText from "data-text:~style.css";
import type {
  PlasmoCSConfig,
  PlasmoCSUIProps,
  PlasmoGetInlineAnchor,
} from "plasmo";
import { useEffect, useRef, useState, type FC } from "react";

import { useMessage } from "@plasmohq/messaging/hook";
import { useStorage } from "@plasmohq/storage/hook";

import DualCaptionComponent from "~components/DualCaption";
import WordDefinitionModal from "~components/WordDefinitionModal";
import { useDualCaptions } from "~hooks/useDualCaptions";
import { useWordModalStore } from "~store/wordModalStore";
import type { DualCaption, WordDefinition } from "~types";
import {
  findSubtitleOfTime,
  getCurrentTimeInMs,
  isVideoPlaying,
  scrollToSubtitle,
} from "~utils/video";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"],
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)");
  return style;
};

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.querySelector(
    "div#columns div#secondary div#secondary-inner",
  ),
  insertPosition: "beforebegin",
});

const queryClient = new QueryClient();

const Captions: FC<PlasmoCSUIProps> = () => {
  const [timedtextUrl, setTimedtextUrl] = useState<string>("");

  useMessage<{ url: string }, string>(async (req, _) => {
    if (req.name === "timedtextUrl") {
      setTimedtextUrl(req.body.url);
    }
  });

  const { dualCaptions, loading } = useDualCaptions(timedtextUrl, "vi");

  const [activeSubtitle, setCurrentSubtitle] = useState<DualCaption | null>(
    null,
  );
  const [isExtEnable] = useStorage("isExtEnable");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = getCurrentTimeInMs();
      const currentSub = findSubtitleOfTime(currentTime ?? 0, dualCaptions);
      setCurrentSubtitle(currentSub);
      if (currentSub && isVideoPlaying()) {
        scrollToSubtitle(currentSub.timestamp);
      }
    }, 500);
    return () => clearInterval(intervalId);
  }, [dualCaptions]);

  const currentVideoId = new URLSearchParams(window.location.search).get("v");
  const timedtextVideoId = timedtextUrl
    ? new URL(timedtextUrl).searchParams.get("v")
    : "";

  const parentRef = useRef<HTMLDivElement>(null);
  const setContainerPos = useWordModalStore((state) => state.setContainerPos);

  useEffect(() => {
    const handleResize = () => {
      if (parentRef.current) {
        const boundingBox = parentRef.current.getBoundingClientRect();
        setContainerPos({ left: boundingBox.left, top: boundingBox.top });
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [parentRef.current]);

  const videoHeight = document.querySelector("video")?.clientHeight ?? 0;

  // Hide modal when clicking elsewhere
  const handleClickOutside = () => {
    // hideModal();
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (!isExtEnable) return null;

  if (loading || currentVideoId !== timedtextVideoId) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <div
        ref={parentRef}
        className="relative border-gray-100 border-2 border-solid p-2 rounded-2xl text-2xl"
        style={{ maxHeight: videoHeight }}>
        <WordDefinitionModal />
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
    </QueryClientProvider>
  );
};

export default Captions;
