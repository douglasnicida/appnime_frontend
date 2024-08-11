'use client'

import { useParams } from "next/navigation"
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
export default function UserAnimeList() {
    const {id} = useParams();

    return (
        <main className="flex flex-col items-center w-screen h-screen p-20">
            List Page <br/>
            UserID: {id}

            <ul>
                <li>
                    
                </li>
            </ul>
        </main>
    )
}