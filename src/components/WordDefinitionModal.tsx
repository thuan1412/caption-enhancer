import { isError } from "util";
import axios from "axios";
import React, { useEffect, useRef } from "react";

import { useWordDefinition } from "~hooks/useGetWordDict";
import { useWordModalStore } from "~store/wordModalStore";
import type { WordDefinition } from "~types";

interface Props {
  word: string;
}

const WordDefinitionComponent = () => {
  const word = useWordModalStore((state) => state.word);
  const { isLoading, isError, data } = useWordDefinition(word);
  const isShowModal = useWordModalStore((state) => state.isShow);
  const hideModal = useWordModalStore((state) => state.hideModal);
  const modalPos = useWordModalStore((state) => state.modalPos);
  const ref = useRef<HTMLDivElement>(null);

  const wordDefinition = data ? data[0] : null;

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
  if (isLoading || isError || !wordDefinition) return <div>Loading...</div>;
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
      {wordDefinition.meanings.map((meaning, index) => (
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

export default WordDefinitionComponent;
