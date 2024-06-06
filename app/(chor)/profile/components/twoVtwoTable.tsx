"use client";
import React from "react";
import GamesState from "./gamesState";
import useGetTwoGames from "../hooks/useGetTwoGames";

export default function TwoVtwoTable({ id }: { id: string }) {
  const { data: games, isSuccess } = useGetTwoGames(id);

  return isSuccess && <GamesState games={games} user_id={id} />;
}
