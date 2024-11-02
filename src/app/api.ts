import axios from "axios";

export const api = axios.create({
    baseURL: 'https://appnime-backend.onrender.com'
});