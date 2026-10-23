import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import pencilIcon from "../assets/pencil-icon.png";
import listIcon from "../assets/list.png";
import placeholder from "@/assets/images/person.svg";
import { useUser } from "@/hooks/user";

const MyPage = () => {
  const navigate = useNavigate();
  const { data: user, isLoading, isError, refetch } = useUser();

  // 요청 상태에 따라 보여줄 내용을 정한다
  if (isLoading) return <p className="mypage">불러오는 중...</p>;
  if (isError || !user)
    return (
      <p className="mypage">
        사용자 정보를 불러오지 못했습니다.{" "}
        <button onClick={() => refetch()}>다시 시도</button>
      </p>
    );

  const userData = {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    image: user.profilePath || placeholder, // 기본 프로필 사진
    diseases: user.diseases || [],
  };

  return (
    <div className="mypage">
      <div className="mypage-container">
        <h2>마이페이지</h2>
        <div className="profile-section">
          <div className="profile-picture">
            <img src={userData.image} alt="프로필" />
          </div>
          <div className="profile-info">
            <p>
              <strong>Id :</strong> {userData.id}
            </p>
            <p>
              <strong>Email :</strong> {userData.email}
            </p>
            <p>
              <strong>Nickname :</strong> {userData.nickname}
            </p>
            <p>
              <strong
                className="disease-name"
                style={{ display: "inline-block", verticalAlign: "top" }}
              >
                Diseases :
              </strong>
              <span className="profile-disease-list">
                {userData.diseases.map((d, index) => (
                  <span key={index} className="profile-disease-item">
                    {d.name} {d.contents && `(${d.contents})`}
                  </span>
                ))}
              </span>
            </p>
          </div>
          <button
            className="edit-button"
            onClick={() => navigate("/mypage/edit")}
          >
            <img
              src={pencilIcon}
              alt="Edit"
              style={{ width: "20px", height: "20px", marginRight: "10px" }}
            />
          </button>
        </div>

        <button
          className="saved-chat-button"
          onClick={() => {
            navigate("/saved-recipes");
          }}
        >
          저장한 레시피 목록 보러 가기{" "}
          <img
            src={listIcon}
            alt="List Icon"
            style={{
              width: "12px",
              height: "15px",
              verticalAlign: "-2px",
              marginLeft: "5px",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default MyPage;
