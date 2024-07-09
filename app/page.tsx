import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen h-full flex-col gap-4  p-2">
      <Card className=" flex-1  w-full flex flex-col  items-center gap-10 lg:flex-row p-4 ">
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
      </Card>
    </main>
  );
}
