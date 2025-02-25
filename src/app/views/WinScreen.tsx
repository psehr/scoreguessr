import { GuessableScore, ScoreDraft } from "../types";

export default function WinScreen({
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
      className="absolute flex flex-col place-content-center items-center w-full h-full bg-black/30"
      onClick={() => setSelectedView("Default")}
    >
      <div
        className="backdrop-blur-md bg-white/10 rounded-xl flex flex-col place-content-start items-center w-1/3 h-fit min-h-[40%] p-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col place-content-center items-center w-full h-1/4">
          <p className="text-2xl font-semibold">Congratulations ! 🥳</p>
          <p>
            It took you {everyDrafts.length} attempt(s) to find today's score.
          </p>
        </div>
        <div className="flex place-content-center items-center w-full h-1/2">
          <iframe
            className=""
            id="ytplayer"
            itemType="text/html"
            src={`https://www.youtube.com/embed/${
              validScore.yt_link.split("=")[1]
            }`}
          ></iframe>
        </div>
        <div className="flex flex-row w-full h-1/4 place-content-center items-center space-x-4">
          <button
            className="w-fit h-fit bg-green-600/50 border-green-600"
            onClick={() => {
              navigator.clipboard.writeText(
                `I successfully found Day ${validScore.day_index} of scoreguessr! 🥳\nIt took me ${everyDrafts.length} guess(es).\nTry it for yourself here: https://scoreguessr.pseh.fr/`
              );
            }}
          >
            Copy breakdown to clipboard
          </button>
          <button
            className="w-fit h-fit bg-red-600/50 border-red-600"
            onClick={() => setSelectedView("Default")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
