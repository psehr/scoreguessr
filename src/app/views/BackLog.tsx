"use client";

import { useEffect, useState } from "react";
import { GuessableScore, OsuUser, ScoreSimple } from "../types";
import {
  fetchAllScores,
  fetchCurrentScore,
} from "../_services/firebase/scores";
import { Loading } from "./MapSearch";
import { fetchScoreguessrUser } from "../_services/firebase/user";
import { useSession } from "next-auth/react";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

export default function BackLog() {
  const session = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<OsuUser | undefined>();

  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(session.status == "authenticated");
    if (session.status == "authenticated") {
      setCurrentUser({
        id: parseInt(session.data.user?.image?.split("/")[3]!),
        name: session.data.user?.name!,
        image: session.data.user?.image!,
        country_code: "FR",
      });

      fetchScoreguessrUser(
        parseInt(session.data.user?.image?.split("/")[3]!)
      ).then((user) => {
        setFoundScores(user.found_scores);
      });
    } else {
      setCurrentUser(undefined);
    }
  }, []);

  const [todayScore, setTodayScore] = useState<GuessableScore>();

  const [backlog, setBacklog] = useState<GuessableScore[]>();
  const [foundScores, setFoundScores] = useState<ScoreSimple[]>();

  useEffect(() => {
    fetchAllScores().then((scores) => {
      fetchCurrentScore().then((todayScore) => {
        setTodayScore(todayScore);
        setBacklog(
          scores.filter((score) => score.day_index <= todayScore.day_index)
        );
      });
    });
  }, []);

  return (
    <div className="w-full h-full relative flex flex-col place-content-center items-center space-y-8">
      <div className="h-2/3 md:h-fit w-full md:w-1/3 flex flex-row place-content-start items-center flex-wrap overflow-scroll">
        {backlog && foundScores ? (
          backlog.map((score) => {
            let border_color = "";
            if (isAuthenticated) {
              border_color = foundScores?.find(
                (alreadyFoundScore) => alreadyFoundScore.score_id == score.id
              )
                ? "border-green-600"
                : score.day_index == todayScore?.day_index
                ? "border-yellow-600"
                : "border-blue-600";
            } else {
              border_color =
                score.day_index == todayScore?.day_index
                  ? "border-yellow-600"
                  : "border-blue-600";
            }

            return (
              <div
                key={score.day_index}
                className={`m-1 md:m-2 size-16 bg-white/10 hover:bg-white/30 border-2 cursor-pointer ${border_color} flex place-content-center items-center flex-col`}
                onClick={() => router.push(`/score/${score.day_index}`)}
              >
                <p>Day</p>
                <p className="font-bold text-2xl">{score.day_index}</p>
              </div>
            );
          })
        ) : (
          <div className="w-full h-full flex flex-row place-content-center items-center">
            <Loading />
          </div>
        )}
      </div>
      <div className="h-fit w-1/4 flex flex-row place-content-center items-center">
        <button onClick={() => router.push("/")}>Go back</button>
      </div>
    </div>
  );
}
