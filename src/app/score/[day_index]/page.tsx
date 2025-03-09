"use client";

import { useRouter } from "next/navigation";
import Game from "../../views/Game";
import { GuessableScore, OsuUser } from "../../types";
import { useEffect, useState } from "react";
import {
  fetchCurrentScore,
  fetchScoreFromDayIndex,
} from "../../_services/firebase/scores";
import { Loading } from "../../views/MapSearch";
import { useSession } from "next-auth/react";

export default function PreviousScoreDay({
  params,
}: {
  params: Promise<{ day_index: string }>;
}) {
  const session = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<OsuUser | undefined>();

  useEffect(() => {
    setIsAuthenticated(session.status == "authenticated");
    if (session.status == "authenticated") {
      setCurrentUser({
        id: parseInt(session.data.user?.image?.split("/")[3]!),
        name: session.data.user?.name!,
        image: session.data.user?.image!,
        country_code: "FR",
      });
    } else {
      setCurrentUser(undefined);
    }
  }, [session.status]);

  const [dayIndex, setDayIndex] = useState<string>();
  const [score, setScore] = useState<GuessableScore>();

  const [isToday, setIsToday] = useState<boolean>(false);

  useEffect(() => {
    params.then((p) => setDayIndex(p.day_index));
  }, []);

  useEffect(() => {
    if (dayIndex) {
      fetchScoreFromDayIndex(parseInt(dayIndex)).then((score) => {
        fetchCurrentScore().then((todayScore) =>
          setIsToday(todayScore.day_index == parseInt(dayIndex))
        );
        setScore(score);
      });
    }
  }, [dayIndex]);

  if (score) {
    return (
      <Game
        isAuthenticated={isAuthenticated}
        isToday={isToday}
        score={score}
        user={currentUser}
      />
    );
  } else {
    return (
      <div className="flex w-full h-full place-content-center items-center">
        <Loading />
      </div>
    );
  }
}
