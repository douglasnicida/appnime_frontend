'use client'

import AnimeCard from "@/app/(components)/AnimeCard";
import { api } from "@/app/api";
import { useAuthContext } from "@/app/contexts/auth";
import { AnimeUser } from "@/app/types/anime";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
  
export default function UserAnimeList() {
    const { id } = useParams();
    const router = useRouter();

    const { token, getUserProfile } = useAuthContext();

    const [userAnime, setUserAnime] = useState([]);

    async function verifyUser() {
        const data = await getUserProfile();

       if (!data || data?.id != Number(id)) {
            router.push('/');
        }
    }

    async function getUserAnime() {
        try{
            const { data } = await api.get(`/user-animes/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            setUserAnime(data.payload)
        } catch(e) {
            console.log(e)
        }
    }
    
    useEffect(() => {
        getUserAnime()
    }, [])

    useEffect(() => {
        verifyUser()
    }, [token])

    return (
        <main className="flex flex-col container w-screen h-screen pb-20 pt-32">
            
            <div className="flex flex-col">
                <h1 className="text-[30px] font-bold underline">My list</h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-5">
                    {
                        userAnime.length > 0 ?
                        userAnime.map((anime : AnimeUser, index) => {
                            return (
                                <AnimeCard anime={anime.anime} user_rating={anime.user_anime_rating} animesUser={userAnime} setAnimesUser={setUserAnime} key={index} />
                            )
                        })
                        :
                        <div className="text-2xl">No anime in your list</div>
                    }
                </div>
            </div>
            
        </main>
    )
}