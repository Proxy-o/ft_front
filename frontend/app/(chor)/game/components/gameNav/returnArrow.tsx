import { ArrowLeft } from "lucide-react";

const ReturnArrow = ({ mode, setMode }: { mode: string; setMode: React.Dispatch<React.SetStateAction<"local" | "online" | "main">>; }) => {
    return (mode !== "main" && (
        <div className="absolute top-[45%] left-0 flex h-10 w-10 rounded-full  items-center justify-center overflow-hidden z-40 cursor-pointer"
          onClick={() => setMode("main")}
        >
          <div className="w-full h-full flex bg-gradient-to-tr from-cyan-500 to-purple-500 opacity-60 border-black"></div>
          <ArrowLeft
            height={20}
            width={20}
            className="absolute  text-black dark:text-white rounded-sm hover:text-gray-700 dark:hover:text-gray-300 z-50"
          />
        </div>
      )
    );

}

export default ReturnArrow;