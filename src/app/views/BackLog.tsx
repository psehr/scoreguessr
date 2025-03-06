import { useEffect, useState } from "react";
import { GuessableScore, ScoreSimple } from "../types";
import { fetchAllScores } from "../_services/firebase/scores";
import { Loading } from "./MapSearch";
import { fetchScoreguessrUser } from "../_services/firebase/user";

export default function BackLog({
  setCurrentView,
  todayScore,
  isAuthenticated,
  user_id,
}: {
  setCurrentView: any;
  todayScore: GuessableScore;
  isAuthenticated: boolean;
  user_id?: number;
}) {
  const [backlog, setBacklog] = useState<GuessableScore[]>();
  const [foundScores, setFoundScores] = useState<ScoreSimple[]>();

  useEffect(() => {
    fetchAllScores().then((scores) => {
      setBacklog(
        scores.filter((score) => score.day_index <= todayScore.day_index)
      );
    });

    isAuthenticated
      ? fetchScoreguessrUser(user_id!).then((user) => {
          setFoundScores(user.found_scores);
        })
      : null;
  }, []);

  return (
    <div className="w-full h-full relative flex flex-col place-content-center items-center space-y-8">
      <div className="h-2/3 md:h-fit w-full md:w-1/3 flex flex-row place-content-start items-center flex-wrap overflow-scroll">
        {backlog ? (
          backlog.map((score) => {
            const border_color = foundScores?.find(
              (alreadyFoundScore) => alreadyFoundScore.score_id == score.id
            )
              ? "border-green-600"
              : score.day_index == todayScore.day_index
              ? "border-yellow-600"
              : "border-blue-600";

            return (
              <div
                key={score.day_index}
                className={`m-1 md:m-2 size-16 bg-white/10 hover:bg-white/30 border-2 cursor-pointer ${border_color} flex place-content-center items-center flex-col`}
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
        <button onClick={() => setCurrentView("Default")}>Go back</button>
      </div>
    </div>
  );
}
