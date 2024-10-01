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
  const isShowModal = useWordModalStore((state) => state.isShow);
  const containerPos = useWordModalStore((state) => state.containerPos);
  const selectedWord = useWordModalStore((state) => state.word);

  const onClick = () => {
    const cursorX = Math.max(
      ref.current.getBoundingClientRect().left - containerPos.left,
      0,
    );
    const cursorY = Math.max(
      ref.current.getBoundingClientRect().top - containerPos.top,
      0,
    );
    const modalHeight = 155;
    const modalWidth = 300;
    const containerHeight = containerPos.height;
    const containerWidth = containerPos.width;

    let top = cursorY - modalHeight;
    let left = cursorX - modalWidth / 2;

    // Ensure the modal doesn't go outside the container
    if (top < 0) top = cursorY + 20;
    if (left < 0) left = 30;
    if (left + modalWidth > containerWidth)
      left = containerWidth - modalWidth - 30;
    if (top + modalHeight > containerHeight)
      top = containerHeight - modalHeight;

    showModal(
      {
        top,
        left,
      },
      word.replace(/[^a-zA-Z ]/g, ""),
    );
  };

  return (
    <span
      ref={ref}
      className={
        className +
        (selectedWord === word && isShowModal ? " text-sky-400" : "")
      }
      onClick={onClick}
    >
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
          className="mr-2 cursor-pointer text-gray-400"
        >
          {timestamp}
        </button>
        <div className="flex flex-col">
          <p className={isActive ? "font-bold" : "font-extralight"}>
            {firstLanguage.split(/ |\n| \n/).map((word, idx) => (
              <WordSpan
                key={idx}
                className="hover:text-sky-600 hover:cursor-pointer"
                word={word}
              />
            ))}
            {/* {firstLanguage} */}
          </p>
          <p
            className={
              "text-yellow-600 " + (isActive ? "font-bold" : "font-extralight")
            }
          >
            {secondLanguage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DualCaptionComponent;
