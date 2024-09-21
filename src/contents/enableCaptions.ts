import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/watch*"],
};

window.addEventListener("load", () => {
  let prevVideoId = "";

  setInterval(() => {
    let currentVideoId = new URLSearchParams(window.location.search).get("v");
    const ccBtn = document.querySelector(
      "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-subtitles-button.ytp-button",
    );
    if (ccBtn) {
      if (
        ccBtn.getAttribute("aria-pressed") === "false" &&
        (prevVideoId !== currentVideoId || prevVideoId === "")
      ) {
        (ccBtn as HTMLElement).click();
        setTimeout(() => {
          (ccBtn as HTMLElement).click();
        }, 100);
        prevVideoId = currentVideoId;
      }
    }
  }, 1000);
});
