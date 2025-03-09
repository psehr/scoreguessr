"use client";

import { useEffect, useState } from "react";
import {
  BeatmapSimple,
  GuessableScore,
  OsuUser,
  PlayerSimple,
  skillsetTag,
} from "../types";
import { lookupMap, lookupScore } from "../_services/osu_api/api_fct";
import { BeatmapCard, Loading } from "../views/MapSearch";
import { PlayerCard } from "../views/PlayerSearch";
import {
  addNewScore,
  fetchAllScores,
  fetchCurrentScore,
} from "../_services/firebase/scores";
import { useSession } from "next-auth/react";
import Error from "next/error";

export default function AdminPanel() {
  const session = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<OsuUser | undefined>();

  useEffect(() => {
    setIsAuthenticated(session.status == "authenticated");
    session.status == "authenticated"
      ? setCurrentUser({
          id: parseInt(session.data.user?.image?.split("/")[3]!),
          name: session.data.user?.name!,
          image: session.data.user?.image!,
          country_code: "FR",
        })
      : setCurrentUser(undefined);
  }, [session.status]);

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
          className="w-48 h-4 flex flex-row space-x-2 place-content-start items-center text-sm"
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

  // const renderModsCheckboxes = () => {
  //   return mod.map((mod) => {
  //     return (
  //       <div
  //         className="w-full h-4 flex flex-row space-x-2 place-content-start items-center"
  //         key={mod}
  //       >
  //         <input
  //           type="checkbox"
  //           className="w-4"
  //           id={mod}
  //           onChange={(e) => {
  //             e.target.checked
  //               ? setSelectedMods([...selectedMods, mod])
  //               : setSelectedMods(selectedMods.filter((value) => value != mod));
  //           }}
  //         />
  //         <label>{mod}</label>
  //       </div>
  //     );
  //   });
  // };

  switch (session.status) {
    case "loading":
      return <Loading />;
    case "unauthenticated":
      return <Error statusCode={401} title="Unauthorized" />;
    case "authenticated":
      if (currentUser?.name == "pseh") {
        return (
          <div className="flex flex-row w-full h-full">
            <div className="w-1/3 h-full bg-black/40 flex flex-col place-content-center items-center">
              <div className="w-full h-1/3 bg-green-400/10 flex flex-col space-y-1 place-content-center items-center">
                <input
                  type="number"
                  className="h-fit w-64 p-1"
                  placeholder="Score ID"
                  onChange={(e) => setScoreID(parseInt(e.target.value))}
                />
                <input
                  type="number"
                  className="h-fit w-64 p-1"
                  placeholder="PP"
                  onChange={(e) => setPP(parseInt(e.target.value))}
                />
                <input
                  type="text"
                  className="h-fit w-64 p-1"
                  placeholder="YouTube URL"
                  onChange={(e) => setYtLink(e.target.value)}
                />
              </div>
              <div className="w-full py-12 h-1/3 bg-blue-400/10 flex flex-col flex-wrap place-content-center items-center space-y-1">
                {renderTagsCheckboxes()}
              </div>
              <div className="h-1/3 w-full flex flex-col bg-red-400/10 place-content-center items-center space-y-1">
                <button
                  className="h-fit w-64"
                  onClick={() => {
                    if (scoreID) {
                      lookupScore(scoreID).then(async (score) => {
                        const ranked_year = new Date(
                          Date.parse(
                            (await lookupMap(score.beatmapset.id)).ranked_date
                          )
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
                          mods: score.mods,
                          tags: selectedTags,
                          acc: score.accuracy,
                          misscount: score.statistics.miss,
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
            </div>
            <div className="w-2/3 h-full flex flex-col place-content-start items-center overflow-scroll">
              {allScores.length ? renderScores() : <Loading />}
            </div>
          </div>
        );
      } else return <Error statusCode={401} title="Unauthorized" />;
  }
}
