"use client";
import React from "react";
import GamesState from "./gamesState";
import useGetTwoGames from "../hooks/useGetTwoGames";
import { Button } from "@/components/ui/button";
import { ArrowBigDownDash } from "lucide-react";

export default function TwoVtwoTable({ id }: { id: string }) {
  const { data, isSuccess, fetchNextPage } = useGetTwoGames(id);
  const games = data?.pages.map((page) => page.results).flat();
  const [haseMore, setHasMore] = React.useState(true);
  React.useEffect(() => {
    if (data) {
      setHasMore(data.pages[data.pages.length - 1].next ? true : false);
    }
  }, [data]);

  return (
    isSuccess && (
      <>
        <GamesState games={games} user_id={id} />
        <div className="w-full flex justify-center items-center ">
          {games?.length ? (
            <Button
              size={"sm"}
              variant="ghost"
              disabled={!haseMore}
              className="mt-4"
              onClick={() => fetchNextPage()}
            >
              {haseMore ? <ArrowBigDownDash /> : "No more games"}
            </Button>
          ) : (
            <></>
          )}
        </div>
      </>
    )
  );
}
