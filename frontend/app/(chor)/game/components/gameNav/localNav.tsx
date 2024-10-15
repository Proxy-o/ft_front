"use client";
import { useRouter } from "next/navigation";
import OneVOne from "./oneVOne";
import TournamentNav from "./tournament";
import { ArrowLeft } from "lucide-react";

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
        className={`absolute flex flex-col md:flex-row w-full h-fit top-0 z-30 flex-wrap items-center md:items-start justify-center gap-4 ${
          mode === "local"
            ? "left-0 transition-all duration-500 ease-in-out"
            : "-left-[1000px] transition-all duration-500 ease-in-out"
        }`}
      >
          <ArrowLeft
            height={20}
            width={20}
            className="absolute -top-6 left-0 cursor-pointer text-black dark:text-white rounded-sm hover:text-gray-700 dark:hover:text-gray-300"

            onClick={() => setMode("main")}
          />
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
    </>
  );
};

export default LocalNav;
