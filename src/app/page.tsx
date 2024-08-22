"use client"

import Image from "next/image";
import { useEffect } from "react";
import { useAuthContext } from "./contexts/auth";
import AnimeCard from "./(components)/AnimeCard";
import { Anime } from "./types/anime";

export default function Home() {

  const data = {
    id: 0,
    en_title: "Demon Slayer",
    jp_title: "Kimetsu no Yaiba",
    image: "https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2021/09/10/demon-slayer-capa.png",
    description: "A young boy named Tanjiro Kamado joins the Demon Slayer Corps to a...",
    ep_count: 26,
    avg_rating: 9.5,
    type: "Action, Adventure, Fantasy",
    finished_airing: new Date() || null,
    start_airing: new Date(),
    studio_name: "Ufotable"
  } as Anime;

  return (
    <main className="flex min-h-screen flex-col px-24 pt-44 container">
      <div className="grid grid-cols-4 gap-4">
        <AnimeCard anime={data}/>
      </div>
    </main>
  );
}
