import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import useAcceptInvitation from "../../hooks/invitations/useAccepteInvitation";
import useDeclineInvitation from "../../hooks/invitations/useDeclineMutation";
import { usePathname, useRouter } from "next/navigation";
import { t_Invitation } from "@/lib/types";
import { useState } from "react";

const Invitation = ({ invitation }: { invitation: t_Invitation }) => {
  const { mutate: declineMutation } = useDeclineInvitation();
  const { mutate: acceptInvitationMutation } = useAcceptInvitation();
  const router = useRouter();
  const path = usePathname();

  const [disabled, setDisabled] = useState(false);

  function disableButton() {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 2000);
  }

  return (
    <div key={invitation.id} className="w-full border-t pt-2">
      <div className="flex flex-row mx-auto justify-between items-center gap-2 w-10/12">
        <Avatar className="my-auto w-fit h-fit">
          <AvatarImage
            src={invitation.sender.avatar}
            alt="profile image"
            className="rounded-md h-8 w-8"
          />
          <AvatarFallback className="rounded-md">PF</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-start items-start gap-1">
          <p className="text-base text-primary">{invitation.sender.username}</p>
        </div>

        <div className="flex flex-row justify-end items-center gap-2">
          {path == "/game/oneVone" ||
          path == "/game/twoVtwo" ? (
            <>
              <Button
                className={`${
                  disabled && "opacity-50 disabled cursor-not-allowed"
                }`}
                size={"xs"}
                onClick={() => {
                  acceptInvitationMutation(invitation.id);
                  disableButton();
                }}
              >
                <Check size={20} />
              </Button>
              <Button
                className={`${
                  disabled && "opacity-50 disabled cursor-not-allowed"
                }`}
                variant={"secondary"}
                size={"xs"}
                onClick={() => {
                  declineMutation(invitation.id);
                  disableButton();
                }}
              >
                <X size={20} />
              </Button>
            </>
          ) : (
            <Button
              className="w-28"
              size={"sm"}
              onClick={() => {
                invitation.type == "two" && router.push("/game/oneVone");
                invitation.type == "four" && router.push("/game/twoVtwo");
              }}
            >
              {invitation.type == "two" && "1 VS 1"}
              {invitation.type == "four" && "2 VS 2"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invitation;
