'use client'

import AnimeCard from "@/app/(components)/AnimeCard";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import { api } from "@/app/api";
import { useAuthContext } from "@/app/contexts/auth";
import { AnimeUser  } from "@/app/types/anime";
import { MixerVerticalIcon } from "@radix-ui/react-icons";
import { useParams, useRouter } from "next/navigation"
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

enum OrderByTypes {
    ASC = 'ASC',
    DESC = 'DESC',
}

type OrderByOptions = {
    name: boolean;
    rating: boolean;
    type: OrderByTypes;
}

const OrderByDropDown = ({setOrderBy, prevOrderBy} : any) => {
    const [orderBy, setOrderByState] = useState<'name' | 'rating'>('rating');
    const [orderDirection, setOrderDirection] = useState<OrderByTypes>(OrderByTypes.DESC);

    function handleOrderByChange(value: 'name' | 'rating') {
        setOrderByState(value);
        setOrderBy((prevState: OrderByOptions) => ({
            ...prevState,
            name: value === 'name',
            rating: value === 'rating',
        }));
    }

    function handleOrderDirectionChange(value: OrderByTypes) {
        setOrderDirection(value);
        setOrderBy((prevState: OrderByOptions) => ({
            ...prevState,
            type: value,
        }));
    }

    return (
        <div className="flex space-x-4">
    <DropdownMenu>
        <DropdownMenuTrigger>
            <MixerVerticalIcon width={30} height={30}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuCheckboxItem onClick={() => handleOrderByChange('name')} checked={prevOrderBy.name}>Nome</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => handleOrderByChange('rating')} checked={prevOrderBy.rating}>Rating</DropdownMenuCheckboxItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => handleOrderDirectionChange(OrderByTypes.ASC)}>Crescente</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOrderDirectionChange(OrderByTypes.DESC)}>Decrescente</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    
</div>
    );
};

export default function UserAnimeList() {
    const { id } = useParams();
    const router = useRouter();

    const { token, getUserProfile } = useAuthContext();

    const [userAnime, setUserAnime] = useState<AnimeUser[]>([]);
    const [enable, setEnable] = useState(false);
    const [loading, setLoading] = useState(true);

    const [orderBy, setOrderBy] = useState<OrderByOptions>({name: false,  rating: true, type: OrderByTypes.DESC});

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
        const queryName = `${orderBy.name ? `orderByName=${orderBy.type}` : ''}`
        const queryRating = `${orderBy.rating ? `orderByRating=${orderBy.type}` : ''}`
        const query = queryName && queryRating ? `?${queryName}&${queryRating}` : `?${queryName}${queryRating}`
        try {
            const { data } = await api.get(`/user-animes/user${query}`, {
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
    }, [enable, orderBy]);

    useEffect(() => {
        if(token) verifyUser();
    }, [token]);

    // TODO: FAZER ORDENAÇÃO POR NOTA OU NOME
    // TODO: FAZER EDIÇÃO DE NOTA

    return (
        <main className="flex flex-col container w-screen h-screen pb-20 pt-32">
            <div className="flex flex-col">
                <div className="flex justify-between items-center">
                    <h1 className="text-[30px] font-bold underline">My list</h1>
                    <OrderByDropDown setOrderBy={setOrderBy} prevOrderBy={orderBy}/>
                </div>
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