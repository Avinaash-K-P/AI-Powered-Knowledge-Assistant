import api from "./api";

//Get Profile
export const getProfile = () => {
    return api.get("/profile/view");

};

//Update Profile
export const updateProfile = (profileData) => {
    return api.put("/profile/update", (profileData));
};