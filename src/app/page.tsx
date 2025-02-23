"use client";

import React, { useEffect, useState } from "react";
import {
  BeatmapSimple,
  GuessableScore,
  PlayerSimple,
  ScoreDraft,
} from "./types";
import MapSearch, { BeatmapCard } from "./views/MapSearch";

import PlayerSearch, { PlayerCard } from "./views/PlayerSearch";
import {
  addDays,
  formatDate,
  formatDistance,
  formatISO,
  subDays,
} from "date-fns";

import * as Flags from "country-flag-icons/react/3x2";

import { LuArrowUp, LuArrowDown, LuCheck } from "react-icons/lu";

const NEXT_DAY_TIMESTAMP = addDays(new Date(), 1).setHours(1, 0, 0);
const CORRECT_SCORE: GuessableScore = {
  id: 453746931,
  player: {
    username: "Cookiezi",
    id: 124493,
    avatar: "https://a.ppy.sh/124493?1546218894.jpg",
    country_code: "KR",
  },
  beatmap: {
    artist: "xi",
    title: "Blue Zenith",
    creator: "Asphyxia",
    id: 292301,
    cover: "https://assets.ppy.sh/beatmaps/292301/covers/cover.jpg",
    rankYear: 2015,
  },
  year: 2016,
  pp: 727,
  yt_link: "https://www.youtube.com/watch?v=UYNpkDrCWtA",
  day_index: 0,
};

export default function Home() {
  const [currentView, setCurrentView] = useState<
    "Default" | "MapSearch" | "PlayerSearch" | "WinScreen"
  >("Default");

  const [scoreDrafts, setScoreDrafts] = useState<ScoreDraft[]>();

  const [selectedBeatmap, setSelectedBeatmap] = useState<BeatmapSimple>();
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSimple>();
  const [selectedYear, setSelectedYear] = useState<number>();

  useEffect(() => {
    if (!scoreDrafts?.length) return;
    const lastDraft = scoreDrafts[scoreDrafts.length - 1];
    lastDraft.isValidMap && lastDraft.isValidPlayer && lastDraft.isValidYear
      ? console.log("GG")
      : null;
  }, [scoreDrafts]);

  const renderRows = () => {
    if (!scoreDrafts?.length) return;

    return scoreDrafts.map((scoreDraft) => {
      let Flag =
        Flags[
          scoreDraft.score.player.country_code.toUpperCase() as keyof typeof Flags
        ];
      return (
        <tr className="" key={scoreDraft.attempt}>
          <td className="w-1/5" key={`player_name-${scoreDraft.attempt}`}>
            <div className="w-full flex flex-row place-content-center items-center">
              <div
                className={`w-full flex flex-row place-content-center items-center text-2xl p-2 rounded-xl ${
                  scoreDraft.isValidPlayer
                    ? "bg-green-600"
                    : scoreDraft.isValidCountry
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
              >
                <div className="w-2/3 flex flex-row place-content-start items-center space-x-2">
                  <PlayerCard player={scoreDraft.score.player} />
                </div>
                <div className="w-1/3 flex flex-row place-content-end items-center space-x-2">
                  <div className="rounded-md overflow-hidden w-12 h-fit">
                    <Flag />
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td className="w-2/5" key={`beatmap_name-${scoreDraft.attempt}`}>
            <div className="w-full flex flex-row place-content-center items-center">
              <div
                className={`shadow-lg w-full flex flex-row place-content-center items-center text-2xl p-2 rounded-xl space-x-2 ${
                  scoreDraft.isValidMap
                    ? "bg-green-600"
                    : scoreDraft.isValidRankedYear
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
              >
                <div className="w-2/3 flex flex-row place-content-start items-center space-x-2">
                  <BeatmapCard beatmap={scoreDraft.score.beatmap} simple />
                </div>
                <div className="w-1/3 flex flex-row place-content-end items-center">
                  <p className={`text-lg px-2 rounded-xl`}>
                    Ranked in {scoreDraft.score.beatmap.rankYear}
                  </p>
                  {scoreDraft.score.beatmap.rankYear <
                  CORRECT_SCORE.beatmap.rankYear ? (
                    <LuArrowUp />
                  ) : CORRECT_SCORE.beatmap.rankYear ==
                    scoreDraft.score.beatmap.rankYear ? null : (
                    <LuArrowDown />
                  )}
                </div>
              </div>
            </div>
          </td>
          <td className="w-1/5" key={`year-${scoreDraft.attempt}`}>
            <div className="w-full flex flex-row place-content-center items-center">
              <div
                className={`w-full flex flex-row place-content-center items-center text-2xl p-2 rounded-xl ${
                  scoreDraft.isValidYear ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {scoreDraft.score.year || "Year?"}
                {scoreDraft.score.year < CORRECT_SCORE.year ? (
                  <LuArrowUp />
                ) : CORRECT_SCORE.year == scoreDraft.score.year ? null : (
                  <LuArrowDown />
                )}
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col place-content-start items-center">
      <div className="w-full h-1/4 bg-gray-950/80 p-8 space-y-2 text-center">
        <p className="text-6xl font-thin">SCOREGUESSR</p>
        <div className="space-y-4 text-center">
          <p className="text-3xl">Today, you are looking for a score worth:</p>
          <p className="text-4xl font-extrabold text-blue-400">
            {CORRECT_SCORE.pp}pp
          </p>
        </div>
      </div>
      <div className="w-full min-h-fit h-1/2 p-4 px-8 bg-gray-950/90 shadow-lg text-center flex flex-row place-content-center overflow-auto">
        <table className="table-fixed w-3/4 h-fit font-bold overflow-hidden">
          <tbody className="text-4xl h-fit w-full">{renderRows()}</tbody>
        </table>
      </div>
      <div className="bg-gray-950/80 w-full h-1/4 p-8 flex flex-col space-y-4 text-center items-center">
        <div className="w-2/3 h-12 flex flex-row space-x-4 place-content-center items-center">
          <div className="w-1/4 h-12">
            <div className="relative w-full h-full">
              {selectedPlayer ? (
                <button
                  className="flex place-content-center items-center"
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
          </div>
          <div className="w-1/2 h-12">
            <div className="relative w-full h-full">
              {selectedBeatmap ? (
                <button
                  className="flex place-content-center items-center"
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
          </div>
          <div className="w-1/4 h-12">
            <input
              id="ignore-placeholder"
              placeholder="Guess year"
              className="border border-blue-400 bg-gray-950/50 font-semibold"
              type="number"
              onChange={(e) => {
                setSelectedYear(parseInt(e.target.value));
              }}
            ></input>
          </div>
        </div>
        <div className="w-2/3 h-12 flex flex-row place-content-center items-center">
          <button
            type="submit"
            className=" border-green-400"
            onClick={() => {
              if (!selectedPlayer || !selectedBeatmap || !selectedYear) return;
              const newScoreDraft: ScoreDraft = {
                score: {
                  player: selectedPlayer,
                  beatmap: selectedBeatmap,
                  year: selectedYear,
                },
                isValidPlayer: selectedPlayer.id === CORRECT_SCORE.player.id,
                isValidMap: selectedBeatmap.id === CORRECT_SCORE.beatmap.id,
                isValidYear: selectedYear === CORRECT_SCORE.year,
                isValidPP: true,
                isValidCountry:
                  selectedPlayer.country_code ===
                  CORRECT_SCORE.player.country_code,
                isValidRankedYear:
                  selectedBeatmap.rankYear === CORRECT_SCORE.beatmap.rankYear,
                attempt: scoreDrafts ? scoreDrafts.length + 1 : 1,
              };
              setScoreDrafts(
                scoreDrafts ? [...scoreDrafts, newScoreDraft] : [newScoreDraft]
              );
            }}
          >
            Submit guess
          </button>
        </div>
      </div>
      <div className="absolute bottom-2 text-gray-400">
        Day {CORRECT_SCORE.day_index} - Next score{" "}
        {formatDistance(NEXT_DAY_TIMESTAMP, new Date(), {
          addSuffix: true,
        })}{" "}
        - Made by @psehr
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
