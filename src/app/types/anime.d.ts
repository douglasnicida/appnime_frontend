export type AnimeUser = {
    userID: number;
    animeID: number;
    user_anime_rating: number;
}

export type Anime = {
    id: number;
    jp_title: string;
    en_title?: string;
    description: string;
    start_airing: string;
    finished_airing: string | null;
    avg_rating: string;
    image: string;
    ep_count: number;
    type: string;
    studio_name?: string;
    recently_added: boolean;
}