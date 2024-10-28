"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sedgwick_Ave_Display } from "next/font/google";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "../contexts/auth";
import { useEffect, useState } from "react";
import { TLogin } from "../types/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const sedgwick = Sedgwick_Ave_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sedgwick",
  weight: "400",
});

function ProfileForm({Login, setIsDialogOpen}: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');


  function handleLogin(e : any) {
    e.preventDefault();

    let data = {email,password} as TLogin;
    
    Login(data, setIsDialogOpen);
  }

  return (
    <form
      className={cn("grid items-start gap-4 sm:max-w-[425px]")}
      onSubmit={handleLogin}
    >
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="exemplo@dominio.com" onChange={(event) => { setEmail(event.target.value) }}/>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" placeholder="********" onChange={(event) => { setPassword(event.target.value) }} />
      </div>
      <Button type="submit">Entrar</Button>
    </form>
  );
}

const Header = () => {
  let { Login, Logoff, getUserProfile, token } = useAuthContext();

  const [isLogged, setIsLogged] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  async function checkToken() {
    const data = await getUserProfile()

    if(data) {
      setUserID(data.id)
      setIsLogged(true)
    } else {
      setIsLogged(false);
    }
  }

  useEffect(() => {
    checkToken()
  }, [token])
  
  return (
    <div className="w-full h-28 flex justify-between items-center py-4 px-16 md:px-48 lg:px-72 fixed bg-[#121212] z-50">
      <Link
        href={'/'}
        className={`${sedgwick.className} flex text-5xl cursor-pointer transition-all duration-200 ease-in-out group`}
      >
        <h1 className="group-hover:-translate-y-2 transition-all duration-500 ease-in-out">
          App
        </h1>
        <h1 className="group-hover:text-red-500 group-hover:translate-y-2 transition-all duration-500 ease-in-out">
          Nime
        </h1>
      </Link>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <HamburgerMenuIcon width={35} height={35} cursor={"pointer"} />
          </DropdownMenuTrigger>

          {isLogged ? (
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer" onClick={() => {router.push(`/${userID}/list`)}}>Minha Lista</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Perfil</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={Logoff}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          ) : (
            <DropdownMenuContent>
              <DialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer" onClick={() => {setIsDialogOpen(true)}}>
                  <h3>Entrar</h3>
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem className="cursor-pointer">Cadastrar</DropdownMenuItem>
            </DropdownMenuContent>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
              <DialogDescription>
                Insira suas credenciais para acessar sua conta.
              </DialogDescription>
            </DialogHeader>
            <ProfileForm Login={Login} setIsDialogOpen={setIsDialogOpen}/>
          </DialogContent>
        </DropdownMenu>
      </Dialog>
    </div>
  );
};

export default Header;
