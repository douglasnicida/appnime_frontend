'use client'

import { useAuthContext } from "@/app/contexts/auth";
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react";
  
export default function UserAnimeList() {
    const { id } = useParams();

    const router = useRouter()

    const { user } = useAuthContext();

    async function verifyUser() {
       if (!user || user?.id != Number(id)) {
            router.push('/');
        }
    }

    useEffect(() => {
        verifyUser()
    }, [user])

    return (
        <main className="flex flex-col items-center w-screen h-screen p-20">
            
            <div className="">
                List Page <br/>
                UserID: {id}
                <ul>
                    <li>
                        
                    </li>
                </ul>
            </div>
            
        </main>
    )
}