import { useEffect, useState } from "react";
import {
  BeatmapSimple,
  GuessableScore,
  OsuUser,
  PlayerSimple,
  ScoreDraft,
} from "../types";
import * as Flags from "country-flag-icons/react/3x2";
import PlayerSearch, { PlayerCard } from "./PlayerSearch";
import MapSearch, { BeatmapCard, Loading } from "./MapSearch";
import { LuArrowUp, LuArrowDown, LuCheck, LuGithub } from "react-icons/lu";
import {
  addFoundScoreToUser,
  checkIfScoreHasAlreadyBeenFound,
  updateUserStatsAfterFoundScore,
} from "../_services/firebase/user";

import { sign_in } from "../_services/auth/sign_in";
import { useSession } from "next-auth/react";
import { sign_out } from "../_services/auth/sign_out";
import { formatDistance } from "date-fns";
import {
  fetchCurrentScore,
  fetchNextScoreTimestamp,
} from "../_services/firebase/scores";
import WinScreen from "./WinScreen";
import HintsScreen from "./HintsScreen";
import { useRouter } from "next/navigation";
import StatsScreen from "./StatsScreen";

export default function Game({
  score,
  isAuthenticated,
  user,
  isToday,
}: {
  score: GuessableScore;
  isAuthenticated: boolean;
  user?: OsuUser;
  isToday: boolean;
}) {
  const [currentView, setCurrentView] = useState<
    | "Default"
    | "MapSearch"
    | "PlayerSearch"
    | "WinScreen"
    | "HintsScreen"
    | "BackLog"
    | "StatsScreen"
  >("Default");

  const [scoreDrafts, setScoreDrafts] = useState<ScoreDraft[]>([]);
  const [foundScore, setFoundScore] = useState(false);

  const [selectedBeatmap, setSelectedBeatmap] = useState<BeatmapSimple>();
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSimple>();
  const [selectedYear, setSelectedYear] = useState<number>();

  const [submitCd, setSubmitCd] = useState(0);

  const router = useRouter();

  const [nextScoreTimestamp, setNextScoreTimestamp] = useState<number>();
  useEffect(() => {
    fetchCurrentScore().then((score) => {
      setCurrentView("Default");
      fetchNextScoreTimestamp().then((timestamp) =>
        setNextScoreTimestamp(timestamp)
      );
    });
  }, []);

  useEffect(() => {
    if (!scoreDrafts?.length) return;
    const lastDraft = scoreDrafts[scoreDrafts.length - 1];
    if (
      lastDraft.isValidMap &&
      lastDraft.isValidPlayer &&
      lastDraft.isValidYear
    ) {
      if (isAuthenticated) {
        checkIfScoreHasAlreadyBeenFound(user?.id!, score?.id!).then(
          (hasAlreadbyBeenFound) => {
            if (!hasAlreadbyBeenFound) {
              addFoundScoreToUser(score!, user?.id!, scoreDrafts.length);
              updateUserStatsAfterFoundScore(user?.id!, {
                day_index: score?.day_index!,
                score_id: score?.id!,
                guess_count: scoreDrafts.length,
              });
            }
          }
        );
      }

      setCurrentView("WinScreen");
      setFoundScore(true);
    }
  }, [scoreDrafts]);

  const renderRows = () => {
    if (!scoreDrafts?.length) return;

    return scoreDrafts.map((scoreDraft) => {
      let Flag =
        Flags[
          scoreDraft.score.player.country_code.toUpperCase() as keyof typeof Flags
        ];
      return (
        <tr className="w-1/4 h-16" key={scoreDraft.attempt}>
          <td
            className="w-fit h-full"
            key={`player_name-${scoreDraft.attempt}`}
          >
            <div className="w-full h-full flex flex-row place-content-center items-center">
              <div
                className={`w-full h-full flex flex-col space-y-1 md:space-y-0 md:flex-row place-content-center items-center text-sm md:text-2xl p-2 rounded-xl ${
                  scoreDraft.isValidPlayer
                    ? "bg-green-600"
                    : scoreDraft.isValidCountry
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
              >
                <div className="w-2/3 flex flex-row place-content-center md:place-content-start items-center space-x-2">
                  <PlayerCard player={scoreDraft.score.player} />
                </div>
                <div className="w-1/3 flex flex-row place-content-center md:place-content-end items-center space-x-2">
                  <div className="rounded-sm md:rounded-md overflow-hidden w-6 md:w-8 h-fit">
                    <Flag />
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td className="w-1/2 h-16" key={`beatmap_name-${scoreDraft.attempt}`}>
            <div className="w-full h-full flex flex-row flex-nowrap whitespace-nowrap overflow-hidden place-content-center items-center">
              <div
                className={`shadow-lg w-full h-full flex flex-col md:flex-row place-content-center items-center text-2xl p-1 md:p-2 rounded-xl space-x-2 ${
                  scoreDraft.isValidMap
                    ? "bg-green-600"
                    : scoreDraft.isValidRankedYear
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
              >
                <div className="w-full md:w-2/3 text-sm md:text-xl flex flex-row place-content-center md:place-content-start items-center space-x-2">
                  <BeatmapCard beatmap={scoreDraft.score.beatmap} simple />
                </div>
                <div className="w-full md:w-1/3 flex flex-row place-content-center items-center">
                  <p className={`text-sm md:text-lg px-2 rounded-xl`}>
                    Ranked in {scoreDraft.score.beatmap.rankYear}
                  </p>
                  {scoreDraft.score.beatmap.rankYear <
                  score?.beatmap.rankYear! ? (
                    <LuArrowUp />
                  ) : score?.beatmap.rankYear ==
                    scoreDraft.score.beatmap.rankYear ? null : (
                    <LuArrowDown />
                  )}
                </div>
              </div>
            </div>
          </td>
          <td className="w-1/6 h-16" key={`year-${scoreDraft.attempt}`}>
            <div className="w-full h-full flex flex-row place-content-center items-center">
              <div
                className={`w-full h-full flex flex-col md:flex-row place-content-center items-center text-sm md:text-2xl p-2 rounded-xl ${
                  scoreDraft.isValidYear ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {scoreDraft.score.year || "Year?"}
                {scoreDraft.score.year < score?.year! ? (
                  <LuArrowUp />
                ) : score?.year == scoreDraft.score.year ? null : (
                  <LuArrowDown />
                )}
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col place-content-start items-center">
      <div className="relative flex flex-row w-full h-1/5 md:h-1/4">
        {/* Page Header */}
        <div className="w-full h-full p-4 md:p-8 space-y-2 flex flex-col place-content-center items-center">
          <p className="w-full md:w-fit text-center h-fit text-4xl md:text-6xl font-bold text-blue-200 border border-blue-600/50 shadow-lg bg-gradient-to-br from-blue-800/50 to-slate-950/50 p-4 px-8 rounded-3xl">
            SCOREGUESSR
          </p>
          <div className="h-1/2 w-fit px-8 rounded-xl  bg-gradient-to-br from-blue-800/50 to-slate-950/50 space-x-2 font-semibold text-lg md:text-3xl text-center flex flex-row items-center place-content-center">
            <p className="">You are looking for a score worth</p>
            <p className="text-blue-400">{score?.pp}pp.</p>
          </div>
        </div>
      </div>
      <div className="w-full h-1/2 p-2 md:p-4 md:px-8 text-center flex flex-row place-content-center overflow-auto">
        {scoreDrafts.length ? (
          <table className="table-fixed w-full md:w-3/4 h-fit font-bold ">
            <tbody className="text-xl md:text-4xl h-fit w-full">
              {renderRows()}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col place-content-center items-center">
            <p className="text-white text-opacity-10 text-4xl font-bold">
              Make a first guess..
            </p>
          </div>
        )}
      </div>
      {!foundScore ? (
        <div className=" w-full h-1/3 md:h-1/4 p-2 md:p-8 flex flex-col space-y-2 text-center items-center">
          <div className="w-full md:w-full h-fit md:h-12 flex flex-col md:flex-row space-y-1 md:space-x-2 md:space-y-0 place-content-center items-center text-sm md:text-base">
            <div className="w-full md:w-1/3 h-10 md:h-12">
              <div className="relative w-full h-full">
                {selectedPlayer ? (
                  <button
                    className="flex place-content-center items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView("PlayerSearch");
                    }}
                  >
                    <PlayerCard player={selectedPlayer} />
                  </button>
                ) : (
                  <button
                    className=""
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView("PlayerSearch");
                    }}
                  >
                    Which player?
                  </button>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/3 h-10 md:h-12">
              <div className="relative w-full h-full">
                {selectedBeatmap ? (
                  <button
                    className="flex place-content-center items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView("MapSearch");
                    }}
                  >
                    <BeatmapCard beatmap={selectedBeatmap} simple />
                  </button>
                ) : (
                  <button
                    className=""
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView("MapSearch");
                    }}
                  >
                    Which beatmap?
                  </button>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/3 h-10 md:h-12">
              <input
                id="ignore-placeholder"
                placeholder="Which year?"
                className="border border-blue-600 bg-blue-600/10 font-semibold"
                type="number"
                onChange={(e) => {
                  setSelectedYear(parseInt(e.target.value));
                }}
              ></input>
            </div>
          </div>
          <div className="w-full h-fit flex flex-row place-content-center items-center space-x-2">
            <button
              className="bg-yellow-600/10 border-yellow-600 w-1/2"
              onClick={() => {
                setCurrentView("HintsScreen");
              }}
            >
              Hints{" "}
              {scoreDrafts.length >= 7
                ? "(3 available)"
                : scoreDrafts.length >= 5
                ? "(2 available)"
                : scoreDrafts.length >= 3
                ? "(1 available)"
                : "(0 available)"}
            </button>
            <button
              type="submit"
              className=" border-green-400 bg-green-600/10 w-1/2"
              onClick={() => {
                if (
                  !selectedPlayer ||
                  !selectedBeatmap ||
                  !selectedYear ||
                  Date.now() - submitCd < 500
                )
                  return;
                setSubmitCd(Date.now());
                const newScoreDraft: ScoreDraft = {
                  score: {
                    player: selectedPlayer,
                    beatmap: selectedBeatmap,
                    year: selectedYear,
                  },
                  isValidPlayer: selectedPlayer.id === score?.player.id,
                  isValidMap: selectedBeatmap.id === score?.beatmap.id,
                  isValidYear: selectedYear === score?.year,
                  isValidPP: true,
                  isValidCountry:
                    selectedPlayer.country_code === score?.player.country_code,
                  isValidRankedYear:
                    selectedBeatmap.rankYear === score?.beatmap.rankYear,
                  attempt: scoreDrafts ? scoreDrafts.length + 1 : 1,
                };
                setScoreDrafts(
                  scoreDrafts
                    ? [...scoreDrafts, newScoreDraft]
                    : [newScoreDraft]
                );
              }}
            >
              Submit guess
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-1/4 p-8 flex flex-col space-y-4 text-center items-center"></div>
      )}
      <div className="place-content-center items-center w-full flex flex-row text-gray-400 text-sm md:text-lg">
        <div className="flex flex-col absolute bottom-3 left-3 space-y-2 place-content-center items-start">
          <div className="flex flex-row space-x-2">
            {isAuthenticated ? (
              <p
                className="underline cursor-pointer"
                onClick={() => {
                  sign_out();
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                }}
              >
                Log out
              </p>
            ) : (
              <p className="underline cursor-pointer" onClick={sign_in}>
                Log in
              </p>
            )}
            <p>-</p>
            <p
              className="underline cursor-pointer"
              onClick={() => setCurrentView("StatsScreen")}
            >
              See stats
            </p>
          </div>
          {isAuthenticated ? (
            <div className="flex flex-row space-x-2">
              <p>Logged in as </p>
              <PlayerCard
                player={{
                  avatar: user?.image!,
                  country_code: user?.country_code!,
                  username: user?.name!,
                  id: user?.id!,
                }}
              />
            </div>
          ) : (
            <p>You are not logged in</p>
          )}
        </div>

        <div className="hidden md:flex flex-col absolute bottom-3 place-content-center items-center space-y-2">
          {nextScoreTimestamp && score ? (
            <>
              <div className="flex flex-row space-x-1">
                <p className="font-bold">Day {score.day_index ?? "?"}</p>
                {isAuthenticated ? (
                  <>
                    <p>-</p>
                    <p
                      className="underline cursor-pointer"
                      onClick={() => router.push("/backlog")}
                    >
                      See all days
                    </p>
                  </>
                ) : null}
              </div>
              <div className="flex flex-row space-x-1">
                {isToday ? (
                  <>
                    <p>Next score </p>
                    <p>
                      {formatDistance(nextScoreTimestamp, new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                  </>
                ) : (
                  <>
                    <p>This score is outdated! - </p>
                    <p
                      className="underline cursor-pointer"
                      onClick={() => router.push("/")}
                    >
                      See today's score
                    </p>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex w-6">
              <Loading />
            </div>
          )}
        </div>
        <div className="flex flex-col absolute bottom-3 right-3 space-y-2 place-content-center items-end">
          <LuGithub
            size={28}
            onClick={() => {
              window.open("https://github.com/psehr");
            }}
            className="cursor-pointer"
          />
          <a href="https://osu.ppy.sh/users/9239673" className="underline">
            Made by @psehr
          </a>
        </div>
      </div>
      {currentView === "MapSearch" ? (
        <MapSearch
          selectedBeatmap={selectedBeatmap}
          setSelectedBeatmap={setSelectedBeatmap}
          setSelectedView={setCurrentView}
        />
      ) : null}
      {currentView === "PlayerSearch" ? (
        <PlayerSearch
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
          setSelectedView={setCurrentView}
        />
      ) : null}
      {currentView === "WinScreen" ? (
        <WinScreen
          setSelectedView={setCurrentView}
          validScore={score}
          everyDrafts={scoreDrafts!}
        />
      ) : null}
      {currentView === "HintsScreen" ? (
        <HintsScreen
          setSelectedView={setCurrentView}
          validScore={score}
          everyDrafts={scoreDrafts!}
        />
      ) : null}
      {currentView === "StatsScreen" ? (
        <StatsScreen
          setSelectedView={setCurrentView}
          score={score}
          isAuthenticated={isAuthenticated}
          user={user}
        />
      ) : null}
    </div>
  );
}
