import { useRouter } from "next/navigation";
import OneVOne from "./oneVOne";
import TournamentNav from "./tournament";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";

const OnlineNav = ({
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
        className={`absolute flex w-full h-fit top-0 z-30 flex-wrap items-start justify-center gap-4 ${
          mode === "online"
            ? "left-0 transition-all duration-500 ease-in-out"
            : "-left-[1000px] transition-all duration-500 ease-in-out"
        }`}
      >
        <ArrowLeft
          height={20}
          width={20}
          className="absolute top-3 left-3 cursor-pointer text-white rounded-sm hover:text-gray-300"
          onClick={() => setMode("main")}
        />
        <div
          className="rounded-md flex flex-col items-center justify-center"
        >
          <Link href="/game/oneVone">
            <div>
              <OneVOne type="two" />
            </div>
          </Link>
          <div className="text-2xl">One V One</div>
        </div>
        <div
          className=" rounded-md flex flex-col items-center justify-center"
        >
          <Link href="/game/tournament">
            <div>
              <TournamentNav />
            </div>
          </Link>
          <div className="text-2xl">Tournament</div>
        </div>
      </div>
    </>
  );
};

export default OnlineNav;
