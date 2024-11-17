import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {  useState } from "react";
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

  const hasDuplicates = (aliases: string[]): boolean => {
    const normalizedAliases = aliases.map(alias => alias.trim().toLowerCase());
    return new Set(normalizedAliases).size !== normalizedAliases.length;
  };

  const findDuplicates = (aliases: string[]): string[] => {
    const seen = new Set();
    const duplicates = new Set();
    
    aliases.forEach(alias => {
      const normalized = alias.trim().toLowerCase();
      if (seen.has(normalized)) {
        duplicates.add(alias);
      }
      seen.add(normalized);
    });

    return Array.from(duplicates) as string[];
  };

  const handleSubmit = () => {
    const aliases = [alias1, alias2, alias3, alias4];
    
    // Check for empty fields
    if (aliases.some(alias => alias.trim() === "")) {
      toast.error("Please fill all the fields");
      return;
    }

    // Check for duplicates
    if (hasDuplicates(aliases)) {
      const duplicateAliases = findDuplicates(aliases);
      toast.error(`Duplicate aliases found: ${duplicateAliases.join(", ")}`);
      return;
    }

    // All validations passed
    setPlayerAlias(aliases.map(alias => alias.trim()));
    setFinalWinner(-1);
    toast.success("Aliases set successfully!");
  };

  const handleAliasChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    // Remove leading/trailing spaces as user types
    setter(value.trim());
  };

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
          onChange={(e) => handleAliasChange(e.target.value, setAlias1)}
        />
        <Input
          type="text"
          placeholder="Nickname 2"
          value={alias2}
          onChange={(e) => handleAliasChange(e.target.value, setAlias2)}
        />
        <Input
          type="text"
          placeholder="Nickname 3"
          value={alias3}
          onChange={(e) => handleAliasChange(e.target.value, setAlias3)}
        />
        <Input
          type="text"
          placeholder="Nickname 4"
          value={alias4}
          onChange={(e) => handleAliasChange(e.target.value, setAlias4)}
        />

        <button
          onClick={handleSubmit}
          className="w-48 h-10 bg-secondary mt-2 border-b-2 border-transparent focusborderButton rounded-md bg-opacity-75"
        >
          Add Alias
        </button>
      </div>
    </Card>
  );
};

export default AliasDialog;