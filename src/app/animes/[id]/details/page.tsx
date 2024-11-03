'use client'
import { normalizeDates } from "@/app/(components)/AnimeCard";
import { api } from "@/app/api";
import { Anime } from "@/app/types/anime";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnimeDetails() {
    const [anime, setAnime] = useState<Anime | null>();
    const { id } = useParams();

    async function getAnime() {
        const { data } = await api.get(`/animes/${id}`)

        return data.payload;
    }
    
    useEffect(() => {
        try{
            getAnime().then((result) => {setAnime(result)})
        } catch(e) {}
    }, [])

    let date_started_airing = "", date_finished_airing = "";
    let avg_rating_color = "";
    let avg_rating = -1, start_airing = [], finished_airing = [];

    if(anime) {
        avg_rating = Number(anime.avg_rating);
        start_airing = anime.start_airing.split('-');
        start_airing.map((elem) => {
            normalizeDates(Number(elem))
        })
    
        date_started_airing = `${start_airing[2]}/${start_airing[1]}/${start_airing[0]}`

        if(anime.finished_airing){
            finished_airing = anime.finished_airing.split('-');
            finished_airing.map((elem) => {
                normalizeDates(Number(elem))
            })
        
            date_finished_airing = `${finished_airing[2]}/${finished_airing[1]}/${finished_airing[0]}`
        }
        avg_rating_color = (avg_rating > 8) ? 'text-green-400' : (avg_rating > 5) ? 'text-yellow-400' : 'text-red-400';
    }


    return (
        <main className="flex min-h-screen flex-col px-16 pt-32 container">
            <Link href={'/?search=&page=1&limit=28'}>
                <ArrowLeftIcon height={30} width={30} className="mb-4"/>
            </Link>
            {
                anime &&
                <div className="relative w-full h-[calc(100vh-190px)] flex flex-col md:flex-row">
                    <div className="relative min-h-[350px] md:min-w-[250px] md:min-h-auto lg:min-w-[400px] mb-8 md:mr-8">
                        <Image src={anime ? anime?.image : ""} alt={""} fill className="rounded-tl-md rounded-bl-md"/>
                    </div>
                    <div className="relative flex flex-col gap-2 h-auto">
                        <h1 className="font-bold text-[23px]">{anime.jp_title} <span>({anime.en_title})</span></h1>
                        <p className="text-gray-400 text-justify text-ellipsis overflow-y-scroll scroll-ml-3 h-full">{anime.description}</p>
                        <div className="flex flex-col md:flex-row md:gap-x-14">
                            <div className="">
                                <p><b>Started airing:</b> {date_started_airing}</p>
                                <p><b>Finished airing:</b> {date_finished_airing ? date_finished_airing : "--"}</p>
                            </div>
                            <div className="">
                                <p className="mt-3 md:mt-0"><b>Number of episodes:</b> {anime.ep_count}</p>
                                <p className="mt-3 md:mt-0"><b>Type:</b> {anime.type}</p>
                            </div>
                        </div>

                        <div className="relative flex items-center justify-between mb-20 h-auto">
                            <p><b className={`${avg_rating_color}`}>{avg_rating.toFixed(1)}</b>/10</p>
                            <Button className="w-fit mt-2 self-end">+ Adicionar</Button>
                        </div>
                    </div>
                </div>
            }
        </main>
    )
}
