import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"});
export var chat;

export const startChat = (history) => {
    if (history) {
        chat = model.startChat({ history });
    } else {
        chat = model.startChat();
    }
}

export const getModelResponse = (sendMsg) => new Promise((resolve, reject) => {
    resolve(chat.sendMessage(sendMsg).then(res => {
        if(res.response && res.response.text) return res.response.text();
        else(reject('Wrong response.'))
    }).catch(err => reject(console.error(err))));
})