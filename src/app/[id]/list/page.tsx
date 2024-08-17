'use client'

import { useParams } from "next/navigation"
  
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