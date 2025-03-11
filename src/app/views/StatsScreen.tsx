"use client";

import React, { useEffect, useState } from "react";
import {
  GuessableScore,
  OsuUser,
  ScoreguessrUser,
  ScoreSimple,
} from "../types";
import { fetchScoreguessrUser } from "../_services/firebase/user";
import { PlayerCard } from "./PlayerSearch";
import * as Flags from "country-flag-icons/react/3x2";
import { formatDistance, sub, subDays } from "date-fns";
import { Loading } from "./MapSearch";
import { fetchCurrentScore } from "../_services/firebase/scores";
import { LuExternalLink, LuSquareCheckBig, LuX } from "react-icons/lu";

export default function StatsScreen({
  setSelectedView,
  score,
  isAuthenticated,
  user,
}: {
  setSelectedView: any;
  score: GuessableScore;
  isAuthenticated: boolean;
  user?: OsuUser;
}) {
  const [userData, setUserData] = useState<ScoreguessrUser>();
  const [todayScore, setTodayScore] = useState<GuessableScore>();
  const [foundScore, setFoundScore] = useState<ScoreSimple>();

  useEffect(() => {
    if (user) {
      fetchScoreguessrUser(user.id).then((user) => {
        setUserData(user);
        setFoundScore(
          user.found_scores.find(
            (found_score) => found_score.score_id == score.id
          )
        );
      });
    }
  }, [user]);

  useEffect(() => {
    fetchCurrentScore().then((score) => setTodayScore(score));
  }, []);

  let Flag = Flags[userData?.country_code.toUpperCase() as keyof typeof Flags];

  return (
    <div
      className="absolute flex flex-col place-content-center items-center w-full h-full bg-black/30 backdrop-blur-sm p-4"
      onClick={() => setSelectedView("Default")}
    >
      <div
        className="rounded-xl flex flex-col md:flex-row place-content-center items-center w-full md:w-1/2 h-full md:h-fit min-h-[80%] md:min-h-[40%] p-4 space-y-2 md:space-x-2 md:space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <div className="flex flex-col w-full h-1/3 md:w-1/3 md:h-full bg-white/10 rounded-xl place-content-start items-center text-xl shadow-md">
          <div className="flex flex-col space-y-8 h-full w-full place-content-start items-center">
            <div className="h-1/4 font-bold flex flex-col place-content-center items-center text-2xl space-y-4">
              <p className="font-semibold underline bg-black/30 pb-1 px-8 rounded-xl shadow-lg">
                Global stats
              </p>
            </div>
            <div className="h-1/3 font-bold flex flex-col place-content-center items-center text-2xl space-y-4">
              <p className="font-bold text-gray-400/70">WIP Section</p>
            </div>
            <div className="h-1/2 font-bold flex flex-col place-content-center items-center text-2xl space-y-4"></div>
          </div>
        </div> */}
        <div className="border border-green-400 flex flex-col w-full h-1/3 md:w-1/2 md:h-full bg-white/10 rounded-xl place-content-start items-center text-xl shadow-md">
          <div className="flex flex-col px-8 h-full w-full place-content-start items-center">
            <div className="h-1/5 font-bold flex flex-col place-content-center items-center text-xl md:text-2xl space-y-4">
              <p className="font-semibold underline bg-black/30 pb-1 px-8 rounded-xl shadow-lg">
                This score
              </p>
            </div>
            <div className="h-1/2 w-full font-bold flex flex-col place-content-center items-center text-lg md:text-2xl space-y-1 md:space-y-4 border border-green-600/50 shadow-lg bg-gradient-to-br from-green-800/50 to-green-950/50 rounded-xl">
              <div className="flex flex-row space-x-1 place-content-center items-center">
                <p className="font-bold p-1 px-2 rounded-xl">
                  Day {score.day_index}
                </p>
                {foundScore ? <LuSquareCheckBig /> : null}
              </div>
              {isAuthenticated ? (
                <div className="text-lg md:text-xl font-semibold flex flex-col place-content-center items-center space-y-0 md:space-y-2">
                  {foundScore ? (
                    <>
                      <p className="bg-green-400/30 p-1 px-4 rounded-xl">
                        Found in {foundScore.guess_count} guesses
                      </p>
                      <div
                        className="flex flex-row space-x-1 place-content-center items-center cursor-pointer"
                        onClick={() =>
                          window.open(`https://osu.ppy.sh/scores/${score.id}`)
                        }
                      >
                        <p className="underline font-normal text-base">
                          See score page
                        </p>
                        <LuExternalLink />
                      </div>
                    </>
                  ) : (
                    <p className="bg-red-400/50 p-1 px-4 rounded-xl">
                      Not found
                    </p>
                  )}
                </div>
              ) : null}
            </div>
            <div className="text-base md:text-xl h-1/3 flex flex-col place-content-center items-center">
              <div className="flex flex-row space-x-2 place-content-center items-center">
                <p>Found</p>
                <p className="font-bold text-green-400 pt-0.5">X</p>
                <p>times so far</p>
              </div>
              <div className="flex flex-row space-x-2 place-content-center items-center">
                <p className="font-bold text-purple-400 pt-0.5">X</p>
                <p>average guesses</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-blue-400 px-8 flex flex-col w-full h-1/3 md:w-1/2 md:h-full bg-white/10 rounded-xl place-content-start items-center text-xl shadow-md">
          {userData && todayScore ? (
            <div className="flex flex-col h-full w-full place-content-center items-center">
              <div className="h-1/5 font-bold flex flex-col place-content-center items-center text-xl md:text-2xl">
                <p className="font-semibold underline bg-black/30 pb-1 px-8 rounded-xl shadow-lg">
                  Your profile
                </p>
              </div>
              <div className="h-1/2 w-fit min-w-[60%] md:w-full font-bold flex flex-col place-content-center items-center text-xl md:text-2xl space-y-2 md:space-y-4 border border-blue-600/50 shadow-lg bg-gradient-to-br from-blue-800/50 to-slate-950/50 rounded-xl">
                <div>
                  <PlayerCard
                    player={{
                      avatar: userData.avatar,
                      country_code: userData.country_code,
                      id: userData.id,
                      username: userData.name,
                    }}
                  />
                </div>
                <Flag className="rounded-xl h-10 shadow-lg" />
              </div>
              <div className="text-base md:text-xl h-1/3 flex flex-col place-content-center items-center">
                <div className="flex flex-row space-x-1">
                  <p>Joined</p>
                  <p className="font-bold text-blue-400">
                    {formatDistance(userData.creation_timestamp, new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="flex flex-row space-x-1">
                  <p>Found</p>
                  <p className="font-bold text-green-400">
                    {userData.found_scores.length}/{todayScore?.day_index + 1}
                  </p>
                  <p>scores</p>
                </div>
                <div className="flex flex-row space-x-2">
                  <p className="font-bold text-purple-400 pt-0.5">
                    {userData.stats.avg_guesses.toFixed(1)}
                  </p>
                  <p>average guesses</p>
                </div>
              </div>
            </div>
          ) : isAuthenticated ? (
            <div className="flex w-full h-full place-content-center items-center">
              <Loading />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
