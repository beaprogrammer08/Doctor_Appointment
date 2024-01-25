import axios from "axios";
const BASE_URL = "http://localhost:8080";
export const developAxios = (token) =>
    axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
        },
    });
