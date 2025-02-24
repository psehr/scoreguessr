"use client";

import React, { useEffect, useState } from "react";
import {
  BeatmapSimple,
  GuessableScore,
  PlayerSimple,
  ScoreDraft,
} from "./types";
import MapSearch, { BeatmapCard, Loading } from "./views/MapSearch";

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
import {
  fetchCurrentScore,
  fetchNextScoreTimestamp,
} from "./_services/firebase/scores";

export default function Home() {
  const [currentView, setCurrentView] = useState<
    "Default" | "MapSearch" | "PlayerSearch" | "WinScreen" | "Loading"
  >("Default");

  const [todayScore, setTodayScore] = useState<GuessableScore>();
  const [nextScoreTimestamp, setNextScoreTimestamp] = useState<number>();
  useEffect(() => {
    setCurrentView("Loading");
    fetchCurrentScore().then((score) => {
      setTodayScore(score);
      setCurrentView("Default");
      fetchNextScoreTimestamp().then((timestamp) =>
        setNextScoreTimestamp(timestamp)
      );
    });
  }, []);

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
                  <div className="rounded-md overflow-hidden w-8 h-fit">
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
                  todayScore?.beatmap.rankYear! ? (
                    <LuArrowUp />
                  ) : todayScore?.beatmap.rankYear ==
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
                {scoreDraft.score.year < todayScore?.year! ? (
                  <LuArrowUp />
                ) : todayScore?.year == scoreDraft.score.year ? null : (
                  <LuArrowDown />
                )}
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };

  if (!todayScore) {
    return (
      <div className="relative w-full h-full flex flex-col place-content-center items-center bg-gray-950/80">
        <Loading />
      </div>
    );
  } else
    return (
      <div className="relative w-full h-full flex flex-col place-content-start items-center">
        <div className="w-full h-1/4 bg-gray-950/80 p-8 space-y-2 text-center flex flex-col place-content-center items-center">
          <p className="h-1/2 text-6xl font-thin">SCOREGUESSR</p>
          <div className="h-1/2 w-fit px-8 rounded-xl bg-white/20 space-x-2 font-semibold text-3xl text-center flex flex-row items-center place-content-center">
            <p className="">You are looking for a score worth</p>
            <p className="text-blue-400">{todayScore?.pp}pp.</p>
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
                    Select player
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
                    Select beatmap
                  </button>
                )}
              </div>
            </div>
            <div className="w-1/4 h-12">
              <input
                id="ignore-placeholder"
                placeholder="Select year"
                className="border border-blue-600 bg-blue-600/10 font-semibold"
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
              className=" border-green-400 bg-green-600/10"
              onClick={() => {
                if (!selectedPlayer || !selectedBeatmap || !selectedYear)
                  return;
                const newScoreDraft: ScoreDraft = {
                  score: {
                    player: selectedPlayer,
                    beatmap: selectedBeatmap,
                    year: selectedYear,
                  },
                  isValidPlayer: selectedPlayer.id === todayScore?.player.id,
                  isValidMap: selectedBeatmap.id === todayScore?.beatmap.id,
                  isValidYear: selectedYear === todayScore?.year,
                  isValidPP: true,
                  isValidCountry:
                    selectedPlayer.country_code ===
                    todayScore?.player.country_code,
                  isValidRankedYear:
                    selectedBeatmap.rankYear === todayScore?.beatmap.rankYear,
                  attempt: scoreDrafts ? scoreDrafts.length + 1 : 1,
                };
                setScoreDrafts(
                  scoreDrafts
                    ? [...scoreDrafts, newScoreDraft]
                    : [newScoreDraft]
                );
              }}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="absolute bottom-2 text-gray-400">
          Day {todayScore?.day_index} - Next score{" "}
          {formatDistance(nextScoreTimestamp ?? 0, new Date(), {
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
