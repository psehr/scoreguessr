import { useEffect, useState } from "react";
import { BeatmapSimple } from "../types";
import { Beatmapset } from "osu-api-extended/dist/types/v2/search_all";
import Image from "next/image";
import { lookupMaps } from "../api_fct";

export const BeatmapCard = ({ beatmap }: { beatmap: BeatmapSimple }) => {
  return (
    <div className="w-full h-full flex flex-row place-content-start items-center space-x-2">
      <Image
        src={beatmap.cover}
        alt=""
        width={3840}
        height={720}
        className="w-32 h-fit rounded-xl"
      />
      <p>
        {beatmap.artist} -{" "}
        {beatmap.title.length > 30
          ? beatmap.title.slice(0, 30) + "..."
          : beatmap.title}
      </p>
      <p>({beatmap.creator})</p>
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
    }, 400);

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
        };
      })
    );
    setIsLoading(false);
  }, [rawMapSearchResults]);

  return (
    <div
      className="absolute flex flex-col place-content-center items-center w-full h-full backdrop-blur-sm bg-black/10"
      onClick={() => setSelectedView("main")}
    >
      <div
        className="bg-slate-800 rounded-xl flex flex-col place-content-end items-center w-2/3 h-1/2 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="w-full h-full flex place-content-center items-center">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="w-full h-5/6 flex flex-col space-y-2 overflow-auto ">
            {mapSearchResults?.slice(0, 5).map((beatmap) => {
              return (
                <div
                  className="w-full flex flex-row h-12 bg-black/40 rounded-xl"
                  key={beatmap.id}
                >
                  <div className="w-2/3 px-2">
                    <BeatmapCard beatmap={beatmap} />
                  </div>
                  <div className="w-1/3 flex flex-row place-content-end items-center px-2">
                    <button
                      className="px-4 p-1 bg-blue-700 hover:bg-blue-600 rounded-xl"
                      onClick={() => setSelectedBeatmap(beatmap)}
                    >
                      Select beatmap
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="w-full h-1/6 flex flex-row place-content-center items-center">
          <input
            className="w-1/2 h-12"
            placeholder="Search for a beatmap"
            type="text"
            onChange={(e) => {
              setMapSearchQuery(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
