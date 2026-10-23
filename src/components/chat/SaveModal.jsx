import { useContext, useEffect, useState } from "react";
import { SaveContext } from "@/common/saveContext";

import "./SaveModal.css"
import cancel from "@/assets/images/cancel.svg";
import { saveRecipe } from "../../utils/save";

export default function SaveModal() {
    const { setShowSaveModal, saveModalContent, setSaveModalContent } = useContext(SaveContext);
    const [titleInput, setTitleInput] = useState('');
    const [contentInput, setContentInput] = useState(saveModalContent);
    const handleSubmit = (e) => {
        e.preventDefault();
        saveRecipe(titleInput.slice(0, 30), contentInput).then(res => {
            if(res.status >= 200 && res.status < 300){
                alert("저장 성공!");
                setShowSaveModal(false);
            } else {
                alert("저장에 실패했습니다.")
            }
        }).catch(err => {
            console.error(err);
            alert("저장에 실패했습니다.")
        }).finally(() => {
            setSaveModalContent('');
        })
    }

    useEffect(() => {
    }, []);
    return (
        <div className="chat-save-modal-back">
            <div className="chat-save-modal">
                <div className="close btn-container"><button onClick={() => setShowSaveModal(false)}><img src={cancel} alt="취소 버튼" /></button></div>
                <h2 className="chat-save-title">내 레시피로 저장하기</h2>
                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="title">
                        <label className="title-name">제목:</label>
                        <input className="title-input" type="text" value={titleInput} onChange={(e) => {setTitleInput(e.target.value)}}></input>
                    </div>
                    <div className="save-modal-content"><textarea value={contentInput} onChange={(e) => {setContentInput(e.target.value)}}></textarea></div>
                    <div className="save-btn-container"><button type="submit" className="save-btn">저장</button></div>
                </form>
            </div>
        </div>
    )
}