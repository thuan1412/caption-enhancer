import { useEffect, useState } from "react";

import type { TimedTextResponse } from "~types";
import { getTimedTextURL } from "~utils/ytbClient";

export const getCaptions = async (urlStr: string) => {
  const response = await fetch(urlStr);
  const captionsRes = await response.json();

  return captionsRes;
};

export const useCaptions = (
  url: string,
  tlang?: string,
  options: { enable: boolean } = { enable: true },
) => {
  const [captions, setCaptions] = useState<TimedTextResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!url) {
      return;
    }
    const timedtextUrl = getTimedTextURL(url, {
      language: tlang,
      isGenerated: true,
    });
    const fetchCaptions = async () => {
      setLoading(true);
      try {
        const data = await getCaptions(timedtextUrl);
        setCaptions(data);
      } catch (error) {
        setCaptions(null);
        console.error("Error fetching captions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (options?.enable) {
      fetchCaptions();
    }
  }, [url, options.enable, tlang]);

  if (options?.enable === false) {
    return { captions: null, loading: false };
  }
  return { captions, loading };
};
