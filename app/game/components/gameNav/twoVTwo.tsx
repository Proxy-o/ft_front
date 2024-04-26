import { Users } from "lucide-react";
import { useState } from "react";

const TwoVTwo = () => {
  const [hover, setHover] = useState(false);
  return (
    <>
      <div
        className={`w-52 h-52 bg-background flex flex-col justify-center items-center rounded-xl shadow-primary shadow-sm transition duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 relative`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className={
            `absolute w-full h-full flex flex-col justify-center items-center transition duration-300 ease-in-out` +
            (hover ? "transform blur-sm" : "transform blur-none")
          }
        >
          <Users size={150} />
          <div className="text-2xl font-bold">2 v 2</div>
        </div>
        <div
          className={`w-full h-full flex flex-row justify-between items-left transition duration-300 ease-in-out ${
            hover ? "opacity-100" : "opacity-0"
          } absolute`}
        >
          <div className="flex flex-col justify-between items-center h-4/6 w-3">
            <div className="bg-primary h-20 w-3 animate-moveUpLeft"></div>
            <div className="bg-primary h-20 w-3 animate-moveDownLeft"></div>
          </div>
          <div className="h-full w-full">
            <div className="bg-primary h-3 w-3 animate-moveArround"></div>
          </div>
          <div className="flex flex-col justify-between items-center h-4/6 w-3">
            <div className="bg-primary h-20 w-3 animate-moveUpRight"></div>
            <div className="bg-primary h-20 w-3 animate-moveDownRight"></div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes moveUpLeft {
          0%,
          100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(50%);
          }
          50% {
            transform: translateY(33%);
          }
          75% {
            transform: translateY(20%);
          }
        }

        .animate-moveUpLeft {
          animation: moveUpLeft 4s ease-in-out infinite;
        }

        @keyframes moveUpRight {
          0%,
          100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(50%);
          }
          50% {
            transform: translateY(50%);
          }
          75% {
            transform: translateY(50%);
          }
        }

        .animate-moveUpRight {
          animation: moveUpRight 4s ease-in-out infinite;
        }

        @keyframes moveDownLeft {
          0%,
          100% {
            transform: translateY(100%);
          }
          50% {
            transform: translateY(75%);
          }
          75% {
            transform: translateY(50%);
          }
        }

        .animate-moveDownLeft {
          animation: moveDownLeft 4s ease-in-out infinite;
        }

        @keyframes moveDownRight {
          0%,
          100% {
            transform: translateY(100%);
          }
          33% {
            transform: translateY(50%);
          }
          50% {
            transform: translateY(75%);
          }
          75% {
            transform: translateY(50%);
          }
        }

        .animate-moveDownRight {
          animation: moveDownRight 4s ease-in-out infinite;
        }

        @keyframes moveArround {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(1500%) translateY(700%);
          }
          50% {
            transform: translateX(0%) translateY(1400%);
          }
          54% {
            transform: translateX(300%) translateY(1650%);
          }
          75% {
            transform: translateX(1500%) translateY(700%);
          }
        }
        .animate-moveArround {
          animation: moveArround 4s linear infinite;
        }
      `}</style>
    </>
  );
};

export default TwoVTwo;
