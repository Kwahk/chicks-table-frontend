import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getUserNickname = () => {
    const id = localStorage.getItem("username");
    const token = localStorage.getItem("access_token");
    return axios.get(`${BASE_URL}/user/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
        if(res.status >= 200 && res.status < 300){
            return res.data.nickname;
        }
    })
}

export const getUserDisease = () => {
    const id = localStorage.getItem("username");
    const token = localStorage.getItem("access_token");
    return axios.get(`${BASE_URL}/user/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
        if(res.status >= 200 && res.status < 300){
            const diseaseList = res.data.diseases;
            if(Array.isArray(diseaseList)){
                const strDisease = diseaseList.map(disease => `${disease.name}${disease.contents == '모름' ? '' : '('+disease.contents+')'}`);
                return strDisease.join(', ')
            } else return "";
        }
    })
}

export const getUserSavedList = () => {
    const token = localStorage.getItem("access_token");
    return axios.get(`${BASE_URL}/scrap`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
        if(res.status >= 200 && res.status < 300){
            return res.data.scraps;
        }
    })
}