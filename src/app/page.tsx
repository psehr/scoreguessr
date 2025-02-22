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
  },
  year: 2016,
  pp: 727,
  day: 0,
};

export default function Home() {
  const [currentView, setCurrentView] = useState<
    "Default" | "MapSearch" | "PlayerSearch"
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
      return (
        <tr className="" key={scoreDraft.attempt}>
          <td key={`player_name-${scoreDraft.attempt}`}>
            <div className="w-full flex flex-row place-content-center items-center">
              <div
                className={`w-full flex flex-row place-content-center items-center text-2xl p-2 rounded-xl ${
                  scoreDraft.isValidPlayer ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <PlayerCard player={scoreDraft.score.player} />
              </div>
            </div>
          </td>
          <td key={`beatmap_name-${scoreDraft.attempt}`}>
            <div className="w-full flex flex-row place-content-center items-center">
              <div
                className={`shadow-lg w-full flex flex-row place-content-center items-center text-2xl p-2 rounded-xl ${
                  scoreDraft.isValidMap ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <BeatmapCard beatmap={scoreDraft.score.beatmap} simple />
              </div>
            </div>
          </td>
          <td key={`year-${scoreDraft.attempt}`}>
            <div className="w-full flex flex-row place-content-center items-center">
              <div
                className={`w-full flex flex-row place-content-center items-center text-2xl p-2 rounded-xl ${
                  scoreDraft.isValidYear ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {scoreDraft.score.year || "Year?"}
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
      <div className="w-full min-h-fit h-1/2 p-4 px-8 bg-gray-950/90 shadow-lg text-center place-content-center items-center overflow-auto">
        <table className="table-fixed w-full h-fit font-bold overflow-hidden">
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
