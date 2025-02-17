"use client";

import Image from "next/image";
import React, { useState } from "react";

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
  try: number;
  score: Score;
};

const CORRECT_SCORE: Score = {
  player_name: "Cookiezi",
  player_id: 2324,
  beatmap_name: "xi - Blue Zenith [FOUR DIMENSIONS]",
  beatmap_id: 727,
  year: 2014,
  pp: 727,
  day: 0,
};

export default function Home() {
  const [scoreDraft, setScoreDraft] = useState({
    try: 0,
    score: {
      player_name: "?",
      player_id: 0,
      beatmap_name: "?",
      beatmap_id: 0,
      year: 0,
      pp: CORRECT_SCORE.pp,
      day: 0,
    },
  } as ScoreDraft);

  const renderRows = (scoreDrafts: ScoreDraft[]) => {
    let rows: React.ReactNode[] = [];
    scoreDrafts.forEach((scoreDraft) => {
      rows.push(
        <tr className="h-12">
          <td className="text-red-400">{scoreDraft.score.player_name}</td>
          <td className="text-red-400">{scoreDraft.score.beatmap_name}</td>
          <td className="text-red-400">{scoreDraft.score.year || "?"}</td>
          <td className="text-green-400">{scoreDraft.score.pp}</td>
        </tr>
      );
    });
    return rows;
  };

  return (
    <div className="w-full h-full flex flex-col place-content-center items-center space-y-4">
      <div className="text-6xl font-bold p-8">
        <p>Scoreguessr</p>
      </div>
      <div className="w-2/3 h-fit max-h-2/3 p-8 bg-slate-900 rounded-xl text-center place-content-start items-center">
        <table className="table-fixed w-full h-fit font-bold">
          <thead className="text-2xl">
            <tr>
              <th className="p-2">Player</th>
              <th className="p-2">Beatmap</th>
              <th className="p-2">Year</th>
              <th className="p-2">PP</th>
            </tr>
          </thead>
          <tbody className="text-lg">{renderRows([scoreDraft])}</tbody>
        </table>
      </div>
      <div className="w-2/3 h-24 p-8 flex flex-row rounded-xl text-center items-center space-x-4">
        <div className="w-1/4 h-12">
          <input type="text" placeholder="Guess player.." />
        </div>
        <div className="w-1/2 h-12">
          <input type="text" placeholder="Guess map.." />
        </div>
        <div className="w-1/4 h-12">
          <input type="text" placeholder="Guess year.." />
        </div>
      </div>
      <div className="absolute bottom-2 text-gray-400">
        Next score in 12 hours (01:00 UTC)
      </div>
    </div>
  );
}
