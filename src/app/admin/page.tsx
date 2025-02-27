"use client";

import { useEffect, useState } from "react";
import {
  BeatmapSimple,
  GuessableScore,
  mod,
  PlayerSimple,
  skillsetTag,
} from "../types";
import { lookupMap, lookupScore } from "../api_fct";
import { BeatmapCard, Loading } from "../views/MapSearch";
import { PlayerCard } from "../views/PlayerSearch";
import {
  addNewScore,
  fetchAllScores,
  fetchCurrentScore,
} from "../_services/firebase/scores";

export default function AdminPanel() {
  const [scoreID, setScoreID] = useState<number | null>(null);
  const [ytLink, setYtLink] = useState<string | null>(null);
  const [pp, setPP] = useState<number | null>(null);
  const [newGuessableScore, setNewGuessableScore] = useState<GuessableScore>();
  const [currentDayIndex, setCurrentDayIndex] = useState<number>();
  const [forcedRefresh, setForcedRefresh] = useState(true);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);

  useEffect(() => {
    console.log(selectedMods, selectedTags);
  }, [selectedMods, selectedTags]);

  useEffect(() => {
    console.log(newGuessableScore);
  }, [newGuessableScore]);

  const [allScores, setAllScores] = useState<GuessableScore[]>([]);

  useEffect(() => {
    fetchAllScores().then((scores) => setAllScores(scores));
    fetchCurrentScore().then((score) => setCurrentDayIndex(score.day_index));
  }, []);

  useEffect(() => {
    setNewGuessableScore(undefined);
    fetchAllScores().then((scores) => setAllScores(scores));
    fetchCurrentScore().then((score) => setCurrentDayIndex(score.day_index));
  }, [forcedRefresh]);

  const renderScores = () => {
    if (allScores.length) {
      return allScores.map((score) => {
        return (
          <div
            key={score.day_index}
            className={`relative w-full flex flex-row space-x-4 p-2 items-center ${
              score.day_index == currentDayIndex
                ? "bg-green-600/30"
                : "bg-black/30"
            }`}
          >
            <BeatmapCard beatmap={score.beatmap} />
            <PlayerCard player={score.player} />
            <p>
              {score.pp}pp in {score.year}
            </p>
            <a href={score.yt_link} className="underline">
              YouTube link
            </a>
            <a
              href={`https://osu.ppy.sh/scores/${score.id}`}
              className="underline"
            >
              Score link
            </a>
            <div className="absolute right-0 px-4 text-2xl font-bold w-fit h-fit">
              <p>Day {score.day_index}</p>
            </div>
          </div>
        );
      });
    }
  };

  const renderTagsCheckboxes = () => {
    return skillsetTag.map((tag) => {
      return (
        <div
          className="w-full h-4 flex flex-row space-x-2 place-content-start items-center text-sm"
          key={tag}
        >
          <input
            type="checkbox"
            className="w-4"
            id={tag}
            onChange={(e) => {
              e.target.checked
                ? setSelectedTags([...selectedTags, tag])
                : setSelectedTags(selectedTags.filter((value) => value != tag));
            }}
          />
          <label>{tag}</label>
        </div>
      );
    });
  };

  const renderModsCheckboxes = () => {
    return mod.map((mod) => {
      return (
        <div
          className="w-full h-4 flex flex-row space-x-2 place-content-start items-center"
          key={mod}
        >
          <input
            type="checkbox"
            className="w-4"
            id={mod}
            onChange={(e) => {
              e.target.checked
                ? setSelectedMods([...selectedMods, mod])
                : setSelectedMods(selectedMods.filter((value) => value != mod));
            }}
          />
          <label>{mod}</label>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-row w-full h-full">
      <div className="w-1/3 h-full bg-black/15 flex flex-col place-content-center items-center p-4 space-y-4">
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
        <div className="w-full flex flex-row place-content-center items-start space-x-2">
          <div>{renderTagsCheckboxes()}</div>
          <div>{renderModsCheckboxes()}</div>
        </div>
        <button
          className="h-fit w-64"
          onClick={() => {
            if (scoreID) {
              lookupScore(scoreID).then(async (score) => {
                const ranked_year = new Date(
                  Date.parse((await lookupMap(score.beatmapset.id)).ranked_date)
                ).getFullYear();

                const beatmap: BeatmapSimple = {
                  artist: score.beatmapset.artist,
                  title: score.beatmapset.title,
                  creator: score.beatmapset.creator,
                  id: score.beatmapset.id,
                  cover: score.beatmapset.covers.cover,
                  rankYear: ranked_year,
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
                  mods: selectedMods,
                  tags: selectedTags,
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
            if (newGuessableScore) {
              addNewScore(newGuessableScore).then(() => {
                window.location.reload();
              });
            } else alert("an error occurred");
          }}
        >
          Submit
        </button>
      </div>
      <div className="w-2/3 h-full flex flex-col place-content-center items-center">
        {allScores.length ? renderScores() : <Loading />}
      </div>
    </div>
  );
}
