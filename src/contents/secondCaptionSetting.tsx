import cssText from "data-text:~style.css";
import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoRender } from "plasmo";
import { type FC } from "react";
import { createRoot } from "react-dom/client";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/watch*"],
};

// not used for now
const getRootContainer = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainerParent = document.querySelector(
        "#ytp-id-18 > div > div",
      );
      const afterSibling = document.querySelector(
        "#ytp-id-18 > div > div > div:nth-child(4)",
      );
      const rootContainer = rootContainerParent?.querySelector(
        "#second-caption-setting",
      );
      if (rootContainerParent && !rootContainer) {
        clearInterval(checkInterval);
        const rootContainer = document.createElement("div");
        rootContainer.id = "second-caption-setting";
        rootContainer.className = "ytp-menuitem";
        rootContainer.role = "menuitem";
        rootContainer.setAttribute("aria-haspopup", "true");
        rootContainer.tabIndex = 0;
        rootContainerParent.insertBefore(rootContainer, afterSibling);
        resolve(rootContainer);
      }
    }, 137);
  });

const SecondCaptionSetting: FC<PlasmoCSUIProps> = () => {
  return (
    <>
      <div className="ytp-menuitem-icon">
        <svg height="24" viewBox="0 0 24 24" width="24">
          <path
            d="M5,11h2v2H5V11z M15,15H5v2h10V15z M19,15h-2v2h2V15z M19,11H9v2h10V11z M22,6H2v14h20V6z M3,7h18v12H3V7z"
            fill="white"></path>
        </svg>
      </div>
      <div className="ytp-menuitem-label">Second Setting</div>
      <div className="ytp-menuitem-content">Tiếng Anh</div>
    </>
  );
};

export const render = async ({ createRootContainer }) => {
  const rootContainer = await createRootContainer();

  const root = createRoot(rootContainer);
  root.render(<SecondCaptionSetting />);
};

export default SecondCaptionSetting;
