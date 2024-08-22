import { SetStateAction } from "react";

export type AuthUser = {
    email: string;
    token: string;
}

export type TLogin = {
    email: string;
    password: string;
}

export type TAuthContext = {
    token: string | undefined;
    Login: (data: TLogin) => void;
    Logoff: () => void;
    ReturnUserByToken: () => any | null;
    isAuthenticated: () => boolean;
}