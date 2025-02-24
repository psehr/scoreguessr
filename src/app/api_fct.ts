"use server";

import { v2 } from "osu-api-extended";
import { osuAuth } from "./auth";
import {
  SearchBeatmaps,
  SearchWiki,
} from "osu-api-extended/dist/types/v2/search_all";
import { scores_details_response } from "osu-api-extended/dist/types/v2/scores_details";
import { beatmaps_lookup_set_response } from "osu-api-extended/dist/types/v2/beatmaps_lookup_set";
import { beatmaps_details_set_response } from "osu-api-extended/dist/types/v2/beatmaps_details_set";

export const lookupMaps = async (search_querry: string) => {
  return new Promise<SearchBeatmaps>(async (resolve) => {
    await osuAuth();
    const maps = await v2.search({
      query: search_querry,
      type: "beatmaps",
      _nsfw: true,
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

export const lookupMap = async (map_id: number) => {
  return new Promise<beatmaps_details_set_response>(async (resolve) => {
    await osuAuth();
    const map = await v2.beatmaps.details({ id: map_id, type: "set" });
    resolve(map);
  });
};
