import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const saveRecipe = (title, contents) => {
    const token = localStorage.getItem("access_token");
    return axios.post(`${BASE_URL}/scrap`, {
        title, contents
    },
    {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        }
    })
}

export const getSavedRecipeDetails = (id) => {
    const token = localStorage.getItem("access_token");
    return axios.get(`${BASE_URL}/scrap/${id}`,
    {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        }
    }).then(res => {
        if(res.status >= 200 && res.status < 300){
            return res.data
        }
    })
}