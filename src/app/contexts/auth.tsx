"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";
import { TAuthContext, TLogin } from "../types/auth";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export const AuthContext = createContext<TAuthContext | undefined>(undefined);
// wrapper for organization
export function AuthProvider({ children }: { children: React.ReactNode }) {
  
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if(storedToken){
      setToken(storedToken)
    }
  },[])

  async function Login(data: TLogin, setIsDialogOpen: any) {
    try {
      await api.post("/auth/login", data).then((res) => {
        setToken(res.data.access_token);
        window.localStorage.setItem('token', res.data.access_token);
        toast({
          description: "Conta acessada com sucesso.",
        });
        setIsDialogOpen(false);
      });
     
    } catch (e) {
        toast({
            variant: "destructive",
            title: "Erro ao tentar acessar conta.",
            description: "Credenciais inválidas.",
            action: <ToastAction altText="Tente novamente">Tente Novamente</ToastAction>,
          })
    }
  }

  const router = useRouter();
  function Logoff() {
    setToken('');
    window.localStorage.removeItem('token');
    
    router.push('/');

    toast({
        description: "Saiu da conta com sucesso.",
      });
  }

  async function getUserProfile() {
    try{
      const { data } = await api.get('/auth/profile',{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      return data;
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <AuthContext.Provider value={{ Login, Logoff, getUserProfile ,token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = (): TAuthContext => {
  // Getting the value of the Context
  const context = useContext(AuthContext);
  // Checking if the component is inside the AuthProvider
  if (!context) {
    throw Error("useAuthContext must be inside an AuthContext Provider");
  }
  // Returning the Context Object
  return context;
};
