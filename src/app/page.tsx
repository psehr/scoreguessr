"use client";

import React, { useEffect, useState } from "react";
import { BeatmapSimple, PlayerSimple, Score, ScoreDraft } from "./types";
import MapSearch, { BeatmapCard } from "./views/MapSearch";

import { LuSquarePen } from "react-icons/lu";
import PlayerSearch, { PlayerCard } from "./views/PlayerSearch";

const CORRECT_SCORE: Score = {
  player_name: "Cookiezi",
  player_id: 2324,
  beatmap_name: "xi - Blue Zenith",
  beatmap_id: 727,
  year: 2016,
  pp: 727,
  day: 0,
};

export default function Home() {
  const [currentView, setCurrentView] = useState<string>("main");
  const initialScoreDraft = {
    attempt: 0,
    score: {
      player_name: undefined,
      player_id: 0,
      beatmap_name: undefined,
      beatmap_id: 0,
      year: undefined,
      pp: CORRECT_SCORE.pp,
      day: 0,
    },
    isValidPlayer: false,
    isValidMap: false,
    isValidYear: false,
    isValidPP: true,
  };

  const [scoreDrafts, setScoreDrafts] = useState<ScoreDraft[]>([
    initialScoreDraft,
  ]);

  const [selectedBeatmap, setSelectedBeatmap] = useState<BeatmapSimple>();
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSimple>();
  const [selectedYear, setSelectedYear] = useState<number>();

  useEffect(() => {
    const lastDraft = scoreDrafts[scoreDrafts.length - 1];
    lastDraft.isValidMap && lastDraft.isValidPlayer && lastDraft.isValidYear
      ? console.log("GG")
      : null;
  }, [scoreDrafts]);

  const renderRows = () => {
    return scoreDrafts.map((scoreDraft) => {
      return (
        <tr className="h-12" key={scoreDraft.attempt}>
          <td
            key={`player_name-${scoreDraft.attempt}`}
            className={scoreDraft.isValidPlayer ? "text-green-400" : ""}
          >
            {scoreDraft.score.player_name ?? "Player?"}
          </td>
          <td
            key={`beatmap_name-${scoreDraft.attempt}`}
            className={scoreDraft.isValidMap ? "text-green-400" : ""}
          >
            {scoreDraft.score.beatmap_name ?? "Map?"}
          </td>
          <td
            key={`year-${scoreDraft.attempt}`}
            className={scoreDraft.isValidYear ? "text-green-400" : ""}
          >
            {scoreDraft.score.year || "Year?"}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col place-content-start items-center">
      <div className="w-full h-1/4 bg-gray-950/80 p-8 space-y-2 text-center">
        <p className="text-6xl font-thin">SCOREGUESSR</p>
        <p>Guess the score! (Day {CORRECT_SCORE.day})</p>
        <div className="space-y-4 text-center">
          <p> For today's challenge, you are looking for a score worth:</p>
          <p className="text-4xl font-extrabold text-blue-300">
            {CORRECT_SCORE.pp}pp
          </p>
        </div>
      </div>
      <div className="w-full min-h-fit h-1/2 p-4 px-8 bg-gray-950/90 shadow-lg text-center place-content-center items-center overflow-auto">
        <table className="table-fixed w-full h-fit font-bold overflow-hidden">
          <tbody className="text-4xl h-fit">{renderRows()}</tbody>
        </table>
      </div>
      <div className="bg-gray-950/80 w-full h-1/4 p-8 flex flex-row text-center items-center space-x-4">
        <form
          className="w-full h-full flex flex-col space-y-4 place-content-center items-center"
          onSubmit={(e) => {
            e.preventDefault();
            const guessedPlayer = (
              e.target as HTMLFormElement
            ).elements.namedItem("player") as HTMLInputElement;
            const guessedBeatmap = (
              e.target as HTMLFormElement
            ).elements.namedItem("beatmap") as HTMLInputElement;
            const guessedYear = (
              e.target as HTMLFormElement
            ).elements.namedItem("year") as HTMLInputElement;

            const player =
              guessedPlayer?.value ||
              scoreDrafts[scoreDrafts.length - 1].score.player_name;
            const beatmap =
              guessedBeatmap?.value ||
              scoreDrafts[scoreDrafts.length - 1].score.beatmap_name;
            const year = parseInt(
              guessedYear?.value ||
                scoreDrafts[scoreDrafts.length - 1].score.year?.toString()!,
              10
            );

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
                    beatmap_name: beatmap,
                    year: year,
                  },
                  isValidPlayer:
                    player?.toLowerCase() ===
                    CORRECT_SCORE.player_name?.toLowerCase(),
                  isValidMap:
                    beatmap?.toLowerCase() ===
                    CORRECT_SCORE.beatmap_name?.toLowerCase(),
                  isValidYear: year === CORRECT_SCORE.year,
                },
              ];
            });

            guessedPlayer ? (guessedPlayer.value = "") : null;
            guessedBeatmap ? (guessedBeatmap.value = "") : null;
            guessedYear ? (guessedYear.value = "") : null;
          }}
        >
          <div className="w-2/3 h-12 flex flex-row space-x-4 place-content-center items-center">
            <div className="w-1/4 h-12">
              {scoreDrafts[scoreDrafts.length - 1].isValidPlayer ? null : (
                <div className="relative w-full h-full">
                  {selectedPlayer ? (
                    <button
                      className=""
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentView("PlayerSearch");
                      }}
                    >
                      <PlayerCard player={selectedPlayer} />
                    </button>
                  ) : (
                    <button
                      className=""
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentView("PlayerSearch");
                      }}
                    >
                      Guess player
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="w-1/2 h-12">
              {scoreDrafts[scoreDrafts.length - 1].isValidMap ? null : (
                <div className="relative w-full h-full">
                  {selectedBeatmap ? (
                    <button
                      className="flex flex-row"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentView("MapSearch");
                      }}
                    >
                      <BeatmapCard beatmap={selectedBeatmap} />
                    </button>
                  ) : (
                    <button
                      className=""
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentView("MapSearch");
                      }}
                    >
                      Guess beatmap
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="w-1/4 h-12">
              {scoreDrafts[scoreDrafts.length - 1].isValidYear ? null : (
                <input
                  id="ignore-placeholder"
                  placeholder="Guess year"
                  className="border border-blue-400 bg-gray-950/50 font-semibold"
                  type="number"
                ></input>
              )}
            </div>
          </div>
          <div className="w-2/3 h-12 flex flex-row place-content-center items-center">
            <button type="submit" className=" border-green-400">
              Submit guess
            </button>
          </div>
        </form>
      </div>
      <div className="absolute bottom-2 text-gray-400">
        Next score in 12 hours (01:00 UTC) - Made by @psehr
      </div>
      {currentView === "MapSearch" ? (
        <MapSearch
          selectedBeatmap={selectedBeatmap}
          setSelectedBeatmap={setSelectedBeatmap}
          setSelectedView={setCurrentView}
        />
      ) : null}
      {currentView === "PlayerSearch" ? (
        <PlayerSearch
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
          setSelectedView={setCurrentView}
        />
      ) : null}
    </div>
  );
}
