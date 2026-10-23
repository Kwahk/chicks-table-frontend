import { useState } from "react";
import "./LoginJoinChangePWPage.css"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 회원가입 페이지 컴포넌트 정의
const JoinPage = () => {
  // 사용자 입력 값을 저장하는 상태 변수 정의
  const [formData, setFormData] = useState({
    id: "", // 사용자 아이디
    nickname: "", // 사용자 닉네임
    email: "", // 사용자 이메일
    password: "", // 비밀번호
    passwordConfirm: "", // 비밀번호 확인
  });

  // 입력 값이 변경될 때 상태를 업데이트하는 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target; // 입력 필드의 name과 value를 가져옴
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // 입력 필드의 이름을 키로 사용하여 상태 업데이트
    }));
  };
  
  const navigate = useNavigate(); // navigate 함수 정의

  // 회원가입 폼이 제출될 때 호출되는 함수
  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지가 새로고침 되는 것을 방지

    if(formData.id.includes(' ') || formData.password.includes(' ') || formData.passwordConfirm.includes(' ') || formData.email.includes(' ')){
      setFormData(prev => ({...prev, id: formData.id.replace(/\s+/g, ''), password: formData.password.replace(/\s+/g, ''), passwordConfirm: formData.passwordConfirm.replace(/\s+/g, ''), email: formData.email.replace(/\s+/g, '')}))
      alert('공백 문자는 입력할 수 없습니다.')
      return;
    }

    try {
      // 비밀번호와 비밀번호 확인이 일치하는지 확인
      if (formData.password !== formData.passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다."); // 일치하지 않을 경우 경고 메시지 표시
        return; // 함수 종료
      } else {
        // 서버에 회원가입 요청
        const BASE_URL = import.meta.env.VITE_API_URL;
        const res = await axios({
          method: "POST",
          url: `${BASE_URL}/join`, // 회원가입 API URL
          data: {
            id: formData.id,
            nickname: formData.nickname,
            email: formData.email,
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
          }, // 서버로 보낼 사용자 정보      
        });

        // 서버로부터의 응답이 성공적일 경우 처리
        if (res.status >= 200 && res.status < 300) {
          console.log("회원가입 성공"); // 성공 메시지 출력 (디버깅 목적)
          alert("회원가입 성공!"); // 회원가입 성공 알림 표시

          navigate("/login");  // 로그인 페이지로 리다이렉트

        } else {
          alert(res.data); // 서버 응답이 201이 아닐 경우 실패 알림 표시
        }
      }
    } catch (err) {
      // 예외가 발생했을 경우 오류 메시지 출력 및 알림 표시
      console.error("[join]", err); // 콘솔에 오류 메시지 출력
      alert("회원가입에 실패했습니다. 입력을 다시 확인해주세요."); // 사용자에게 오류 메시지 표시
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>회원가입</h1>
        
        {/* 아이디 입력 필드 */}
        <div className="input-field">
          <label>아이디</label>
          <input
            type="text"
            name="id" // 상태 업데이트 시 사용할 name 속성
            placeholder="아이디" // 필드에 보일 안내 텍스트
            required // 필수 입력 필드로 지정
            value={formData.id} // 상태 변수와 연결
            onChange={handleInputChange} // 입력 변경 시 상태 업데이트
          />
        </div>

        {/* 닉네임 입력 필드 */}
        <div className="input-field">
          <label>이름</label>
          <input
            type="text"
            name="nickname"
            placeholder="이름"
            required
            value={formData.nickname}
            onChange={handleInputChange}
          />
        </div>

        {/* 이메일 입력 필드 */}
        <div className="input-field">
          <label>이메일</label>
          <input
            type="email" // 이메일 형식 유효성 검사를 위한 type
            name="email"
            placeholder="이메일"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        {/* 비밀번호 입력 필드 */}
        <div className="input-field">
          <label>비밀번호</label>
          <input
            type="password" // 비밀번호 입력 필드
            name="password"
            placeholder="비밀번호"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        {/* 비밀번호 확인 입력 필드 */}
        <div className="input-field">
          <label>비밀번호 확인</label>
          <input
            type="password" // 비밀번호 확인 필드
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            required
            value={formData.passwordConfirm}
            onChange={handleInputChange}
          />
        </div>

        {/* 회원가입 버튼 */}
        <button type="submit">회원가입</button>

        {/* 로그인 링크 */}
        <div className="in-link">
          <p>
            기존 회원 <a href="/login">로그인하기</a> {/* 로그인 페이지로 이동하는 링크 */}
          </p>
        </div>
      </form>
    </div>
  );
};

export default JoinPage;
