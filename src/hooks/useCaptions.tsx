import { useEffect, useState } from "react";

import type { TimedTextResponse } from "~types";
import { getTimedTextURL } from "~utils/ytbClient";

export const getCaptions = async (urlStr: string) => {
  const response = await fetch(urlStr);
  const captionsRes = await response.json();

  return captionsRes;
};

export const useCaptions = (url: string, tlang?: string) => {
  const [captions, setCaptions] = useState<TimedTextResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!url) {
      return;
    }
    const timedtextUrl = getTimedTextURL(url, {
      language: tlang,
      isGenerated: true
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

    fetchCaptions();
  }, [url]);

  return { captions, loading };
};
