"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

export type Score = {
  player_name: string;
  player_id: number;
  beatmap_name: string;
  beatmap_id: number;
  year: number;
  pp: number;
  day: number;
};

export type ScoreDraft = {
  attempt: number;
  score: Score;
};

const CORRECT_SCORE: Score = {
  player_name: "Cookiezi",
  player_id: 2324,
  beatmap_name: "xi - Blue Zenith [FOUR DIMENSIONS]",
  beatmap_id: 727,
  year: 2016,
  pp: 727,
  day: 0,
};

export default function Home() {
  const initialScoreDraft = {
    attempt: 0,
    score: {
      player_name: "?",
      player_id: 0,
      beatmap_name: "?",
      beatmap_id: 0,
      year: 0,
      pp: CORRECT_SCORE.pp,
      day: 0,
    },
  };

  const [isValids, setIsValids] = useState<{
    isValidPlayer: boolean;
    isValidMap: boolean;
    isValidYear: boolean;
  }>({
    isValidPlayer: false,
    isValidMap: false,
    isValidYear: false,
  });

  const [scoreDrafts, setScoreDrafts] = useState<ScoreDraft[]>([
    initialScoreDraft,
  ]);

  useEffect(() => {
    console.log(scoreDrafts);
    const lastDraft = scoreDrafts[scoreDrafts.length - 1];
    setIsValids({
      isValidPlayer: lastDraft.score.player_name === CORRECT_SCORE.player_name,
      isValidMap: lastDraft.score.beatmap_name === CORRECT_SCORE.beatmap_name,
      isValidYear: lastDraft.score.year === CORRECT_SCORE.year,
    });
  }, [scoreDrafts]);

  const renderRows = () => {
    return scoreDrafts.map((scoreDraft) => {
      const isValidPlayer =
        scoreDraft.score.player_name.toLowerCase() ===
        CORRECT_SCORE.player_name.toLowerCase();
      const isValidMap =
        scoreDraft.score.beatmap_name.toLowerCase() ===
        CORRECT_SCORE.beatmap_name.toLowerCase();
      const isValidYear = scoreDraft.score.year === CORRECT_SCORE.year;
      const isValidPP = scoreDraft.score.pp === CORRECT_SCORE.pp;

      return (
        <tr className="h-12" key={scoreDraft.attempt}>
          <td
            key={`player_name-${scoreDraft.attempt}`}
            className={isValidPlayer ? "text-green-400" : "text-red-400"}
          >
            {scoreDraft.score.player_name}
          </td>
          <td
            key={`beatmap_name-${scoreDraft.attempt}`}
            className={isValidMap ? "text-green-400" : "text-red-400"}
          >
            {scoreDraft.score.beatmap_name}
          </td>
          <td
            key={`year-${scoreDraft.attempt}`}
            className={isValidYear ? "text-green-400" : "text-red-400"}
          >
            {scoreDraft.score.year || "?"}
          </td>
          <td
            key={`pp-${scoreDraft.attempt}`}
            className={isValidPP ? "text-green-400" : "text-red-400"}
          >
            {scoreDraft.score.pp}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="w-full h-full flex flex-col place-content-start items-center space-y-4">
      <div className="text-6xl font-bold p-8">
        <p>Scoreguessr</p>
      </div>
      <div className="w-2/3 min-h-fit h-2/3 px-8 text-center place-content-start items-center overflow-auto">
        <table className="table-fixed w-full h-fit bg-slate-900  rounded-xl font-bold">
          <thead className="h-12 text-2xl">
            <tr>
              <th className="p-2">Player</th>
              <th className="p-2">Beatmap</th>
              <th className="p-2">Year</th>
              <th className="p-2">PP</th>
            </tr>
          </thead>
          <tbody className="text-lg h-fit">{renderRows()}</tbody>
        </table>
      </div>
      <div className="w-2/3 h-24 p-8 flex flex-row rounded-xl text-center items-center space-x-4">
        <div className="w-1/4 h-12">
          <form
            className="w-full h-full"
            onSubmit={(e) => {
              e.preventDefault();
              const guessedPlayer = (
                e.target as HTMLFormElement
              ).elements.namedItem("player") as HTMLInputElement;
              const player = guessedPlayer.value;
              setScoreDrafts((prevDrafts) => {
                const lastDraft = prevDrafts[prevDrafts.length - 1];
                return [
                  ...prevDrafts,
                  {
                    ...lastDraft,
                    attempt: lastDraft.attempt + 1,
                    score: {
                      ...lastDraft.score,
                      player_name: player,
                    },
                  },
                ];
              });
              guessedPlayer.value = "";
            }}
          >
            <input type="text" name="player" placeholder="Guess player.." />
          </form>
        </div>
        <div className="w-1/2 h-12">
          <form
            className="w-full h-full"
            onSubmit={(e) => {
              e.preventDefault();
              const guessedBeatmap = (
                e.target as HTMLFormElement
              ).elements.namedItem("beatmap") as HTMLInputElement;
              const beatmap = guessedBeatmap.value;
              setScoreDrafts((prevDrafts) => {
                const lastDraft = prevDrafts[prevDrafts.length - 1];
                return [
                  ...prevDrafts,
                  {
                    ...lastDraft,
                    attempt: lastDraft.attempt + 1,
                    score: {
                      ...lastDraft.score,
                      beatmap_name: beatmap,
                    },
                  },
                ];
              });
              guessedBeatmap.value = "";
            }}
          >
            <input type="text" name="beatmap" placeholder="Guess map.." />
          </form>
        </div>
        <div className="w-1/4 h-12">
          <form
            className="w-full h-full"
            onSubmit={(e) => {
              e.preventDefault();
              const guessedYear = (
                e.target as HTMLFormElement
              ).elements.namedItem("year") as HTMLInputElement;
              const year = parseInt(guessedYear.value, 10);
              setScoreDrafts((prevDrafts) => {
                const lastDraft = prevDrafts[prevDrafts.length - 1];
                return [
                  ...prevDrafts,
                  {
                    ...lastDraft,
                    attempt: lastDraft.attempt + 1,
                    score: {
                      ...lastDraft.score,
                      year: year,
                    },
                  },
                ];
              });
              guessedYear.value = "";
            }}
          >
            <input type="text" name="year" placeholder="Guess year.." />
          </form>
        </div>
      </div>
      <div className="absolute bottom-2 text-gray-400">
        Next score in 12 hours (01:00 UTC)
      </div>
    </div>
  );
}
