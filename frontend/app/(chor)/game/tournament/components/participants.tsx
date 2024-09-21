import { PreGameProfile } from "../../components/preGameProfile";

const Participants = ({ tournament }: { tournament: any }) => {
  const participant1 = tournament?.user1;
  const participant2 = tournament?.user2;
  const participant3 = tournament?.user3;
  const participant4 = tournament?.user4;

  return (
    <div className="flex flex-col w-full h-full justify-center items-center gap-2 lg:gap-5">
        <div className="text-2xl lg:text-3xl font-bold h-fit my-auto">
            Participants
        </div>
    <div className="flex flex-row justify-between w-full h-fit items-center">
      <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller bg-blue-500">
        <PreGameProfile avatar={participant1?.avatar} side="left" />
      </div>
      <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller bg-red-500">
        <PreGameProfile avatar={participant2?.avatar} side="left" />
      </div>
      <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller bg-blue-500">
        <PreGameProfile avatar={participant3?.avatar} side="left" />
      </div>
      <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller bg-red-500">
        <PreGameProfile avatar={participant4?.avatar} side="left" />
      </div>
    </div>
    </div>
  );
};

export { Participants };
