"use client"

import { useEffect, useState } from "react";
import AnimeCard from "./(components)/AnimeCard";
import { Anime } from "./types/anime";
import axios from "axios";
import { api } from "./api";

export default function Home() {

  const [animes, setAnimes] = useState([]);

  useEffect(() => {
    async function fetchAnimes() {
      const response = await axios.get('https://kitsu.io/api/edge/trending/anime')
  
      return response
    }
  
    async function getAnimes() {
      let paginationData = {
        page: 0,
        limit: 5,
        offset: 0,
      }
      let response = await api.get(`/animes?page=${paginationData.page}&limit=${paginationData.limit}&offset=${paginationData.offset}`)
  
      console.log(response.data.payload.data)
    }
  
    function verifyIsRecent(anime_release_date_month : number, anime_release_date_year : number) {
      const date = new Date()
  
      if(anime_release_date_month - date.getMonth() < -2 && anime_release_date_year == date.getFullYear()){
        return true;
      }
  
      return false
    }
  
    async function addAnimeToSystem() {
      const { data } = await fetchAnimes()
  
      let animes = data.data
  
      if(animes) {
        animes.map((anime : any) => {
          let anime_aux = anime.attributes
  
          let apiData : Anime = {
            id: anime_aux.id,
            description: anime_aux.description,
            jp_title: anime_aux.titles.en_jp,
            en_title: anime_aux.titles.en,
            ep_count: anime_aux.episodeCount,
            image: anime_aux.posterImage.original,
            avg_rating: String(anime_aux.averageRating / 10),
            start_airing: String(anime_aux.startDate),
            finished_airing: String(anime_aux.endDate),
            type: anime_aux.ageRatingGuide,
            studio_name: '',
            recently_added: verifyIsRecent(Number(anime_aux.startDate.split('-')[1]), Number(anime_aux.startDate.split('-')[0]))
          }
  
          // TODO: arrumar criação de animes na API
          try {
            api.post('/animes/', apiData)
          }
          catch (e) {}
        })
        
      }
  
    }

    getAnimes()
    addAnimeToSystem()
  }, [])

  const data = {
    en_title: "Demon Slayer",
    jp_title: "Kimetsu no Yaiba",
    image: "https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2021/09/10/demon-slayer-capa.png",
    description: "A young boy named Tanjiro Kamado joins the Demon Slayer Corps to a...",
    ep_count: 26,
    avg_rating: "9.5",
    type: "Action, Adventure, Fantasy",
    finished_airing: "2024-23-23",
    start_airing: "2023-34-34",
    studio_name: "Ufotable",
    recently_added: false
  } as Anime;

  return (
    <main className="flex min-h-screen flex-col px-24 pt-44 container">
      <div className="grid grid-cols-4 gap-4">

        {

        }
        <AnimeCard anime={data}/>
      </div>
    </main>
  );
}
