import PropTypes from 'prop-types';
import Chat from './Chat';
import LoadingChat from './LoadingChat';
import { useEffect } from 'react';

export default function ChatList({ chatList, onProgress }){
    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          });
    }
    useEffect(() => {
        scrollToBottom();
    }, [chatList])

    return(
        <div className='chat-list'>
            {chatList.map((chat, idx) => {
                // 'prompt' 내용은 보여주지 않습니다.
                if (chat.role == 'prompt') return;
                return <Chat key={idx} role={chat.role} content={chat.parts[0].text} />
                })}
            {onProgress? <LoadingChat /> : <></>}
        </div>
    )
}
ChatList.propTypes = {
    chatList: PropTypes.array,
    onProgress: PropTypes.bool
};