export type GuessableScore = {
  id: number;
  player: PlayerSimple;
  beatmap: BeatmapSimple;
  year: number;
  pp: number;
  day: number;
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
};
