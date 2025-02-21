export type Score = {
  player_name: string;
  player_id: number;
  beatmap_name: string;
  beatmap_id: number;
  year: number;
  pp: number;
  day: number;
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
  score: Score;
  isValidPlayer: boolean;
  isValidMap: boolean;
  isValidYear: boolean;
  isValidPP: boolean;
};
