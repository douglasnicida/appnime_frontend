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
    Login: (data: TLogin, setIsDialogOpen: any) => void;
    Logoff: () => void;
    getUserProfile: () => any;
    SignUp: ({name, email, password}: any, setIsDialogOpen: any) => void;
    token: string | null;
}