import { useEffect, useState } from "react"
import "./chats.css"
export default function LoadingChat(){
    const [mention, setMention] = useState('불러오는 중..')
    useEffect(() => {
        setTimeout(() => {
            if( mention.length == 10) setMention('불러오는 중..');
            else if (mention.length == 8) setMention('불러오는 중...')
            else setMention('불러오는 중....')
        }, 1000)
    });
    return(
        <div className="chat-container model">
            <div className="bubble model loading">
                <div className="spinner"></div>
                <p>{mention}</p>
            </div>
        </div>
    )
}