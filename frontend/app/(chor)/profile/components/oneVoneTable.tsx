"use client";
import React from "react";
import useGetGames from "../hooks/useGetGames";
import GamesState from "./gamesState";

export default function OneVoneTable({ id }: { id: string }) {
  const { data, isSuccess } = useGetGames(id);
console.log(data)
  return (
    isSuccess && (
      <GamesState games={data.pages[0].results} user_id={id} />
    )
  );
}
