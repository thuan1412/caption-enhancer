import type { DualCaption } from "~types";
import { mergeCaptions } from "~utils/video";

import { useCaptions } from "./useCaptions";

export const useDualCaptions = (url: string, secondLang?: string) => {
  const { captions: defaultCaptions, loading: defaultLoading } =
    useCaptions(url);

  const { captions: secondCaptions, loading: secondLoading } = useCaptions(
    url,
    secondLang
  );

  let dualCaptions: DualCaption[] = [];
  if (defaultCaptions && secondCaptions) {
    dualCaptions = mergeCaptions(
      defaultCaptions?.events,
      secondCaptions?.events
    );
  }

  return {
    dualCaptions,
    loading: defaultLoading || secondLoading
  };
};
