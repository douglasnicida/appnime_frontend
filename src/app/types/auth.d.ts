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
    setToken: SetStateAction;
    Login: (data: TLogin) => void;
    Logoff: () => void;
}