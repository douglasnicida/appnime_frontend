'use client'

import AnimeCard from "@/app/(components)/AnimeCard";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api } from "@/app/api";
import { useAuthContext } from "@/app/contexts/auth";
import { Anime, AnimeUser } from "@/app/types/anime";
import { MixerVerticalIcon } from "@radix-ui/react-icons";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchInput from "@/app/(components)/SearchInput";

enum OrderByTypes {
    ASC = 'ASC',
    DESC = 'DESC',
}

type OrderByOptions = {
    name: boolean;
    rating: boolean;
    type: OrderByTypes;
}

const OrderByDropDown = ({ setOrderBy, prevOrderBy }: any) => {
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
                    <MixerVerticalIcon width={30} height={30} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuCheckboxItem onClick={() => handleOrderByChange('name')} checked={prevOrderBy.name}>Nome</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem onClick={() => handleOrderByChange('rating')} checked={prevOrderBy.rating}>Rating</DropdownMenuCheckboxItem>
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

    const [orderBy, setOrderBy] = useState<OrderByOptions>({ name: false, rating: true, type: OrderByTypes.DESC });
    const [query, setQuery] = useState('?orderByRating=DESC');

    async function verifyUser() {
        const data = await getUserProfile();
        if (!data || data.id !== Number(id)) {
            router.push('/');
        } else {
            setEnable(true);
        }
    }

    async function handleListQuery(query?: string): Promise<any> {
        const endpoint = `/user-animes/user`;
        const { data } = await api.get(`${endpoint}${query}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data?.payload;
    }

    async function getUserAnime() {
        setLoading(true);
        const queryName = `${orderBy.name ? `orderByName=${orderBy.type}` : ''}`;
        const queryRating = `${orderBy.rating ? `orderByRating=${orderBy.type}` : ''}`;
        const queryArray = [queryRating, queryName].filter(Boolean);
        setQuery(queryArray.length ? `?${queryArray.join('&')}` : "");

        try {
            const data = await handleListQuery(query);
            setUserAnime(data);
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
        if (token) verifyUser();
    }, [token]);

    return (
        <main className="flex flex-col container w-screen h-screen pb-20 pt-32">
            <div className="flex flex-col">
                <div className="flex justify-between items-center">
                    <h1 className="text-[30px] font-bold underline">My list</h1>
                    <OrderByDropDown setOrderBy={setOrderBy} prevOrderBy={orderBy} />
                </div>
                <SearchInput list={userAnime} setList={setUserAnime} query={query} inputPlaceholder="Digite o nome do anime que deseja buscar" searchFunction={handleListQuery} />
                {loading ? (
                    <div className="text-2xl">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-5">
                        {userAnime.length > 0 ? (
                            userAnime.map((anime: AnimeUser, index) => (
                                <AnimeCard
                                    anime={anime.anime}
                                    user_rating={anime.user_anime_rating}
                                    animesUser={userAnime}
                                    setAnimesUser={setUserAnime}
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
    );
}
