import { GuessableScore, ScoreDraft } from "../types";

export default function HintsScreen({
  setSelectedView,
  validScore,
  everyDrafts,
}: {
  setSelectedView: any;
  validScore: GuessableScore;
  everyDrafts: ScoreDraft[];
}) {
  return (
    <div
      className="absolute flex flex-col place-content-center items-center w-full h-full bg-black/30 backdrop-blur-sm p-4"
      onClick={() => setSelectedView("Default")}
    >
      <div className="rounded-xl flex flex-col place-content-center items-center w-full md:w-1/3 h-fit min-h-[60%] md:min-h-[40%] p-4 space-y-4">
        <div className="w-full shadow-lg" onClick={(e) => e.stopPropagation()}>
          <p className="font-semibold text-3xl p-1 px-4 bg-slate-600 rounded-t-xl text-green-400">
            Hint 1: Accuracy
          </p>
          {everyDrafts.length >= 3 ? (
            <div className="flex flex-row space-x-2 text-xl p-1 px-4 bg-slate-500">
              <p>Accuracy is {((validScore.acc || 1) * 100).toFixed(2)}%</p>
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
        <div className="w-full shadow-lg" onClick={(e) => e.stopPropagation()}>
          <p className="font-semibold text-3xl p-1 px-4 bg-slate-600 rounded-t-xl text-blue-400">
            Hint 2: Mods
          </p>
          {everyDrafts.length >= 5 ? (
            <div className="flex flex-row space-x-2 text-xl p-1 px-4 bg-slate-500">
              <p>Used mods: </p>
              {validScore.mods?.map((mod) => (
                <p key={mod.acronym}>{mod.acronym}</p>
              ))}
              {!validScore.mods?.length ? <p>None</p> : null}
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

        <div className="w-full shadow-lg" onClick={(e) => e.stopPropagation()}>
          <p className="font-semibold text-3xl p-1 px-4 bg-slate-600 rounded-t-xl text-red-400">
            Hint 3: Tags
          </p>
          {everyDrafts.length >= 7 ? (
            <div className="text-xl p-1 px-4 bg-slate-500">
              {validScore.tags?.map((tag) => (
                <p key={tag}>{tag}</p>
              ))}
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
