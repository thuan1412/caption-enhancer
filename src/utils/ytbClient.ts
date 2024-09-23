type TimedTextOptions = {
  language?: string;
  isGenerated?: boolean;
};

/**
 * kind params means use the origin or genarated title
 */
export const getTimedTextURL = (
  urlStr: string,
  options: TimedTextOptions,
): string => {
  const url = new URL(urlStr);

  const enLangCode = new Set(["en", "en-US", "en-GB"]);

  if (enLangCode.has(options.language)) {
    options.language = url.searchParams.get("lang");
  }

  url.searchParams.set("isBot", "true");
  if (options.language) {
    if (options.isGenerated) {
      url.searchParams.set("tlang", options.language);
    } else {
      url.searchParams.set("lang", options.language);
    }
  }

  return url.toString();
};
