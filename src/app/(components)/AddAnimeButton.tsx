import { Button } from "@/components/ui/button";
import { Anime, AnimeUser } from "../types/anime";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangeEvent, KeyboardEvent, KeyboardEventHandler, useState } from "react";
import { api } from "../api";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuthContext } from "../contexts/auth";

interface AddAnimeButtonProps {
  anime: Anime;
}

export default function AddAnimeButton({ anime } : AddAnimeButtonProps ) {
  let userRating = -1;
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const { token } = useAuthContext();

  const handleAddAnimeUser = async () => {
      if (userRating === -1) {
        toast({
          variant: "destructive",
          title: "O campo da nota do anime é obrigatório!",
          description: "Nota inválida",
          action: <ToastAction altText="Tente novamente">Tente Novamente</ToastAction>,
        })
          return;
      }

      if(userRating  < 0 || userRating > 10) {
        toast({
          variant: "destructive",
          title: "O campo da nota do anime deve ter valores entre 0 e 10.0!",
          description: "Nota inválida",
          action: <ToastAction altText="Tente novamente">Tente Novamente</ToastAction>,
        })
          return;
      }
      const success = await api.post('/user-animes/', {
        animeID: anime.id,
        user_anime_rating: userRating,
      }, {
        headers:  {
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (success) {
          setDialogOpen(false);
          toast({
            variant: "default",
            title: `Adicionado!`,
            description: `${anime.en_title} adicionado a lista com sucesso`,
            action: <ToastAction altText="Tente novamente">Fechar</ToastAction>,
          })
      }
  }

  const handleSetRating = (e : ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value : number = e.target.value != '' ? Number(e.target.value) : -1;
    userRating = value;
  }

  const DialogAddAnimeUser = () => {
      return (
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                  <Button className="w-fit mt-2 self-end" onClick={() => setDialogOpen(true)}>+ Adicionar</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md md:max-w-lg">
                  <DialogHeader>
                      <DialogTitle>Adicione o anime na sua lista</DialogTitle>
                      <DialogDescription>
                          Selecione a nota do anime na sua opinião.
                      </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                          <Label htmlFor="user-rating" className="sr-only">
                              Nota do anime
                          </Label>
                          <Input placeholder="Insira a nota do anime aqui (Valores de 0 a 10.0, ex: 8.5, 9)" id="user-rating" 
                          onChange={(e) => {handleSetRating(e)}} type="number" required/>
                      </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                      <Button type="submit" size="lg" className="flex w-full px-3 self-end" onClick={handleAddAnimeUser}>
                          Adicionar
                      </Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
      );
  }

  return (
      <DialogAddAnimeUser  />
  );
}