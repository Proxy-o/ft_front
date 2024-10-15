"use client";

export default function LocalLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex flex-col items-center w-full h-fit gap-4 mb-2">
      <h1 className="text-3xl md:text-7xl mt-5">Ping Pong</h1>
      <div className="text-base font-light mb-5 text-center">
        Play a game of ping pong with the same keyboard!
      </div>
      {children}
    </div>
  );
}
