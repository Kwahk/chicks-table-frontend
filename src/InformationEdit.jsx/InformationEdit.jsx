import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import DiseaseSelectModal from "../diseaseselectmodal/DiseaseSelectModal";
import "./InformationEdit.css";
import pencilIcon from "../assets/pencil-icon.png";
import plusIcon from "../assets/icons8-plus-128.png";
import xImage from "../assets/x.png";
import placeholder from "@/assets/images/person.svg";
import { useUpdateUser, useUser } from "@/hooks/user";

// 사용자 정보를 불러온 뒤에 수정 폼을 그린다
const InformationEdit = () => {
  const { data: user, isLoading, isError } = useUser();

  if (isLoading)
    return <p className="info-edit-container-custom">불러오는 중...</p>;
  if (isError || !user)
    return (
      <p className="info-edit-container-custom">
        사용자 정보를 불러오지 못했습니다.
      </p>
    );

  return <InformationEditForm user={user} />;
};

// 불러온 사용자 정보를 폼의 초기값으로 사용한다 (useEffect로 state를 맞출 필요가 없음)
const InformationEditForm = ({ user }) => {
  const navigate = useNavigate();
  const { mutate: saveUser, isPending } = useUpdateUser();
  const [nickname, setNickname] = useState(user.nickname);
  const [diseases, setDiseases] = useState(user.diseases || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(user.profilePath || "");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // 숨겨진 파일 선택 input

  const addDisease = (newDisease) => {
    setDiseases([...diseases, newDisease]);
  };

  const removeDisease = (index) => {
    const newDiseases = diseases.filter((_, i) => i !== index);
    setDiseases(newDiseases);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFile(file);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  // 저장에 성공하면 캐시가 갱신되므로 마이페이지에 새 정보가 바로 보인다
  const handleSave = () => {
    saveUser(
      { nickname, diseases, file },
      {
        onSuccess: () => navigate("/mypage"),
        onError: (error) => console.error("저장하는 데 실패했습니다.", error),
      },
    );
  };

  return (
    <div className="info-edit-container-custom">
      <h2 className="h2-custom">정보 수정</h2>
      <div className="profile-section-custom">
        <div className="image-container-custom">
          <div className="profile-picture">
            <img
              src={selectedImage || placeholder}
              alt="프로필"
              className="profile-image-custom"
            />
          </div>
          <button className="edit-profile-custom" onClick={openFileSelector}>
            <img
              src={pencilIcon}
              alt="Edit Profile"
              style={{ width: "20px", height: "20px" }}
            />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="input-section-custom">
          <div className="input-row-custom">
            <label>Id</label>
            <input type="text" value={user.id} disabled />{" "}
            {/* ID 입력 필드 복원 */}
          </div>
          <div className="input-row-custom">
            <label>Email</label>
            <input type="email" value={user.email} disabled />{" "}
            {/* Email 입력 필드 복원 */}
          </div>
          <div className="input-row-custom">
            <label>Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="disease-title-custom">
        <h3>질병 목록</h3>
      </div>

      <div className="disease-section-custom">
        <div className="disease-list-custom">
          {diseases.map((disease, index) => (
            <div className="disease-item-custom" key={index}>
              <span style={{ fontWeight: "bold" }}>{disease.name}</span>
              <span>{disease.contents}</span>{" "}
              {/* 이 부분을 추가하여 질병 상세 정보 표시 */}
              <button onClick={() => removeDisease(index)}>
                <img
                  src={xImage}
                  alt="x 아이콘"
                  style={{ width: "10px", height: "10px" }}
                />
              </button>
            </div>
          ))}
          <div className="add-disease-container-custom">
            <button
              className="add-disease-custom"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={plusIcon}
                alt="Plus Icon"
                style={{ width: "50px", height: "50px", marginLeft: "75px" }}
              />
            </button>
          </div>
        </div>
      </div>

      <button
        className="save-button-custom"
        onClick={handleSave}
        disabled={isPending}
      >
        {isPending ? "저장 중..." : "저장"}
      </button>

      {isModalOpen && (
        <DiseaseSelectModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={addDisease}
        />
      )}
    </div>
  );
};

InformationEditForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    nickname: PropTypes.string,
    profilePath: PropTypes.string,
    diseases: PropTypes.array,
  }).isRequired,
};

export default InformationEdit;
