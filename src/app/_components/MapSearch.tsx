import { Beatmapset } from "osu-api-extended/dist/types/v2/search_all";
import { useEffect, useState } from "react";
import { lookupMaps } from "../api_fct";
import Image from "next/image";

export const MapSearch = ({ query }: { query: string }) => {
  const [mapSearchResults, setMapSearchResults] = useState<
    Beatmapset[] | undefined
  >();

  useEffect(() => {
    if (query.length > 1) {
      lookupMaps(query).then((maps) => {
        setMapSearchResults(maps.beatmapsets);
      });
    } else {
      setMapSearchResults([]);
    }
    console.log(mapSearchResults);
  }, [query]);

  const MapCard = ({ beatmap }: { beatmap: Beatmapset }) => {
    return (
      <div
        className="w-full relative flex place-content-start items-center h-12 bg-slate-950/50 hover:bg-slate-950/80 cursor-pointer space-x-4 px-4 overflow-hidden"
        key={beatmap.id}
      >
        <Image
          src={beatmap.covers["slimcover@2x"]}
          alt=""
          width={3840}
          height={720}
          className="w-44 rounded-xl"
        />
        <p>
          {beatmap.title.length > 30
            ? beatmap.title.slice(0, 30) + "..."
            : beatmap.title}
        </p>
        <p>({beatmap.creator})</p>
      </div>
    );
  };

  return (
    <div className="absolute flex flex-col w-full bottom-14 rounded-xl overflow-hidden">
      {mapSearchResults?.slice(0, 5).map((beatmap) => {
        return <MapCard beatmap={beatmap} key={beatmap.id} />;
      })}
    </div>
  );
};
