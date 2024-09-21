export type DualCaption = {
  timeInMs: number;
  timestamp: string;
  firstLanguage: string;
  secondLanguage: string;
};

export interface TimedTextResponse {
  wireMagic: string;
  pens: Pen[];
  wsWinStyles: WsWinStyle[];
  wpWinPositions: WpWinPosition[];
  events: Event[];
}

export interface Pen {}

export interface WsWinStyle {
  mhModeHint?: number;
  juJustifCode?: number;
  sdScrollDir?: number;
}

export interface WpWinPosition {
  apPoint?: number;
  ahHorPos?: number;
  avVerPos?: number;
  rcRows?: number;
  ccCols?: number;
}

export interface Event {
  tStartMs: number;
  dDurationMs: number;
  id?: number;
  wpWinPosId?: number;
  wsWinStyleId?: number;
  wWinId?: number;
  segs?: Seg[];
  aAppend?: number;
}

export interface Seg {
  utf8: string;
  acAsrConf?: number;
  tOffsetMs?: number;
}

export type WordMeaningResponse = WordMeaning[];

export interface WordMeaning {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: License2;
  sourceUrls: string[];
}

export interface Phonetic {
  audio: string;
  sourceUrl?: string;
  license?: License;
  text?: string;
}

export interface License {
  name: string;
  url: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface Definition {
  definition: string;
  synonyms: any[];
  antonyms: any[];
  example?: string;
}

export interface License2 {
  name: string;
  url: string;
}
