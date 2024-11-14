import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const AliasDialog = ({
  setFinalWinner,
    setPlayerAlias,
}: {
    setFinalWinner: React.Dispatch<React.SetStateAction<number>>;
  setPlayerAlias: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [alias1, setAlias1] = useState("");
  const [alias2, setAlias2] = useState("");
  const [alias3, setAlias3] = useState("");
  const [alias4, setAlias4] = useState("");
  return (
    <Card className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center text-white text-3xl">
        Insert Players Nicknames
      </div>
      <div className="flex flex-col w-full p-4 items-center justify-center gap-4">
        <Input
          type="text"
          placeholder="Nickname 1"
          value={alias1}
          onChange={(e) => setAlias1(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Nickname 2"
          value={alias2}
          onChange={(e) => setAlias2(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Nickname 3"
          value={alias3}
          onChange={(e) => setAlias3(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Nickname 4"
          value={alias4}
          onChange={(e) => setAlias4(e.target.value)}
        />

        <button
          onClick={() => {
            if (alias1 === "" || alias2 === "" || alias3 === "" || alias4 === "") {
              toast.error("Please fill all the fields");
              return;
            }
            setPlayerAlias([alias1, alias2, alias3, alias4]);
            setFinalWinner(-1);
          }}
          className="w-48 h-10 bg-secondary mt-2 border-b-2 border-transparent focusborderButton rounded-md bg-opacity-75"
        >
          Add Alias
        </button>
      </div>
    </Card>
  );
};
export default AliasDialog;
