import { useEffect, useState } from "react";
import { BeatmapSimple } from "../types";
import { Beatmapset } from "osu-api-extended/dist/types/v2/search_all";
import Image from "next/image";
import { lookupMaps } from "../api_fct";

import { TbFidgetSpinner } from "react-icons/tb";

export function Loading() {
  return (
    <TbFidgetSpinner
      size={50}
      opacity={0.8}
      className="animate-spin"
      color="white"
    />
  );
}

export const BeatmapCard = ({
  beatmap,
  simple,
}: {
  beatmap: BeatmapSimple;
  simple?: boolean;
}) => {
  return (
    <div className="w-fit h-full flex flex-row place-content-start items-center space-x-2">
      <Image
        src={beatmap.cover}
        alt=""
        width={3840}
        height={720}
        className="w-24 h-fit rounded-xl hidden md:flex"
      />
      {simple ? (
        <>
          <p className="flex flex-nowrap overflow-hidden whitespace-nowrap">
            {beatmap.title.length > 25
              ? beatmap.title.slice(0, 25) + "..."
              : beatmap.title}
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-row flex-nowrap overflow-hidden whitespace-nowrap w-full text-sm md:text-base space-x-2">
            <p className="hidden md:flex">{beatmap.artist} - </p>
            <p className="flex">
              {beatmap.title.length > 25
                ? beatmap.title.slice(0, 25) + "..."
                : beatmap.title}
            </p>
            <p className="">({beatmap.creator})</p>
          </div>
        </>
      )}
    </div>
  );
};

export default function MapSearch({
  selectedBeatmap,
  setSelectedBeatmap,
  setSelectedView,
}: {
  selectedBeatmap?: BeatmapSimple;
  setSelectedBeatmap: any;
  setSelectedView: any;
}) {
  const [mapSearchQuery, setMapSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [rawMapSearchResults, setRawMapSearchResults] = useState<Beatmapset[]>(
    []
  );
  const [mapSearchResults, setMapSearchResults] = useState<BeatmapSimple[]>([]);

  // Debounced user input query for smoother map search and less API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(mapSearchQuery);
      debouncedQuery === mapSearchQuery ? setIsLoading(false) : null;
    }, 300);

    return () => {
      setIsLoading(true);
      clearTimeout(handler);
    };
  }, [mapSearchQuery]);

  useEffect(() => {
    if (debouncedQuery === "") {
      setRawMapSearchResults([]);
      return;
    }
    lookupMaps(debouncedQuery).then((api_query_answer) => {
      setRawMapSearchResults(api_query_answer.beatmapsets);
    });
  }, [debouncedQuery]);

  useEffect(() => {
    setMapSearchResults(
      rawMapSearchResults.map((beatmapset) => {
        return {
          artist: beatmapset.artist,
          title: beatmapset.title,
          creator: beatmapset.creator,
          id: beatmapset.id,
          cover: beatmapset.covers["cover@2x"],
          rankYear: new Date(Date.parse(beatmapset.ranked_date)).getFullYear(),
        };
      })
    );
    setIsLoading(false);
  }, [rawMapSearchResults]);

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
            {mapSearchResults?.slice(0, 5).map((beatmap) => {
              return (
                <div
                  className="w-full flex flex-row h-12 bg-black/40 hover:bg-black/70 cursor-pointer rounded-xl"
                  key={beatmap.id}
                  onClick={() => {
                    setSelectedView("Default");
                    setSelectedBeatmap(beatmap);
                  }}
                >
                  <div className="w-full px-2">
                    <BeatmapCard beatmap={beatmap} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="w-full h-1/6 flex flex-row place-content-center items-center">
          <input
            className="w-full md:w-1/2 h-12"
            placeholder="Search for a beatmap"
            type="text"
            onChange={(e) => {
              setMapSearchQuery(e.target.value);
            }}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
