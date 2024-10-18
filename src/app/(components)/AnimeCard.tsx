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
  let avg_rating = Number(anime.avg_rating);
  let start_airing = anime.start_airing.split('-');

  const description = anime.description ? anime.description.substring(0, 100) + (anime.description.length > 100 ? '...' : '') : "";
  const date_started_airing = `${normalizeDates(Number(start_airing[2]))}/${normalizeDates(Number(start_airing[1]))}/${normalizeDates(Number(start_airing[0]))}`
  const avg_rating_color = (avg_rating > 8) ? 'text-green-400' : (avg_rating > 5) ? 'text-yellow-400' : 'text-red-400';

  function normalizeDates(n: number) {
    return n < 10 ? `0${n}` : n;
  }

  return (
    <Card className="border-white/20 w-[310px]">
      <CardHeader>
        <div className="relative w-auto h-[190px] ">
          <Image
            src={anime.image}
            alt={`Image of ${anime.en_title}`}
            fill
            className="rounded-md mb-3 object-fit"
          />
        </div>

        <div className="relative h-[60px] flex flex-col gap-2">
          <CardTitle>{anime.jp_title}</CardTitle>
          <CardDescription>{anime.en_title}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col text-[13px] gap-3">
        <p className="text-justify">{description}</p>
        <p><b>Lançado em:</b> {date_started_airing}</p>
        <p><b>Número de episódios:</b> {anime.ep_count}</p>
        
        <div className="flex items-center justify-between">
          <p><b className={`${avg_rating_color}`}>{avg_rating.toFixed(1)}</b>/10</p>
          <Button className="w-fit mt-2 self-end">+ Adicionar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnimeCard;
