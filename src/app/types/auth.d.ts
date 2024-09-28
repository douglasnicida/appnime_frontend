import { SetStateAction } from "react";

export type AuthUser = {
    id: number;
    email: string;
    token: string;
}

export type TLogin = {
    email: string;
    password: string;
}

export type TAuthContext = {
    Login: (data: TLogin) => void;
    Logoff: () => void;
    user: AuthUser | null;
}