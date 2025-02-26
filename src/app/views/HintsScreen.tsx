export default function HintsScreen({
  setSelectedView,
}: {
  setSelectedView: any;
}) {
  return (
    <div
      className="absolute flex flex-col place-content-center items-center w-full h-full bg-black/30 backdrop-blur-sm p-4"
      onClick={() => setSelectedView("Default")}
    >
      <div
        className="backdrop-blur-md bg-white/10 rounded-xl flex flex-col place-content-center items-center w-full md:w-1/3 h-fit min-h-[60%] md:min-h-[40%] p-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-4xl text-gray-700 font-extrabold">
          This feature is WIP
        </p>
      </div>
    </div>
  );
}
