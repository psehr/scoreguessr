"use client";

import React, { useEffect, useState } from "react";
import { GuessableScore, OsuUser, ScoreguessrUser } from "../types";
import { fetchScoreguessrUser } from "../_services/firebase/user";
import { PlayerCard } from "./PlayerSearch";
import * as Flags from "country-flag-icons/react/3x2";
import { formatDistance, sub, subDays } from "date-fns";
import { Loading } from "./MapSearch";

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

  useEffect(() => {
    if (user) {
      fetchScoreguessrUser(user.id).then((user) => {
        setUserData(user);
      });
    }
  }, [user]);

  let Flag = Flags[userData?.country_code.toUpperCase() as keyof typeof Flags];

  return (
    <div
      className="absolute flex flex-col place-content-center items-center w-full h-full bg-black/30 backdrop-blur-sm p-4"
      onClick={() => setSelectedView("Default")}
    >
      <div
        className="rounded-xl flex flex-col md:flex-row place-content-center items-center w-full md:w-1/2 h-fit min-h-[60%] md:min-h-[40%] p-4 space-y-2 md:space-x-2 md:space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-1/3 h-full bg-white/10 rounded-xl place-content-start items-center text-xl shadow-md">
          <div className="flex flex-col space-y-8 h-full w-full place-content-start items-center">
            <div className="h-1/4 font-bold flex flex-col place-content-center items-center text-2xl space-y-4">
              <p className="font-extrabold underline">Global stats</p>
            </div>
            <div className="h-1/3 font-bold flex flex-col place-content-center items-center text-2xl space-y-4">
              <p className="font-bold text-gray-400/70">WIP Section</p>
            </div>
            <div className="h-1/2 font-bold flex flex-col place-content-center items-center text-2xl space-y-4"></div>
          </div>
        </div>{" "}
        <div className="flex flex-col w-1/3 h-full bg-white/10 rounded-xl place-content-start items-center text-xl shadow-md">
          <div className="flex flex-col space-y-8 h-full w-full place-content-start items-center">
            <div className="h-1/4 font-bold flex flex-col place-content-center items-center text-2xl space-y-4">
              <p className="font-extrabold underline">This score</p>
            </div>
            <div className="h-1/3 font-bold flex flex-col place-content-center items-center text-2xl space-y-4">
              <p className="font-bold text-gray-400/70">WIP Section</p>
            </div>
            <div className="h-1/2 font-bold flex flex-col place-content-center items-center text-2xl space-y-4"></div>
          </div>
        </div>
        <div className="flex flex-col w-1/3 h-full bg-white/10 rounded-xl place-content-start items-center text-xl shadow-md">
          {userData ? (
            <div className="flex flex-col space-y-8 h-full w-full place-content-start items-center">
              <div className="h-1/4 font-bold flex flex-col place-content-center items-center text-2xl space-y-4">
                <p className="font-extrabold underline">Your profile</p>
              </div>
              <div className="h-1/4 font-bold flex flex-col place-content-center items-center text-2xl space-y-4">
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
              <div className="h-1/2 flex flex-col place-content-center items-center">
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
                    {userData.found_scores.length}/{score.day_index + 1}
                  </p>
                  <p>scores</p>
                </div>
                <div className="flex flex-row space-x-1">
                  <p>Average guesses:</p>
                  <p className="font-bold text-purple-400">
                    {userData.stats.avg_guesses.toFixed(1)}
                  </p>
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
