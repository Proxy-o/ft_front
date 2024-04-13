import getCookie from "@/lib/functions/getCookie";
import useCreateTournement from "../hooks/useCreateTournement";
import TourenementBoard from "./tournementBoard";
import { Button } from "@/components/ui/button";

const Tourenement = () => {
  const user_id = getCookie("user_id") || "";
  const { mutate: createTournement } = useCreateTournement(user_id);

  return (
    <div>
      <TourenementBoard />
      <Button
        onClick={() => {
          createTournement(user_id);
        }}
      >
        Create Tournement
      </Button>
    </div>
  );
};

export default Tourenement;
