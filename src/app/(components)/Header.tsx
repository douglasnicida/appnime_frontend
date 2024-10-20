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

function ProfileForm({Login}: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');


  function handleLogin(e : any) {
    e.preventDefault();

    let data = {email,password} as TLogin;
    
    Login(data);
  }

  return (
    <form
      className={cn("grid items-start gap-4 sm:max-w-[425px]")}
      onSubmit={handleLogin}
    >
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="example@domain.com" onChange={(event) => { setEmail(event.target.value) }}/>
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

  const router = useRouter();

  async function dropDownMenuUpdates() {
    const data = await getUserProfile()

    if(data) {
      setUserID(data.id)
      setIsLogged(true)
    }

  }

  async function checkToken() {
    await dropDownMenuUpdates()
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
      <Dialog>
      <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <HamburgerMenuIcon width={35} height={35} cursor={"pointer"} />
          </DropdownMenuTrigger>

          {isLogged ? (
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer" onClick={() => {console.log(userID); router.push(`/${userID}/list`);}}>My List</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={Logoff}>Exit</DropdownMenuItem>
            </DropdownMenuContent>
          ) : (
            <DropdownMenuContent>
              <DialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer">
                  <h3>SignIn</h3>
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem className="cursor-pointer">SignUp</DropdownMenuItem>
            </DropdownMenuContent>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
              <DialogDescription>
                Insert yopur credentials to access your account.
              </DialogDescription>
            </DialogHeader>
            <ProfileForm Login={Login}/>
          </DialogContent>
        </DropdownMenu>
      </Dialog>
    </div>
  );
};

export default Header;
