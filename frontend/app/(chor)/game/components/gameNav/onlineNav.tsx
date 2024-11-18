import OneVOne from "./oneVOne";
import Link from "next/link";
import TwoVTwo from "./twoVTwo";

const OnlineNav = ({
  mode,
  setMode,
}: {
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<"local" | "online" | "main">>;
}) => {
  return (
    <>
      <div
        className={` absolute flex flex-col items-center justify-center h-fit w-full rounded-md top-0 gap-2
       ${
         mode === "online"
           ? "left-0 transition-all duration-500 ease-in-out"
           : "-left-[1000px] transition-all duration-500 ease-in-out"
       }`}
      >
        <div className="text-4xl">Online Games</div>
        <div
          className={` flex flex-col md:flex-row w-full h-fit top-0 z-30 flex-wrap items-center md:items-start justify-center gap-4`}
        >
          <div className="rounded-md flex flex-col items-center justify-center">
            <Link href="/game/oneVone">
              <div>
                <OneVOne type="two" />
              </div>
            </Link>
            <div className="text-2xl">One V One</div>
          </div>
          <div className=" rounded-md flex flex-col items-center justify-center">
            <Link href="/game/twoVtwo">
              <div>
                <TwoVTwo />
              </div>
            </Link>
            <div className="text-2xl">Two V Two</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnlineNav;
