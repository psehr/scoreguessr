export type GuessableScore = {
  id: number;
  player: PlayerSimple;
  beatmap: BeatmapSimple;
  year: number;
  pp: number;
  yt_link: string;
  day_index: number; // number of days since the start of the project, used to find the latest score to guess
};

export type HypotheticalScore = {
  player: PlayerSimple;
  beatmap: BeatmapSimple;
  year: number;
};

export type BeatmapSimple = {
  artist: string;
  title: string;
  creator: string;
  id: number;
  cover: string;
  rankYear: number;
};

export type PlayerSimple = {
  username: string;
  id: number;
  avatar: string;
  country_code: string;
};

export type ScoreDraft = {
  attempt: number;
  score: HypotheticalScore;
  isValidPlayer: boolean;
  isValidMap: boolean;
  isValidYear: boolean;
  isValidPP: boolean;
  isValidCountry: boolean;
  isValidRankedYear: boolean;
};
