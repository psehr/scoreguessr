"use client";

import React, { useEffect, useState } from "react";
import { BeatmapSimple, PlayerSimple, Score, ScoreDraft } from "./types";
import MapSearch, { BeatmapCard } from "./views/MapSearch";

import { LuSquarePen } from "react-icons/lu";
import PlayerSearch from "./views/PlayerSearch";

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
      player_name: "?",
      player_id: 0,
      beatmap_name: "?",
      beatmap_id: 0,
      year: 0,
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
            className={
              scoreDraft.isValidPlayer ? "text-green-400" : "text-red-400"
            }
          >
            {scoreDraft.score.player_name}
          </td>
          <td
            key={`beatmap_name-${scoreDraft.attempt}`}
            className={
              scoreDraft.isValidMap ? "text-green-400" : "text-red-400"
            }
          >
            {scoreDraft.score.beatmap_name}
          </td>
          <td
            key={`year-${scoreDraft.attempt}`}
            className={
              scoreDraft.isValidYear ? "text-green-400" : "text-red-400"
            }
          >
            {scoreDraft.score.year || "?"}
          </td>
          <td
            key={`pp-${scoreDraft.attempt}`}
            className={scoreDraft.isValidPP ? "text-green-400" : "text-red-400"}
          >
            {scoreDraft.score.pp}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col place-content-start items-center">
      <div className="text-6xl font-bold p-8">
        <p>Scoreguessr</p>
      </div>
      <div className="w-2/3 min-h-fit h-2/3 px-8 text-center place-content-start items-center overflow-auto">
        <table className="table-fixed w-full h-fit bg-black/40 rounded-xl font-bold overflow-hidden">
          <thead className="h-14 text-2xl bg-slate-950">
            <tr className="">
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
        <form
          className="w-full h-full flex flex-row space-x-4"
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
                scoreDrafts[scoreDrafts.length - 1].score.year.toString(),
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
                    player.toLowerCase() ===
                    CORRECT_SCORE.player_name.toLowerCase(),
                  isValidMap:
                    beatmap.toLowerCase() ===
                    CORRECT_SCORE.beatmap_name.toLowerCase(),
                  isValidYear: year === CORRECT_SCORE.year,
                },
              ];
            });

            guessedPlayer ? (guessedPlayer.value = "") : null;
            guessedBeatmap ? (guessedBeatmap.value = "") : null;
            guessedYear ? (guessedYear.value = "") : null;
          }}
        >
          <div className="w-1/4 h-12">
            {scoreDrafts[scoreDrafts.length - 1].isValidPlayer ? (
              <p className="w-full h-full flex items-center place-content-center rounded-xl text-green-400 bg-slate-900">
                Correct player!
              </p>
            ) : (
              <div className="relative w-full h-full">
                {selectedPlayer ? (
                  <div className="w-full h-full flex flex-row items-center rounded-xl bg-black/40 px-2">
                    <p>{selectedPlayer.username}</p>
                    <LuSquarePen
                      size={30}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentView("PlayerSearch");
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                ) : (
                  <button
                    className="w-full h-full rounded-xl bg-black/40 text-gray-400 hover:bg-black/40"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView("PlayerSearch");
                    }}
                  >
                    Guess player..
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="w-1/2 h-12">
            {scoreDrafts[scoreDrafts.length - 1].isValidMap ? (
              <p className="w-full h-full flex items-center place-content-center rounded-xl text-green-400 bg-slate-900">
                Correct map!
              </p>
            ) : (
              <div className="relative w-full h-full">
                {selectedBeatmap ? (
                  <div className="w-full h-full flex flex-row items-center rounded-xl bg-black/40 px-2">
                    <BeatmapCard beatmap={selectedBeatmap} />
                    <LuSquarePen
                      size={30}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentView("MapSearch");
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                ) : (
                  <button
                    className="w-full h-full rounded-xl bg-black/40 text-gray-400 hover:bg-black/40"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView("MapSearch");
                    }}
                  >
                    Guess map..
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="w-1/4 h-12">
            {scoreDrafts[scoreDrafts.length - 1].isValidYear ? (
              <p className="w-full h-full flex items-center place-content-center rounded-xl text-green-400 bg-slate-900">
                Correct year!
              </p>
            ) : (
              <input type="text" name="year" placeholder="Guess year.." />
            )}
          </div>
          <button type="submit" className="hidden"></button>
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
