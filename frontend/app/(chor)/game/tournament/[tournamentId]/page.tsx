"use client";
import Tournament from "./tournament";

export default function Page({ params }: { params: { tournamentId: string } }) {
  return (
    <div className={`flex flex-col w-full h-full justify-start items-center`}>
      <Tournament tournamentId={params.tournamentId} />
    </div>
  );
}
