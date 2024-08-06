"use client";
import React from "react";
import GamesState from "./gamesState";
import useGetTwoGames from "../hooks/useGetTwoGames";

export default function TwoVtwoTable({ id }: { id: string }) {
  const { data, isSuccess } = useGetTwoGames(id);



  return isSuccess && <GamesState games={data.pages[0].results} user_id={id} />;
}
