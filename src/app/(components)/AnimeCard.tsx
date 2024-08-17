import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Anime } from "../types/anime";
import { Button } from "@/components/ui/button";

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard = ({ anime } : AnimeCardProps) => {
  const description = anime.description.substring(0, 150) + (anime.description.length > 150 ? '...' : '');
  const date_started_airing = `${normalizeDates(anime.start_airing.getDay())}/${normalizeDates(anime.start_airing.getMonth())}/${normalizeDates(anime.start_airing.getFullYear())}`
  const avg_rating_color = (anime.avg_rating > 8) ? 'text-green-400' : (anime.avg_rating > 5) ? 'text-yellow-400' : 'text-red-400';

  function normalizeDates(n: number) {
    return n < 10 ? `0${n}` : n;
  }

  return (
    <Card className="border-white/20">
      <CardHeader>
        <Image
          src={anime.image}
          alt={`Image of ${anime.en_title}`}
          width={450}
          height={150}
          className="rounded-md mb-3"
        />
        <CardTitle>{anime.jp_title}</CardTitle>
        <CardDescription>{anime.en_title}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col text-[13px] gap-3">
        <p className="text-justify">{description}</p>
        <p><b>Estúdio:</b> {anime.studio_name}</p>
        <p><b>Lançado em:</b> {date_started_airing}</p>
        <div className="flex w-full justify-between mt-4">
          <p><b className={`${avg_rating_color}`}>{anime.avg_rating}</b>/10</p>
          <p><b>eps:</b> {anime.ep_count}</p>
        </div>
        <Button className="w-fit mt-2 self-end">Adicionar +</Button>
      </CardContent>
    </Card>
  );
};

export default AnimeCard;
