export type AnimeUser = {
    anime: Anime
    user_anime_rating: number;
}

export type Anime = {
    id?: number;
    jp_title: string;
    en_title?: string;
    description?: string;
    start_airing: string;
    finished_airing?: string;
    avg_rating: string;
    image: string;
    ep_count: number;
    type: string;
    studio_name?: string;
    recently_added?: boolean;
}