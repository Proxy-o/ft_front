"use client";
import React from "react";
import useGetGames from "../hooks/useGetGames";
import GamesState from "./gamesState";
import { Button } from "@/components/ui/button";

export default function OneVoneTable({ id }: { id: string }) {
  const { data, isSuccess, fetchNextPage } = useGetGames(id);
  // console.log(data);
  const games = data?.pages.map((page) => page.results).flat();
  console.log(games);
  const haseMore = data?.pages.map((page) => page.next).flat();
  return (
    isSuccess && (
      <>
      <GamesState games={games} user_id={id} />
      {haseMore && <Button className="mt-4" onClick={() => fetchNextPage()}>
        Load more
      </Button>}
      </>
    )
  );
}
