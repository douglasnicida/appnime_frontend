"use client"

import { useEffect, useState } from "react";
import AnimeCard from "./(components)/AnimeCard";
import { Anime } from "./types/anime";
import { api } from "./api";
import SearchInput from "./(components)/SearchInput";
import { PaginationComponent, updateSearchParams } from "./(components)/Pagination";

export default function Home() {

  const [trendingAnimes, setTrendingAnimes] = useState<Anime[] | []>([]);
  const [animes, setAnimes] = useState<Anime[] | []>([]);

  const [searchScreen, setSearchScreen] = useState<boolean>(false);

  const [urlChange, setURLChange] = useState<boolean>(false)
  const [maxPage, setMaxPage] = useState<number>(100);

  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get('search')
  const pageParam = Number(params.get('page'))
  const limitParam = Number(params.get('limit'))

  //TODO: APLICAR O LAZY LOADING

  async function fetchSearchAnimes(inputValue: string) {
    // const { data } = await axios.get(`https://kitsu.io/api/edge/anime?filter[text]=${inputValue}`)

    let paginationData = {
      page: 0,
      limit: limitParam,
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
    async function getAnimes() {
      let trendingResponse = await api.get(`/animes/recent`);
      setTrendingAnimes(trendingResponse.data.payload);

      let animesPaginationData = {
        page: pageParam - 1,
        limit: limitParam,
        offset: 10 + (limitParam * pageParam)
      };

      let animesResponse = await api.get(`/animes?page=${animesPaginationData.page}&limit=${animesPaginationData.limit}&offset=${animesPaginationData.offset}`);
      setAnimes(animesResponse.data.payload.data);
      setMaxPage(animesResponse.data.payload.meta.lastPage);
    }
    
    if(params.get('search') == '') getAnimes();
  }, [pageParam, limitParam, urlChange]);

  useEffect(() => {
    params.set('search', '');
    params.set('page', '1');
    params.set('limit', '28');
    
    // Atualiza a URL sem recarregar a página
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
  }, []);

  return (
    <main className="flex min-h-screen flex-col mx-5 md:px-16 pt-44 md:container">
      <SearchInput list={animes} setList={setAnimes} query="" inputPlaceholder="Digite o nome do anime" home={setSearchScreen} searchFunction={handleHomeSearch}/>
      {
        !searchScreen && 
        <div className="">
          <h1 className="text-[26px] font-bold underline mb-7 mt-4 uppercase">Animes Populares</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {
              trendingAnimes &&
              trendingAnimes.map((anime, index) => {
                return (
                  <AnimeCard anime={anime} key={index}/>
                )
              })
            }
          </div>
        </div>
      }
      <h1 className={`text-[26px] font-bold underline mb-7 ${searchScreen ? '-mt-1' : 'mt-16'} uppercase`}>Animes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {
          animes.length > 0 &&
          animes.map((anime, index) => {
            return (
              <AnimeCard anime={anime} key={index}/>
            )
          })
        }
      </div>
      <div className="my-5 w-max self-end">
        <PaginationComponent setChanged={setURLChange} changed={urlChange} maxPage={maxPage}/>
      </div>
    </main>
  );
}
