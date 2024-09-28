"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";
import { AuthUser, TAuthContext, TLogin } from "../types/auth";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export const AuthContext = createContext<TAuthContext | undefined>(undefined);
// wrapper for organization
export function AuthProvider({ children }: { children: React.ReactNode }) {
  
  const [token, setToken] = useState( (localStorage.getItem('token')) ? localStorage.getItem('token') : null );
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function ReturnUserByToken() {
      let res : any;
  
      if(!token) return;
  
      try {
        const { data } = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
  
        res = {"id": data.sub, "email": data.email, "token": token}
      } catch(e) {
        res = null;
        localStorage.removeItem('token')
        setUser(null)
        setToken('')
      }
  
      setUser(res);
    }

    ReturnUserByToken();
  }, [])

  async function Login(data: TLogin) {
    try {
      await api.post("/auth/login", data).then((res) => {
        setToken(res.data.access_token);
        localStorage.setItem('token', res.data.access_token);
        toast({
          description: "Conta acessada com sucesso.",
        });
      });
     
    } catch (e) {
        toast({
            variant: "destructive",
            title: "Erro ao tentar acessar conta.",
            description: "Credenciais inválidas.",
            action: <ToastAction altText="Tente novamente">Tente Novamente</ToastAction>,
          })
          console.log(e)
    }
  }

  function Logoff() {
    setToken('');
    setUser(null);

    localStorage.removeItem('token');

    toast({
        description: "Saiu da conta com sucesso.",
      });
  }

  return (
    <AuthContext.Provider value={{ Login, Logoff, user }}>
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
