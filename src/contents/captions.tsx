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
import WordMeaningModal from "~components/WordMeaningModal";
import { useDualCaptions } from "~hooks/useDualCaptions";
import { useWordModalStore } from "~store/wordModalStore";
import type { DualCaption, WordMeaning } from "~types";
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

  const mockWordMeaning: WordMeaning = {
    word: "hello",
    phonetics: [
      {
        audio:
          "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3",
        sourceUrl: "https://commons.wikimedia.org/w/index.php?curid=75797336",
        license: {
          name: "BY-SA 4.0",
          url: "https://creativecommons.org/licenses/by-sa/4.0",
        },
      },
      {
        text: "/həˈləʊ/",
        audio:
          "https://api.dictionaryapi.dev/media/pronunciations/en/hello-uk.mp3",
        sourceUrl: "https://commons.wikimedia.org/w/index.php?curid=9021983",
        license: {
          name: "BY 3.0 US",
          url: "https://creativecommons.org/licenses/by/3.0/us",
        },
      },
      {
        text: "/həˈloʊ/",
        audio: "",
      },
    ],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: '"Hello!" or an equivalent greeting.',
            synonyms: [],
            antonyms: [],
          },
        ],
        synonyms: ["greeting"],
        antonyms: [],
      },
      {
        partOfSpeech: "verb",
        definitions: [
          {
            definition: 'To greet with "hello".',
            synonyms: [],
            antonyms: [],
          },
        ],
        synonyms: [],
        antonyms: [],
      },
      {
        partOfSpeech: "interjection",
        definitions: [
          {
            definition:
              "A greeting (salutation) said when meeting someone or acknowledging someone’s arrival or presence.",
            synonyms: [],
            antonyms: [],
            example: "Hello, everyone.",
          },
          {
            definition: "A greeting used when answering the telephone.",
            synonyms: [],
            antonyms: [],
            example: "Hello? How may I help you?",
          },
          {
            definition:
              "A call for response if it is not clear if anyone is present or listening, or if a telephone conversation may have been disconnected.",
            synonyms: [],
            antonyms: [],
            example: "Hello? Is anyone there?",
          },
          {
            definition:
              "Used sarcastically to imply that the person addressed or referred to has done something the speaker or writer considers to be foolish.",
            synonyms: [],
            antonyms: [],
            example:
              "You just tried to start your car with your cell phone. Hello?",
          },
          {
            definition: "An expression of puzzlement or discovery.",
            synonyms: [],
            antonyms: [],
            example: "Hello! What’s going on here?",
          },
        ],
        synonyms: [],
        antonyms: ["bye", "goodbye"],
      },
    ],
    license: {
      name: "CC BY-SA 3.0",
      url: "https://creativecommons.org/licenses/by-sa/3.0",
    },
    sourceUrls: ["https://en.wiktionary.org/wiki/hello"],
  };

  return (
    <div
      ref={parentRef}
      className="relative border-gray-100 border-2 border-solid p-2 rounded-2xl text-2xl"
      style={{ maxHeight: videoHeight }}>
      <WordMeaningModal wordMeaning={mockWordMeaning} />
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
