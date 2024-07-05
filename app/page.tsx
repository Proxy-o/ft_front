import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen h-full flex-col gap-4  p-2">
      <div className="flex-1 w-full flex flex-col  items-center gap-10 lg:flex-row ">
        <div className="flex  flex-col justify-center flex-1 w-full  items-center gap-10 ">
          <div className=" w-full">
            <div className="flex justify-center flex-col  items-center my-6  ">
              <h1 className="font-bold text-2xl lg:text-3xl text-center">
                Play Ping Pong Online
              </h1>
              <h1 className="font-bold text-2xl lg:text-3xl ">
                on the #1 Site!
              </h1>
            </div>
            <div className="flex justify-around">
              <h2>
                <strong>14</strong> Games Today
              </h2>
              <h2>
                <strong>2</strong> Playing Now
              </h2>
            </div>
          </div>
          <Button className="lg:h-24 lg:w-64 h-16 lg:text-xl flex flex-col ">
            <div className="flex gap-2 w-full  justify-center items-center">
              <Image
                src={"/pino.png"}
                width={30}
                height={30}
                alt={"ping pong"}
              />
              Play Online
            </div>
          </Button>
        </div>
        <Image
          src="/image3.jpeg"
          alt="ping pong"
          width={500}
          height={500}
          className="object-fill rounded-lg lg:-order-1 flex-1 w-full"
        />
      </div>
      <div className="flex-1 w-full flex flex-col  items-center gap-10 lg:flex-row p-4 bg-accent/30 rounded-lg">
        <div className="flex  flex-col justify-center flex-1 w-full  items-center gap-10">
          <div>
            <div className="flex justify-center flex-col  items-center my-6 ">
              <h1 className="font-bold text-2xl lg:text-3xl text-center">
                Play Tournament with
              </h1>
              <h1 className="font-bold text-2xl lg:text-3xl ">your friends!</h1>
            </div>
            <div className="flex  justify-center gap-4  h-12 items-center w-44 mx-auto">
              <h2>
                <strong>2</strong> vs 2
              </h2>
              <h1>or</h1>
              <h2>
                <strong>1</strong> vs 1
              </h2>
            </div>
          </div>
          <Button
            className="lg:h-24 lg:w-64 h-16  lg:text-xl flex flex-col "
            variant={"outline"}
          >
            <h1 className="">Start Tournament</h1>
          </Button>
        </div>
        <Image
          src="/image4.gif"
          alt="ping pong"
          width={500}
          height={500}
          className="object-fill rounded-lg flex-1 w-full"
        />
      </div>
      <div className=" flex-1  w-full flex flex-col  items-center gap-10 lg:flex-row p-4 ">
        <div className="flex  flex-col justify-center flex-1 w-full  items-center gap-10">
          <div>
            <div className="flex justify-center flex-col  items-center my-6 ">
              <h1 className="font-bold text-2xl lg:text-3xl text-center">
                Play Ping Pong Online
              </h1>
              <h1 className="font-bold text-2xl lg:text-3xl ">
                on the #1 Site!
              </h1>
            </div>
            <div className="flex justify-around">
              <h2>
                <strong>14</strong> Games Today
              </h2>
              <h2>
                <strong>2</strong> Playing Now
              </h2>
            </div>
          </div>
          <Button className="lg:h-24 lg:w-64 h-16  lg:text-xl flex flex-col  ">
            <div className="flex gap-2">
              <Image
                src={"/pino.png"}
                width={30}
                height={30}
                alt={"ping pong"}
              />
              Play Online
            </div>
            <h1 className="text-xs">Play with someone at any level</h1>
          </Button>
        </div>
        <Image
          src="/image2.jpeg"
          alt="ping pong"
          width={500}
          height={300}
          className="object-fill rounded-lg lg:-order-1 flex-1 w-full"
        />
      </div>
    </main>
  );
}
