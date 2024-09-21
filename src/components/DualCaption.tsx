import { useRef } from "react";

import { useWordModalStore } from "~store/wordModalStore";
import type { DualCaption } from "~types";
import { setVideoTime } from "~utils/video";

type DualCaptionProps = {
  dualCaption: DualCaption;
  isActive: boolean;
};

const WordSpan = ({ className, word }) => {
  const ref = useRef<HTMLElement>(null);
  const showModal = useWordModalStore((state) => state.showModal);
  const containerPos = useWordModalStore((state) => state.containerPos);

  const onClick = () => {
    const cursorX = Math.max(
      ref.current.getBoundingClientRect().left - containerPos.left,
      0,
    );
    const cursorY = Math.max(
      ref.current.getBoundingClientRect().top - containerPos.top,
      0,
    );
    const modalHeight = 155; // Assume the modal height
    showModal(
      {
        top: cursorY - modalHeight, // Position the modal above the cursor
        left: cursorX,
      },
      word,
    );
  };
  return (
    <span ref={ref} className={className} onClick={onClick}>
      {word + " "}
    </span>
  );
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
          <p className={isActive ? "font-bold" : "font-extralight"}>
            {firstLanguage.split(" ").map((word, idx) => (
              <WordSpan
                key={idx}
                className="hover:text-sky-600 hover:cursor-pointer"
                word={word}
              />
            ))}
            {/* {firstLanguage} */}
          </p>
          <p className={"italic " + (isActive ? "font-medium" : "font-thin")}>
            {secondLanguage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DualCaptionComponent;
