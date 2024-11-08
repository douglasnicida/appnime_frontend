"use client"

import { Suspense, useEffect, useState } from "react";
// import AnimeCard from "./(components)/AnimeCard";
import { Anime } from "./types/anime";
import { api } from "./api";
import SearchInput from "./(components)/SearchInput";
import { PaginationComponent, updateSearchParams } from "./(components)/Pagination";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Importa o componente de forma dinâmica, desativando o SSR
const AnimeCard = dynamic(() => import('./(components)/AnimeCard').then(mod => mod.default), {
  ssr: false,
});

export default function Home() {

  const [trendingAnimes, setTrendingAnimes] = useState<Anime[] | []>([]);
  const [animes, setAnimes] = useState<Anime[] | []>([]);

  const [searchScreen, setSearchScreen] = useState<boolean>(false);

  const [urlChange, setURLChange] = useState<boolean>(false)
  const [maxPage, setMaxPage] = useState<number>(100);

  const [loading, setLoading] = useState<boolean>(true);
  
  // TODO: VERIFICAR MOTIVO DE NA PRIMEIRA RENDERIZAÇÃO NÃO APARECER OS ANIMES
  //TODO: APLICAR O LAZY LOADING
  async function fetchSearchAnimes(inputValue: string) {
    // const { data } = await axios.get(`https://kitsu.io/api/edge/anime?filter[text]=${inputValue}`)

    let paginationData = {
      page: 0,
      limit: 28,
      offset: 0,
    }

    updateSearchParams({ search: inputValue });

    const { data } = await api.get(`/animes?page=${paginationData.page}&limit=${paginationData.limit}&offset=${paginationData.offset}&search=${inputValue}`)
    setMaxPage(data.payload.meta.lastPage)
    return data.payload.data
  }

  async function handleHomeSearch(value: string) {
    let resOtherAnimes = await fetchSearchAnimes(value)

    return resOtherAnimes
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    async function getAnimes() {
      const pageParam = params.get('page') != '' ? Number(params.get('page')) : 1
      const limitParam = params.get('limit') != '' ? Number(params.get('limit')) : 28
      
      const trendingResponse = await api.get(`/animes/recent`);
      setTrendingAnimes(trendingResponse.data.payload);

      const animesPaginationData = {
        page: pageParam - 1,
        limit: limitParam,
        offset: 10 + (limitParam * (pageParam-1))
      };
      
      setLoading(true)
      const animesResponse = await api.get(`/animes?page=${animesPaginationData.page}&limit=${animesPaginationData.limit}&offset=${animesPaginationData.offset}`);
      setAnimes(animesResponse.data.payload.data);
      setLoading(false);
      setMaxPage(animesResponse.data.payload.meta.lastPage);
    }
    
    if(params.get('search') == '' || params.get('search') == null) getAnimes();
  }, [urlChange]);

  return (
    <main className="flex min-h-screen flex-col mx-5 md:px-16 pt-44 md:container">
      <SearchInput list={animes} setList={setAnimes} query="" inputPlaceholder="Digite o nome do anime" home={setSearchScreen} searchFunction={handleHomeSearch}/>
      {
        !searchScreen && 
        <div className="">
          <h1 className="text-[26px] font-bold underline mb-7 mt-4 uppercase">Animes Recentes</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Suspense fallback={<FallBackSkeleton />}>
            {
              trendingAnimes.map((anime, index) => {
                return (
                  <AnimeCard anime={anime} key={index}/>
                )
              })
            }
            </Suspense>
          </div>
        </div>
      }
      <h1 className={`text-[26px] font-bold underline mb-7 ${searchScreen ? '-mt-1' : 'mt-16'} uppercase`}>Animes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Suspense fallback={<FallBackSkeleton />}>
        {
          !loading ?
          animes.map((anime, index) => {
            return (
              <AnimeCard anime={anime} key={index}/>
            )
          }) : 
          <FallBackSkeleton />
        }
        </Suspense>
      </div>
      <div className="my-5 w-max self-end">
        <PaginationComponent setChanged={setURLChange} changed={urlChange} maxPage={maxPage}/>
      </div>
    </main>
  );
}

const FallBackSkeleton = () => {
  return (
    <>
      <Skeleton className="h-[430px] w-[310px] rounded-xl" />
      <Skeleton className="h-[430px] w-[310px] rounded-xl" />
      <Skeleton className="h-[430px] w-[310px] rounded-xl" />
      <Skeleton className="h-[430px] w-[310px] rounded-xl" />
    </>
  )
}
