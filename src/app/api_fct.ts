"use server";

import { v2 } from "osu-api-extended";
import { osuAuth } from "./auth";
import {
  SearchBeatmaps,
  SearchWiki,
} from "osu-api-extended/dist/types/v2/search_all";
import { scores_details_response } from "osu-api-extended/dist/types/v2/scores_details";

export const lookupMaps = async (search_querry: string) => {
  return new Promise<SearchBeatmaps>(async (resolve) => {
    await osuAuth();
    const maps = await v2.search({
      query: search_querry,
      type: "beatmaps",
    });
    resolve(maps);
  });
};

export const lookupPlayers = async (search_querry: string) => {
  return new Promise<SearchWiki>(async (resolve) => {
    await osuAuth();
    const players = await v2.search({
      query: search_querry,
      type: "site",
    });
    resolve(players);
  });
};

export const lookupScore = async (score_id: number) => {
  return new Promise<scores_details_response>(async (resolve) => {
    await osuAuth();
    const score = await v2.scores.details({
      id: score_id,
    });
    resolve(score);
  });
};
