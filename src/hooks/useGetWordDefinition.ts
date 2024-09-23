import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import type { WordDefinitionResponse } from "~types";

const fetchWordDefinition = async (word: string) => {
  const response = await axios.get(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
  );
  return response.data;
};

export const useWordDefinition = (word: string) => {
  return useQuery<WordDefinitionResponse>({
    queryKey: ["wordDefinition", word],
    queryFn: () => fetchWordDefinition(word),
    staleTime: 15 * 60 * 1000,
    retry: 1,
    enabled: !!word,
  });
};
