import api from "./api"

export const registerUser = (userData) => {
    return api.post("auth/register", userData);
}

export const loginUser = (credential) => {
    return api.post("auth/login", credential);
}