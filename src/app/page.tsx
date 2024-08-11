"use client"

import Image from "next/image";
import { useEffect } from "react";
import { useAuthContext } from "./contexts/auth";

export default function Home() {
  const { setToken } = useAuthContext();

  useEffect(() => {
    let token = localStorage.getItem('token');

    if(token){
      setToken(token);
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col px-24 pt-44 container">
      Home
    </main>
  );
}
