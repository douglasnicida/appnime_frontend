"use client";

import { createContext, useContext, useState } from "react";
import { api } from "../api";
import { TAuthContext, TLogin } from "../types/auth";
import { toast } from "@/components/ui/use-toast";
import { Toast, ToastAction } from "@/components/ui/toast";

export const AuthContext = createContext<TAuthContext | undefined>(undefined);
// wrapper for organization
export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [token, setToken] = useState("");

  function Login(data: TLogin) {
    try {
      api.post("/auth/login", data).then((res) => {
        setToken(res.data.access_token);
        localStorage.setItem('token', token);
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
    setToken(""); 
    localStorage.removeItem('token');
    toast({
        description: "Saiu da conta com sucesso.",
      });
  }

  return (
    <AuthContext.Provider value={{ token, setToken, Login, Logoff }}>
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
