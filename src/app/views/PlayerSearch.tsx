import { useEffect, useState } from "react";
import { BeatmapSimple, PlayerSimple } from "../types";
import {
  Beatmapset,
  SearchWiki,
} from "osu-api-extended/dist/types/v2/search_all";
import Image from "next/image";
import { lookupMaps, lookupPlayers } from "../_services/osu_api/api_fct";
import { Loading } from "./MapSearch";

export const PlayerCard = ({ player }: { player: PlayerSimple }) => {
  return (
    <div className="w-fit h-full flex flex-row place-content-start items-center md:space-x-2">
      <Image
        src={player.avatar}
        alt=""
        width={32}
        height={32}
        className="hidden md:flex w-4 md:w-8 h-fit rounded-md"
      />
      <p>{player.username}</p>
    </div>
  );
};

export default function PlayerSearch({
  selectedPlayer,
  setSelectedPlayer,
  setSelectedView,
}: {
  selectedPlayer?: PlayerSimple;
  setSelectedPlayer: any;
  setSelectedView: any;
}) {
  const [playerSearchQuery, setPlayerSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [rawPlayerSearchResults, setRawPlayerSearchResults] = useState<
    SearchWiki["user"]["data"]
  >([]);
  const [playerSearchResults, setplayerSearchResults] = useState<
    PlayerSimple[]
  >([]);

  // Debounced user input query for smoother map search and less API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(playerSearchQuery);
      debouncedQuery === playerSearchQuery ? setIsLoading(false) : null;
    }, 400);

    return () => {
      setIsLoading(true);
      clearTimeout(handler);
    };
  }, [playerSearchQuery]);

  useEffect(() => {
    if (debouncedQuery === "") {
      setRawPlayerSearchResults([]);
      return;
    }
    lookupPlayers(debouncedQuery).then((api_query_answer) => {
      setRawPlayerSearchResults(api_query_answer.user.data);
    });
  }, [debouncedQuery]);

  useEffect(() => {
    setplayerSearchResults(
      rawPlayerSearchResults.map((player) => {
        return {
          username: player.username,
          id: player.id,
          avatar: player.avatar_url,
          country_code: player.country_code,
        };
      })
    );
    setIsLoading(false);
  }, [rawPlayerSearchResults]);

  return (
    <div
      className="absolute flex flex-col place-content-center items-center w-full h-full bg-black/30 backdrop-blur-sm p-4"
      onClick={() => setSelectedView("Default")}
    >
      <div
        className="backdrop-blur-md bg-white/10 rounded-xl flex flex-col place-content-end items-center w-full md:w-1/3 h-fit min-h-[60%] md:min-h-[40%] p-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="w-full h-5/6 flex place-content-center items-center">
            {<Loading />}
          </div>
        ) : (
          <div className="w-full h-5/6 flex flex-col space-y-2 overflow-auto ">
            {playerSearchResults?.slice(0, 5).map((player) => {
              return (
                <div
                  className="w-full flex flex-row h-12 bg-black/40 hover:bg-black/70 cursor-pointer rounded-xl"
                  key={player.id}
                  onClick={() => {
                    setSelectedView("Default");
                    setSelectedPlayer(player);
                  }}
                >
                  <div className="w-3/4 px-2">
                    <PlayerCard player={player} />
                  </div>
                  <div className="w-1/4 px-2"></div>
                </div>
              );
            })}
          </div>
        )}
        <div className="w-full h-1/6 flex flex-row place-content-center items-center">
          <input
            className="w-full md:w-1/2 h-12"
            placeholder="Search for a player"
            type="text"
            onChange={(e) => {
              setPlayerSearchQuery(e.target.value);
            }}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
