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
      const { data } = await axios.get('https://kitsu.io/api/edge/trending/anime')
      let kitsuAnimes = data?.data;
      return kitsuAnimes;
    }
  
    async function getAnimes() {
      let paginationData = {
        page: 0,
        limit: 10,
        offset: 0,
      }
      let response = await api.get(`/animes?page=${paginationData.page}&limit=${paginationData.limit}&offset=${paginationData.offset}`)
  
      setAnimes(response.data.payload.data)
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
  
      let animes = data?.data
  
      if(animes) {
        animes.map(async (anime : any) => {
          let anime_aux = anime.attributes
  
          let apiData : Anime = {
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
  
          try {
            await api.post('/animes/', apiData)
          } catch (e) {}
        })
        
      }
  
    }

    async function asyncEffect(){
      await getAnimes()
      addAnimeToSystem()
    }

    asyncEffect();

  }, [])

  return (
    <main className="flex min-h-screen flex-col mx-5 md:px-16 pt-44 md:container">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

        {
          animes &&
          animes.map((anime, index) => {
            return (
              <AnimeCard anime={anime} key={index}/>
            )
          })
        }
      </div>
    </main>
  );
}
