import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import DiseaseSelectModal from "../diseaseselectmodal/DiseaseSelectModal";
import "./InformationEdit.css";
import pencilIcon from '../assets/pencil-icon.png';
import plusIcon from '../assets/icons8-plus-128.png';
import xImage from '../assets/x.png';
import placeholder from '@/assets/images/person.svg';

const InformationEdit = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [id, setId] = useState("");  // ID 상태 추가
  const [email, setEmail] = useState("");  // Email 상태 추가
  const [nickname, setNickname] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('username');  // username으로 변경
    const token = localStorage.getItem('access_token');  // token 대신 access_token으로 변경

    if (location.state) {
      const { id, email, nickname, diseases, image } = location.state;
      setId(id);
      setEmail(email);
      setNickname(nickname);
      setDiseases(diseases || []);
      setSelectedImage(image || placeholder);
    } else if (userId && token) {
      const fetchUserInfo = async () => {
        const BASE_URL = import.meta.env.VITE_API_URL;
        try {
          const response = await axios.get(`${BASE_URL}/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const user = response.data;
          setId(user.id);  // ID 상태 업데이트
          setEmail(user.email);  // Email 상태 업데이트
          setNickname(user.nickname);
          setDiseases(user.diseases || []);
          setSelectedImage(user.profilePath || "");
        } catch (error) {
          console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
        }
      };
      fetchUserInfo();
    }
  }, [location]);

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
    document.getElementById('profileImageInput').click();
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token'); // 토큰 이름 수정
      const userId = localStorage.getItem('username'); // userId 대신 username 사용
      const BASE_URL = import.meta.env.VITE_API_URL;

      const data = {
        nickname, 
        diseases 
      };

      const jsonData = JSON.stringify(data);
      const blobData = new Blob([jsonData], { type: 'application/json' });

      const formData = new FormData();
      formData.append('data', blobData); 
      if (file) {
        formData.append('file', file); 
      }

      await axios.patch(`${BASE_URL}/user/${userId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      navigate("/mypage", { state: { nickname, diseases, image: selectedImage } });

    } catch (error) {
      console.error('저장하는 데 실패했습니다.', error);
    }
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
            <img src={pencilIcon} alt="Edit Profile" style={{ width: '20px', height: '20px' }} />
          </button>
          <input
            type="file"
            id="profileImageInput"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="input-section-custom">
          <div className="input-row-custom">
            <label>Id</label>
            <input type="text" value={id} disabled />  {/* ID 입력 필드 복원 */}
          </div>
          <div className="input-row-custom">
            <label>Email</label>
            <input type="email" value={email} disabled />  {/* Email 입력 필드 복원 */}
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
              <span style={{ fontWeight: 'bold' }}>{disease.name}</span>
              <span>{disease.contents}</span> {/* 이 부분을 추가하여 질병 상세 정보 표시 */}
              <button onClick={() => removeDisease(index)}>
                <img src={xImage} alt="x 아이콘" style={{ width: '10px', height: '10px' }} />
              </button>
            </div>
          ))}
          <div className="add-disease-container-custom">
            <button className="add-disease-custom" onClick={() => setIsModalOpen(true)}>
              <img src={plusIcon} alt="Plus Icon" style={{ width: '50px', height: '50px', marginLeft: '75px'}} />
            </button>
          </div>
        </div>
      </div>

      <button className="save-button-custom" onClick={handleSave}>
        저장
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

export default InformationEdit;
