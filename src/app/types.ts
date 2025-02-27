import { ModsEnum } from "osu-api-extended";

export const skillsetTag = [
  "Gimmick/Reading",
  "High AR",
  "Low AR",
  "Precision",
  "Speed",
  "Fingercontrol",
  "Streams",
  "Bursts",
  "Fast aim",
  "Classic aim",
  "Weird aim",
  "Flow aim",
  "Alternate",
  "Sliders/Technical",
  "Versatile",
];

export const mod = ["NM", "HD", "HR", "DT", "EZ", "FL", "NF"];

export type GuessableScore = {
  id: number;
  player: PlayerSimple;
  beatmap: BeatmapSimple;
  year: number;
  pp: number;
  yt_link: string;
  day_index: number; // number of days since the start of the project, used to find the latest score to guess
  tags?: typeof skillsetTag;
  mods?: typeof mod;
  acc?: number;
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
