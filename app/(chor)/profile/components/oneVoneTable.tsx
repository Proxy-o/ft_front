"use client";
import React from "react";
import useGetGames from "../hooks/useGetGames";
import GamesState from "./gamesState";

export default function OneVoneTable({ id }: { id: string }) {
  const { data: games, isSuccess } = useGetGames(id);

  return (
    isSuccess && (
      <GamesState games={games} user_id={id} />
    )
  );
}
