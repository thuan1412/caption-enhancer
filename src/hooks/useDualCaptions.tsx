import { useStorage } from "@plasmohq/storage/hook";

import type { DualCaption } from "~types";
import { mergeCaptions } from "~utils/video";

import { useCaptions } from "./useCaptions";

export const useDualCaptions = (url: string, secondLang?: string) => {
  const { captions: defaultCaptions, loading: defaultLoading } =
    useCaptions(url);

  const [isShowSecondCaptions] = useStorage("isShowSecondCaptions");
  const { captions: secondCaptions, loading: secondLoading } = useCaptions(
    url,
    secondLang,
    { enable: isShowSecondCaptions },
  );

  let dualCaptions: DualCaption[] = [];

  if (defaultCaptions !== null) {
    dualCaptions = mergeCaptions(
      defaultCaptions?.events ?? [],
      secondCaptions?.events ?? [],
    );
  }

  return {
    dualCaptions,
    loading: defaultLoading || secondLoading,
  };
};
