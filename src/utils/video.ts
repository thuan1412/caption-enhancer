import type { DualCaption, Event } from "~types";

export const getCaptions = async (urlStr: string) => {
  const response = await fetch(urlStr);
  const captionsRes = await response.json();

  return captionsRes;
};

export const findSubtitleOfTime = (
  timeInMs: number,
  subtitles: DualCaption[],
) => {
  const optimal = false;
  if (optimal) {
    return findCurrentSubtitleBs(timeInMs, subtitles);
  }
  let res = null;
  for (let i = 0; i < subtitles.length; i++) {
    if (subtitles[i].timeInMs >= timeInMs) {
      break;
    }
    if (subtitles[i].timeInMs < timeInMs) {
      res = subtitles[i];
    }
  }
  return res;
};

const findCurrentSubtitleBs = (timeInMs: number, subtitles: DualCaption[]) => {
  let left = 0;
  let right = subtitles.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (subtitles[mid].timeInMs > timeInMs) {
      right = mid - 1;
    } else if (subtitles[mid].timeInMs < timeInMs) {
      left = mid + 1;
    } else {
      return subtitles[mid];
    }
  }

  return subtitles[right];
};

export const timeToSeconds = (time: string) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

function msToTime(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${remainingSeconds}`;
}

export const mergeCaptions = (
  firstEvents: Event[],
  secondEvents: Event[],
): DualCaption[] => {
  if (firstEvents.length === 0) {
    return [];
  }

  const timestampToSecondSeg: Record<number, string> = {};
  secondEvents.forEach(
    (event: { segs?: { utf8: string }[]; tStartMs: number }) => {
      if (!event.segs) {
        return;
      }
      const text = event.segs
        .flatMap((segment: { utf8: string }) => segment.utf8)
        .join("");
      timestampToSecondSeg[event.tStartMs] = text;
    },
  );

  const data = firstEvents.map(
    (event: { tStartMs: number; segs?: { utf8: string }[] }) => {
      if (!event.segs) {
        return;
      }
      return {
        timeInMs: event.tStartMs,
        timestamp: msToTime(event.tStartMs),
        firstLanguage: event.segs.flatMap((segment) => segment.utf8).join(""),
        secondLanguage: timestampToSecondSeg[event.tStartMs],
      };
    },
  );

  return data.filter(
    (ele: DualCaption | undefined) => !(!ele || ele.firstLanguage === "\n"),
  );
};

export const isVideoPage = () => window.location.pathname.startsWith("/watch");

export const getCurrentVideoId = () => {
  if (!isVideoPage()) {
    return "";
  }
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v") || "";
};

export const isVideoPlaying = () => {
  const videoElement = document.querySelector("video");
  return videoElement && !videoElement.paused;
};

export const getVideIdFromUrl = (url: string) => {
  const urlParams = new URL(url).searchParams;
  return urlParams.get("v") || "";
};

export const getCurrentTimeInMs = () => {
  const videoElement = document.querySelector("video");
  if (videoElement) {
    return videoElement.currentTime * 1000;
  }
  return null;
};

export const scrollToSubtitle = (currentTime: string) => {
  const rootElement = document.querySelector("#secondary > plasmo-csui");
  const subtitleElement = rootElement?.shadowRoot?.getElementById(
    `dual-caption-${currentTime}`,
  );
  const scrollableDiv = rootElement?.shadowRoot?.getElementById(
    "dual-caption-container",
  );

  if (subtitleElement && scrollableDiv) {
    const subtitleElementRect = subtitleElement.getBoundingClientRect();
    const scrollableDivRect = scrollableDiv.getBoundingClientRect();
    const relativeTop = subtitleElementRect.top - scrollableDivRect.top;

    const newScrollTop =
      scrollableDiv.scrollTop + relativeTop - scrollableDivRect.height / 2;

    scrollableDiv.scrollTo({
      top: newScrollTop,
      behavior: "smooth",
    });
  }
};

export const setVideoTime = (timestamp: string) => {
  const videoElement = document.querySelector("video");
  if (videoElement) {
    videoElement.currentTime = timeToSeconds(timestamp);
  }
};
