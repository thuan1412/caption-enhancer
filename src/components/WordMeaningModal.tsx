import React, { useEffect, useRef } from "react";

import { useWordModalStore } from "~store/wordModalStore";
import type { WordMeaning } from "~types";

interface Props {
  word: string;
}

const wordMeaning: WordMeaning = {
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

const WordMeaningComponent = () => {
  const word = useWordModalStore((state) => state.word);
  const isShowModal = useWordModalStore((state) => state.isShow);
  const hideModal = useWordModalStore((state) => state.hideModal);
  const modalPos = useWordModalStore((state) => state.modalPos);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        hideModal();
      }
    };
    const shadowRoot = document
      .querySelector("#secondary > plasmo-csui")
      .shadowRoot.querySelector("#plasmo-shadow-container");

    shadowRoot.addEventListener("mousedown", handleClickOutside);
    return () => {
      shadowRoot.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isShowModal) return null;
  return (
    <div
      className="absolute overflow-scroll p-2 bg-base-200 rounded-lg shadow-md"
      ref={ref}
      style={{
        top: modalPos.top + "px",
        left: modalPos.left + "px",
        height: 150,
        width: 300,
      }}>
      <h2 className="text-2xl font-bold mb-4 text-primary">
        {/* {wordMeaning.word} */}
        {word}
      </h2>

      {/* Phonetics */}
      {/* {wordMeaning.phonetics.map((phonetic, index) => ( */}
      {/*   <div key={index} className="mb-4"> */}
      {/*     {phonetic.text && ( */}
      {/*       <p className="text-sm text-gray-600"> */}
      {/*         <span className="font-bold">Phonetic:</span> {phonetic.text} */}
      {/*       </p> */}
      {/*     )} */}
      {/*     {phonetic.audio && ( */}
      {/*       <audio controls className="mt-2"> */}
      {/*         <source src={phonetic.audio} type="audio/mp3" /> */}
      {/*         Your browser does not support the audio element. */}
      {/*       </audio> */}
      {/*     )} */}
      {/*   </div> */}
      {/* ))} */}

      {/* Meanings */}
      {wordMeaning.meanings.map((meaning, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{meaning.partOfSpeech}</h3>
          {meaning.definitions.slice(0, 2).map((definition, idx) => (
            <div key={idx} className="mb-2 p-2 bg-base-100 rounded-md">
              <p className="text-gray-700">
                <span className="font-medium">Definition:</span>{" "}
                {definition.definition}
              </p>
              {definition.example && (
                <p className="italic text-sm text-gray-500">
                  <span className="font-medium">Example:</span> "
                  {definition.example}"
                </p>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Source URLs */}
      {/* <div className="mt-4"> */}
      {/*   <h4 className="font-semibold">Source:</h4> */}
      {/*   {wordMeaning.sourceUrls.map((url, index) => ( */}
      {/*     <a */}
      {/*       key={index} */}
      {/*       href={url} */}
      {/*       className="link link-primary block mt-2" */}
      {/*       target="_blank" */}
      {/*       rel="noopener noreferrer"> */}
      {/*       {url} */}
      {/*     </a> */}
      {/*   ))} */}
      {/* </div> */}
    </div>
  );
};

export default WordMeaningComponent;
