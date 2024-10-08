import OneVOne from "../components/gameNav/oneVOne";
import TournamentNav from "../components/gameNav/tournament";

const Welcome = ({
  setType,
}: {
  setType: React.Dispatch<
    React.SetStateAction<"game" | "tournament" | "welcome">
  >;
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-10">
      <div className="rounded-md" onClick={() => setType("game")}>
        <OneVOne type="two" />
      </div>
      <div className=" rounded-md" onClick={() => setType("tournament")}>
        <TournamentNav />
      </div>
    </div>
  );
};

export default Welcome;
