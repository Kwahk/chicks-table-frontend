import { useState } from "react";
import xImage from '../assets/x.png';
import PropTypes from 'prop-types';
import "./DiseaseSelectModal.css";

const DiseaseSelectModal = ({ onClose, onSubmit }) => {
  const [selectedDisease, setSelectedDisease] = useState("");
  const [bloodSugar, setBloodSugar] = useState({ first: "", second: "" });
  const [unknown, setUnknown] = useState(false);
  const [comment, setComment] = useState("질병을 선택해 주세요.");
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가

  const updateComment = (disease) => {
    switch (disease) {
      case "당뇨":
        return "공복 혈당 수치를 입력해주세요.";
      case "고혈압":
      case "저혈압":
        return "이완기/수축기를 입력해주세요.";
      case "알레르기":
        return "알레르기를 입력해주세요.";
      default:
        return "질병을 선택해 주세요.";
    }
  };

  const handleSelect = (disease) => {
    setSelectedDisease(disease);
    setErrorMessage(""); 
    setBloodSugar({ first: "", second: "" }); 
    setComment(updateComment(disease)); 
  };

  const handleSubmit = () => {
    if (!unknown) {
      if (["고혈압", "저혈압"].includes(selectedDisease)) {
        if (!bloodSugar.first || !bloodSugar.second) {
          setErrorMessage("이완기와 수축기를 모두 입력해주세요.");
          return;
        }
        if (isNaN(bloodSugar.first) || isNaN(bloodSugar.second)) {
          setErrorMessage("숫자를 입력해주세요.");
          return;
        }
      } else if (selectedDisease === "당뇨") {
        if (isNaN(bloodSugar.first) || bloodSugar.first === "") {
          setErrorMessage("숫자를 입력해주세요.");
          return;
        }
      } else if (selectedDisease === "알레르기") {
        if (!isNaN(bloodSugar.first) || bloodSugar.first === "") {
          setErrorMessage("문자를 입력해 주세요.");
          return;
        }
      } else if (!bloodSugar.first) {
        setErrorMessage("아무것도 선택되지 않았습니다.");
        return;
      }
    }

    const contents = unknown
      ? "모름"
      : ["고혈압", "저혈압"].includes(selectedDisease)
      ? `${bloodSugar.first}/${bloodSugar.second}`
      : bloodSugar.first;

    const diseaseData = {
      name: selectedDisease,
      contents, // details를 contents로 변경
    };
    onSubmit(diseaseData);
    onClose(); 
  };

  const handleInputChange = (value, part) => {
    setBloodSugar((prev) => ({ ...prev, [part]: value }));
    setErrorMessage(""); 
  };

  return (
    <div className="modal-overlay-custom show">
      <div className="modal-content-custom">
        <button className="modal-close-custom" onClick={onClose}>
          <img src={xImage} alt="x 아이콘" style={{ width: '15px', height: '15px' }} />
        </button>
        <h3 className="diseases-name" >질병 선택</h3>

        {selectedDisease && (
          <div className="blood-sugar-input-custom">
            <label className="diseases-title1">{selectedDisease}</label>
            {["고혈압", "저혈압"].includes(selectedDisease) ? (
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input
                  type="number"
                  value={bloodSugar.first}
                  onChange={(e) => handleInputChange(e.target.value, "first")}
                  placeholder="이완기"
                  className="blood-sugar-input-custom-input" /* 적용할 클래스 */
                />
                <span>/</span>
                <input
                  type="number"
                  value={bloodSugar.second}
                  onChange={(e) => handleInputChange(e.target.value, "second")}
                  placeholder="수축기"
                  className="blood-sugar-input-custom-input" /* 적용할 클래스 */
                />
              </div>
            ) : (
              <input
                type={selectedDisease === "알레르기" ? "text" : "number"}
                value={bloodSugar.first}
                onChange={(e) => handleInputChange(e.target.value, "first")}
                placeholder={selectedDisease === "알레르기" ? "알레르기 종류" : "수치 입력"}
                className="blood-sugar-input-custom-input" /* 적용할 클래스 */
              />
            )}
            <label className="label-checkbox">모름</label>
            <input
              type="checkbox"
              checked={unknown}
              onChange={(e) => setUnknown(e.target.checked)}
            />
          </div>
        )}

        {errorMessage && (
          <p className="error-message-custom">
            {errorMessage}
          </p>
        )}

        <p className="comment">{comment}</p>

        <div className="disease-options-custom">
          <button
            className={`disease-button-custom ${selectedDisease === "당뇨" ? "selected-custom" : ""}`}
            onClick={() => handleSelect("당뇨")}
          >
            당뇨
          </button>
          <button
            className={`disease-button-custom ${selectedDisease === "고혈압" ? "selected-custom" : ""}`}
            onClick={() => handleSelect("고혈압")}
          >
            고혈압
          </button>
          <button
            className={`disease-button-custom ${selectedDisease === "알레르기" ? "selected-custom" : ""}`}
            onClick={() => handleSelect("알레르기")}
          >
            알레르기
          </button>
          <button
            className={`disease-button-custom ${selectedDisease === "저혈압" ? "selected-custom" : ""}`}
            onClick={() => handleSelect("저혈압")}
          >
            저혈압
          </button>
        </div>
        
        <div className="confirm-button-container" onClick={handleSubmit}>
          <button className="confirm-button-custom">저장</button>
        </div>
      </div>
    </div>
  );
};
DiseaseSelectModal.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

export default DiseaseSelectModal;
