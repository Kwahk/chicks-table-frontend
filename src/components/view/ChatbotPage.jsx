import { useContext, useEffect, useState } from "react"
import { SaveContext } from "@/common/saveContext";
import ChatList from "@/components/chat/ChatList";
import SaveModal from "@/components/chat/SaveModal";
import { PropTypes } from 'prop-types';
import { getUserDisease } from "@/utils/user";
import { startChat, getModelResponse } from "@/utils/chat";

import arrowBtn from "@/assets/images/arrowButton.svg"
import "./ChatbotPage.css"

function ContextProvider ({ children }) {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveModalContent, setSaveModalContent] = useState('');

    return(
        <SaveContext.Provider value={{showSaveModal, setShowSaveModal, saveModalContent, setSaveModalContent}}>
            {children}
        </SaveContext.Provider>
    )
}
ContextProvider.propTypes = {
    children: PropTypes.element
}

export default function ChatbotPage(){
    return(
        <ContextProvider>
            <ChatbotPageInner />
        </ContextProvider>
    )
}

function ChatbotPageInner(){
    const [chatList, setChatList] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [onProgress, setOnProgress] = useState(false);
    const { showSaveModal } = useContext(SaveContext);
    const addChat = (role, text) => {
        setChatList(prevChatList => [...prevChatList, {role, parts: [{ text }]}]);
    }
    const handleChange = (e) =>{
        setChatInput(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const userInput = chatInput.trim();
        setChatInput('');
        if(userInput) {
            setOnProgress(true);
            addChat("user", userInput);
            getModelResponse(userInput).then(res =>{
                if(res) addChat("model", res);
                setOnProgress(false);
            })
            .catch(err => {
                console.err(err);
                setOnProgress(false);
            });
        }
    }
    useEffect(()=>{
        var userDisease = '';
        var userHealthInfoToShow = '요리 레시피를 추천해줘.';
        const getDisease = confirm('나의 질병 정보를 불러오시겠습니까?');
        if (getDisease) getUserDisease().then(disease => {
            if (disease) {
                userDisease = `The recipe must suitable with my health status. This is my disease list in korean, '${disease}'. `;
                userHealthInfoToShow = `나의 건강상태에 맞는 요리 레시피를 추천해줘. 나는 ${disease}이(가) 있어.`
            }
            const userHealthInfo = `Recommend me the cuisine recipe that I ask you. ${userDisease}All of your response must be in korean.`;
            const initialChatList = [
                { role: 'prompt', parts: [{ text: userHealthInfo }] },
                { role: 'promptToShow', parts: [{ text: userHealthInfoToShow }] }
            ]
            setChatList(initialChatList);
            startChat(initialChatList
                .filter(chat => chat.role != 'promptToShow')
                .map(chat => {
                    if (chat.role == 'prompt') {
                        const newChat = { ...chat, role: 'user' };
                        return newChat;
                    }
                    else return chat;
                }))
        }).catch(err => {
            console.error(err);
            console.log('Access Denied.');
        });
        else {
            const userHealthInfo = `Recommend me the cuisine recipe that I ask you. ${userDisease}All of your response must be in korean.`;
            const initialChatList = [
                { role: 'prompt', parts: [{ text: userHealthInfo }] },
                { role: 'promptToShow', parts: [{ text: userHealthInfoToShow }] }
            ]
            setChatList(initialChatList);
            startChat(initialChatList
                .filter(chat => chat.role != 'promptToShow')
                .map(chat => {
                    if (chat.role == 'prompt') {
                        const newChat = { ...chat, role: 'user' };
                        return newChat;
                    }
                    else return chat;
                }))
        }
    }, []);

    return(
        <div className="chatbot-page">
            <div className="chatbot-container">
                <ChatList chatList={chatList} onProgress={onProgress} />
                <div className="chat-input-area">
                    <form onSubmit={handleSubmit}>
                        <input placeholder="챗봇에게 보낼 메세지를 입력하세요." value={chatInput} onChange={handleChange}></input>
                        <button type="submit"><img src={arrowBtn} alt="제출 버튼 화살표" /></button>
                    </form>
                </div>
                {showSaveModal && <SaveModal />}
            </div>
        </div>
    )
}