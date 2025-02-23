"use client";

import { useEffect, useState } from "react";
import { BeatmapSimple, GuessableScore, PlayerSimple } from "../types";
import { lookupScore } from "../api_fct";
import { BeatmapCard } from "../views/MapSearch";
import { PlayerCard } from "../views/PlayerSearch";

export default function AdminPanel() {
  const [scoreID, setScoreID] = useState<number | null>(null);
  const [ytLink, setYtLink] = useState<string | null>(null);
  const [pp, setPP] = useState<number | null>(null);
  const [newGuessableScore, setNewGuessableScore] = useState<GuessableScore>();

  useEffect(() => {
    console.log(newGuessableScore);
  }, [newGuessableScore]);

  return (
    <div className="flex flex-row w-full h-full">
      <div className="w-1/2 h-full bg-black/15 flex flex-col place-content-center items-center p-4 space-y-4">
        <input
          type="number"
          className="h-fit w-64 p-1"
          placeholder="Enter score id here.."
          onChange={(e) => setScoreID(parseInt(e.target.value))}
        />
        <input
          type="number"
          className="h-fit w-64 p-1"
          placeholder="Enter pp here.."
          onChange={(e) => setPP(parseInt(e.target.value))}
        />
        <input
          type="text"
          className="h-fit w-64 p-1"
          placeholder="Enter youtube url here.."
          onChange={(e) => setYtLink(e.target.value)}
        />
        <button
          className="h-fit w-64"
          onClick={() => {
            if (scoreID) {
              lookupScore(scoreID).then((score) => {
                const beatmap: BeatmapSimple = {
                  artist: score.beatmapset.artist,
                  title: score.beatmapset.title,
                  creator: score.beatmapset.creator,
                  id: score.beatmapset.id,
                  cover: score.beatmapset.covers.cover,
                  rankYear: 0,
                };

                const player: PlayerSimple = {
                  username: score.user.username,
                  id: score.user.id,
                  avatar: score.user.avatar_url,
                  country_code: score.user.country_code,
                };
                setNewGuessableScore({
                  id: score.id,
                  player: player,
                  beatmap: beatmap,
                  year: new Date(score.ended_at).getFullYear(),
                  day_index: 0,
                  pp: pp || 0,
                  yt_link: ytLink || "",
                });
              });
            }
          }}
        >
          Look up
        </button>
        <div className="flex flex-col place-content-center items-center space-y-4">
          {newGuessableScore ? (
            <>
              <BeatmapCard beatmap={newGuessableScore?.beatmap} />
              <PlayerCard player={newGuessableScore.player} />
              <p>
                {newGuessableScore.pp}pp in {newGuessableScore.year}
              </p>
              <iframe
                className="w-64 h-fit"
                id="ytplayer"
                itemType="text/html"
                width="640"
                height="360"
                src={`https://www.youtube.com/embed/${
                  newGuessableScore.yt_link.split("=")[1]
                }`}
              ></iframe>
            </>
          ) : null}
        </div>
        <button
          className="w-64 h-fit"
          onClick={() => {
            console.log(
              `"https://www.youtube.com/embed/${
                newGuessableScore?.yt_link.split("=")[1]
              }?origin=http://example.com"`
            );
          }}
        >
          Submit
        </button>
      </div>
      <div className="w-1/2 h-full flex flex-row place-content-center items-center">
        <p className="text-6xl text-gray-600 font-extrabold">
          Days list goes here
        </p>
      </div>
    </div>
  );
}
