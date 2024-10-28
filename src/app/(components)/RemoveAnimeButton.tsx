import { Button } from "@/components/ui/button";
import { Anime, AnimeUser } from "../types/anime";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangeEvent, KeyboardEvent, KeyboardEventHandler, SetStateAction, useState } from "react";
import { api } from "../api";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuthContext } from "../contexts/auth";
import { useRouter } from "next/navigation";

interface RemoveAnimeButtonProps {
  anime: Anime;
  animesUserList: AnimeUser[];
  setAnimesUserList: SetStateAction<any>;
}

export default function RemoveAnimeButton({ anime, animesUserList, setAnimesUserList } : RemoveAnimeButtonProps) {
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const { token } = useAuthContext();

  const handleRemoveAnimeUser = async () => {
    const success = await api.delete(`/user-animes/${anime.id}`, {
    headers:  {
        Authorization: `Bearer ${token}`,
    }
    });

    if(success) {
        const idx = animesUserList.findIndex((animeUser) => animeUser.anime.id == anime.id)
        animesUserList.splice(idx, 1)
        setAnimesUserList(animesUserList)
        setDialogOpen(false);
        toast({
            variant: "default",
            title: `Removido!`,
            description: `${anime.en_title} removido da lista com sucesso`,
            action: <ToastAction altText="Tente novamente">Fechar</ToastAction>,
          })
    }
  }

  const DialogRemoveAnimeUser = () => {
      return (
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                  <Button className="w-fit mt-2 self-end" onClick={() => setDialogOpen(true)}>Remover</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md md:max-w-lg">
                  <DialogHeader className="py-7">
                      <DialogTitle>Deseja remover {anime.en_title} da sua lista de animes?</DialogTitle>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-start">
                    <form onSubmit={handleRemoveAnimeUser} className="flex w-full gap-5">
                      <Button type="submit" className="w-full" size="lg">
                          Sim
                      </Button>

                      <Button size="lg" className="w-full" onClick={() => {setDialogOpen(false)}}>
                          Não
                      </Button>
                    </form>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
      );
  }

  return (
      <DialogRemoveAnimeUser  />
  );
}