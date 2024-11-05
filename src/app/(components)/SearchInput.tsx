import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Anime, AnimeUser } from "../types/anime";
import { api } from "../api";

interface SearchBarProps {
    list: any
    setList: any
    query: string
    inputPlaceholder: string
    searchFunction: any
    home?: any
}

const SearchInput = ({ list, setList, query, inputPlaceholder, searchFunction, home }: SearchBarProps) => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      setPage(Number(params.get('page')));
    })
    
  
    async function handleSearch(e: FormEvent) {
        e.preventDefault();
        const searchValue = searchInputRef.current?.value.toLowerCase();
        
        if (searchValue !== '') {
          if(home) {
            home(true)
            const list_aux : Anime[] = await searchFunction(searchValue)
            setList(list_aux)
          } else {
            const newUserAnime: AnimeUser[] = list.filter(
              (elem: AnimeUser) => 
              (
                elem.anime.en_title?.toLowerCase().includes(searchValue ? searchValue : '') || 
                elem.anime.jp_title?.toLowerCase().includes(searchValue ? searchValue : '')
              )
            )
            setList(newUserAnime)
          }

        } else {
          if(home) {
            home(false)
            let animesResponse = await api.get(`/animes?page=${page}&limit=${28}&offset=${10}`)
            setList(animesResponse.data.payload.data)
          } else {
            let data = await searchFunction(query);
            setList(data)
          }
        }
    }
  
    return (
      <form className="flex my-5" onSubmit={handleSearch}>
        <Input type="search" placeholder={inputPlaceholder} ref={searchInputRef}/>
        <Button className="gap-2" type="submit">
          <MagnifyingGlassIcon width={20} height={20} />
          Buscar
        </Button>
      </form>
    );
  };
  
  export default SearchInput;
  