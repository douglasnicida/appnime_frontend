'use client'

import { useAuthContext } from "@/app/contexts/auth";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
  
export default function UserAnimeList() {
    const {id} = useParams();

    const [userID, setUserID] = useState(-1);
    const { token, ReturnUserByToken, isAuthenticated } = useAuthContext();

    async function verifyUser() {
        const res = await ReturnUserByToken()
        setUserID(res.data)

        if (!isAuthenticated() || userID != Number(id)) {
            
        }
    }

    useEffect(() => {

        verifyUser()
        
    }, [token])

    return (
        <main className="flex flex-col items-center w-screen h-screen p-20">
            
            {
                isAuthenticated() &&
                <div className="">
                    List Page <br/>
                    UserID: {id}
                    <ul>
                        <li>
                            
                        </li>
                    </ul>
                </div>
            }
        </main>
    )
}