"use client";

import { useEffect, useState } from "react";
import { GuessableScore, OsuUser } from "./types";
import { Loading } from "./views/MapSearch";

import { fetchCurrentScore } from "./_services/firebase/scores";
import { useSession } from "next-auth/react";
import Game from "./views/Game";

export default function Home() {
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

  const [todayScore, setTodayScore] = useState<GuessableScore>();
  useEffect(() => {
    fetchCurrentScore().then((score) => {
      setTodayScore(score);
    });
  }, []);

  if (!todayScore) {
    return (
      <div className="relative w-full h-full flex flex-col place-content-center items-center">
        <Loading />
      </div>
    );
  } else
    return (
      <Game
        score={todayScore}
        isAuthenticated={isAuthenticated}
        user={currentUser}
        isToday
      />
    );
}
