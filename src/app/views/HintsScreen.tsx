import { Mod } from "osu-api-extended";
import { GuessableScore, ScoreDraft } from "../types";

import Image from "next/image";
import dt from "../../../public/mod_icons/dt.png";
import ez from "../../../public/mod_icons/ez.png";
import fl from "../../../public/mod_icons/fl.png";
import hd from "../../../public/mod_icons/hd.png";
import hr from "../../../public/mod_icons/hr.png";
import ht from "../../../public/mod_icons/ht.png";
import nc from "../../../public/mod_icons/nc.png";
import nf from "../../../public/mod_icons/nf.png";
import pf from "../../../public/mod_icons/pf.png";
import sd from "../../../public/mod_icons/sd.png";
import so from "../../../public/mod_icons/so.png";
import { Modak } from "next/font/google";

export function getModIcon(mod: Mod) {
  let selectedModFile;
  switch (mod.acronym) {
    case "DT":
      selectedModFile = dt;
      break;
    case "EZ":
      selectedModFile = ez;
      break;
    case "FL":
      selectedModFile = fl;
      break;
    case "HD":
      selectedModFile = hd;
      break;
    case "HR":
      selectedModFile = hr;
      break;
    case "HT":
      selectedModFile = ht;
      break;
    case "NC":
      selectedModFile = nc;
      break;
    case "NF":
      selectedModFile = nf;
      break;
    case "PF":
      selectedModFile = pf;
      break;
    case "SD":
      selectedModFile = sd;
      break;
    case "SO":
      selectedModFile = so;
      break;
    default:
      break;
  }

  return selectedModFile;
}

export default function HintsScreen({
  setSelectedView,
  validScore,
  everyDrafts,
}: {
  setSelectedView: any;
  validScore: GuessableScore;
  everyDrafts: ScoreDraft[];
}) {
  if (validScore.day_index < 6) {
    return (
      <div
        className="absolute flex flex-col place-content-center items-center w-full h-full bg-black/30 backdrop-blur-sm p-4"
        onClick={() => setSelectedView("Default")}
      >
        <p className="text-4xl font-extrabold">
          No hints are available for this score, sorry!
        </p>
      </div>
    );
  } else
    return (
      <div
        className="absolute flex flex-col place-content-center items-center w-full h-full bg-black/30 backdrop-blur-sm p-4"
        onClick={() => setSelectedView("Default")}
      >
        <div className="rounded-xl flex flex-col place-content-center items-center w-full md:w-1/3 h-fit min-h-[60%] md:min-h-[40%] p-4 space-y-4">
          <div
            className="w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-3xl p-1 px-4 bg-slate-600 rounded-t-xl text-green-400">
              Hint 1: Accuracy
            </p>
            {everyDrafts.length >= 3 ? (
              <div className="relative flex flex-row text-xl p-1 px-4 bg-slate-500 place-content-center items-center">
                <div className="flex flex-row space-x-2">
                  <p>Accuracy is</p>
                  <p className="font-bold">
                    {((validScore.acc || 1) * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="absolute group hover:backdrop-blur-none transition-all cursor-pointer flex w-full h-full backdrop-blur-md place-content-center items-center">
                  <p className="text-gray-400 font-bold group-hover:hidden">
                    Hover to show hint
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xl p-1 px-4 bg-slate-500">
                <p>
                  This hint will be available in {3 - everyDrafts.length}{" "}
                  guess(es).
                </p>
              </div>
            )}
          </div>
          <div
            className="w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-3xl p-1 px-4 bg-slate-600 rounded-t-xl text-blue-400">
              Hint 2: Mods
            </p>
            {everyDrafts.length >= 5 ? (
              <div className="relative flex flex-row text-xl p-1 px-4 bg-slate-500 place-content-center items-center">
                <div className="flex flex-row space-x-1">
                  <p>Used mods: </p>
                  <div className="font-bold">
                    {!validScore.mods?.filter((mod) => mod.acronym != "CL")
                      .length ? (
                      <p>None</p>
                    ) : (
                      validScore.mods?.map((mod) =>
                        getModIcon(mod) ? (
                          <Image
                            key={mod.acronym}
                            src={getModIcon(mod)!}
                            alt="mod-icon"
                            className="scale-75"
                          />
                        ) : (
                          mod.acronym
                        )
                      )
                    )}
                  </div>
                </div>
                <div className="absolute group hover:backdrop-blur-none transition-all cursor-pointer flex w-full h-full backdrop-blur-md place-content-center items-center">
                  <p className="text-gray-400 font-bold group-hover:hidden">
                    Hover to show hint
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xl p-1 px-4 bg-slate-500">
                <p>
                  This hint will be available in {5 - everyDrafts.length}{" "}
                  guess(es).
                </p>
              </div>
            )}
          </div>

          <div
            className="w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-3xl p-1 px-4 bg-slate-600 rounded-t-xl text-red-400">
              Hint 3: Tags
            </p>
            {everyDrafts.length >= 7 ? (
              <div className="relative text-xl p-1 px-4 bg-slate-500 flex place-content-center items-center">
                <div className="flex flex-col">
                  {validScore.tags?.map((tag) => (
                    <p key={tag} className="font-bold">
                      {tag}
                    </p>
                  ))}
                </div>
                <div className="absolute group hover:backdrop-blur-none transition-all cursor-pointer flex w-full h-full backdrop-blur-md place-content-center items-center">
                  <p className="text-gray-400 font-bold group-hover:hidden">
                    Hover to show hint
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xl p-1 px-4 bg-slate-500">
                <p>
                  This hint will be available in {7 - everyDrafts.length}{" "}
                  guess(es).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
}
