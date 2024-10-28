'use client'

import AnimeCard from "@/app/(components)/AnimeCard";
import { api } from "@/app/api";
import { useAuthContext } from "@/app/contexts/auth";
import { AnimeUser  } from "@/app/types/anime";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function UserAnimeList() {
    const { id } = useParams();
    const router = useRouter();

    const { token, getUserProfile } = useAuthContext();

    const [userAnime, setUserAnime] = useState<AnimeUser[]>([]);
    const [enable, setEnable] = useState(false);
    const [loading, setLoading] = useState(true);

    async function verifyUser () {
        const data = await getUserProfile();

        if (!data || data.id !== Number(id)) {
            router.push('/');
        } else {
            setEnable(true);
        }
    }

    async function getUserAnime() {
        setLoading(true);
        try {
            const { data } = await api.get(`/user-animes/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setUserAnime(data.payload);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (enable === true) getUserAnime();
    }, [enable]);

    useEffect(() => {
        if(token) verifyUser();
    }, [token]);

    // TODO: FAZER ORDENAÇÃO POR NOTA OU NOME
    // TODO: FAZER EDIÇÃO DE NOTA

    return (
        <main className="flex flex-col container w-screen h-screen pb-20 pt-32">
            <div className="flex flex-col">
                <h1 className="text-[30px] font-bold underline">My list</h1>
                {loading ? (
                    <div className="text-2xl">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-5">
                        {userAnime.length > 0 ? (
                            userAnime.map((anime: AnimeUser , index) => (
                                <AnimeCard 
                                    anime={anime.anime} 
                                    user_rating={anime.user_anime_rating} 
                                    animesUser ={userAnime} 
                                    setAnimesUser ={setUserAnime} 
                                    key={index} 
                                />
                            ))
                        ) : (
                            <div className="text-2xl">No anime in your list</div>
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}