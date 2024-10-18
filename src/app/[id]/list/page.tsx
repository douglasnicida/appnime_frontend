'use client'

import { useAuthContext } from "@/app/contexts/auth";
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react";
  
export default function UserAnimeList() {
    const { id } = useParams();

    const router = useRouter()

    const { token, getUserProfile } = useAuthContext();

    async function verifyUser() {
        const data = await getUserProfile();

       if (!data || data?.id != Number(id)) {
            router.push('/');
        }
    }

    useEffect(() => {
        verifyUser()
    }, [token])

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