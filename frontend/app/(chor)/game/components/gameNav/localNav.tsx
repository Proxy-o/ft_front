"use client";
import { useRouter } from "next/navigation";
import OneVOne from "./oneVOne";
import TournamentNav from "./tournament";

const LocalNav = ({
  mode,
  setMode,
}: {
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<"local" | "online" | "main">>;
}) => {
  const router = useRouter();
  return (
    <>
      <div
        className={` absolute flex flex-col items-center justify-center h-fit w-full rounded-md top-0 gap-2
       ${
         mode === "local"
           ? "left-0 transition-all duration-500 ease-in-out"
           : "-left-[1000px] transition-all duration-500 ease-in-out"
       }`}
      >
        <div className="text-4xl">Local Games</div>
        <div className={` flex flex-col md:flex-row w-full h-fit top-0 z-30 flex-wrap items-center md:items-start justify-center gap-4`}>
          <div
            className="rounded-md flex flex-col items-center justify-center"
            onClick={() => router.push("/game/local/oneOffline")}
          >
            <OneVOne type="two" />
            <div className="text-2xl">One V One</div>
          </div>
          <div
            className=" rounded-md flex flex-col items-center justify-center"
            onClick={() => router.push("/game/local/tournament")}
          >
            <TournamentNav />
            <div className="text-2xl">Tournament</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocalNav;
