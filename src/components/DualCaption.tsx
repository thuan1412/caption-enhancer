import type { DualCaption } from "~types";
import { setVideoTime, timeToSeconds } from "~utils/video";

type DualCaptionProps = {
  dualCaption: DualCaption;
  isActive: boolean;
};

const DualCaptionComponent = ({ dualCaption, isActive }: DualCaptionProps) => {
  const { timestamp, firstLanguage, secondLanguage } = dualCaption;
  return (
    <div id={`dual-caption-${timestamp}`}>
      <div className="flex flex-row items-start justify-items-center">
        <button
          onClick={() => setVideoTime(timestamp)}
          className="mr-2 cursor-pointer text-gray-400">
          {timestamp}
        </button>
        <div className="flex flex-col">
          <p className={isActive ? "font-bold" : ""}>{firstLanguage}</p>
          <p className={"italic " + (isActive ? "font-medium" : "")}>
            {secondLanguage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DualCaptionComponent;
