import { useState } from "react";
import "./LoginJoinChangePWPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // 페이지 이동을 위한 훅 추가

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(username.includes(' ') || password.includes(' ')){
      setUsername(username.replace(/\s+/g, ''));
      setPassword(password.replace(/\s+/g, ''));
      alert('공백 문자는 입력할 수 없습니다.')
      return;
    }
    
    try {
      // 서버로 로그인 요청 전송
      const BASE_URL = import.meta.env.VITE_API_URL;
      const res = await axios({
        method: "POST",
        url: `${BASE_URL}/login`, 
        data: {
          username, password
        },
        headers: {
          'Content-Type': 'multipart/form-data' // 반드시 헤더에 Content-Type 설정
        }
      });

      // 응답 상태가 성공(200)일 경우 처리
      if (res.status >= 200 && res.status < 300) {
        const token = res.headers["token"];
        const returnedUsername = res.headers["id"];

        // 로컬 스토리지에 JWT 토큰과 사용자 이름을 저장
        localStorage.setItem("access_token", token);
        localStorage.setItem("username", returnedUsername);

        alert("로그인 성공!"); // 사용자에게 성공 메시지 표시

        // 토큰 저장 후 window 이벤트 발생
        window.dispatchEvent(new Event("storage"));
        
        navigate("/"); // 메인 페이지로 리다이렉트
      } else {
        alert("로그인에 실패하였습니다."); 
      }
    } catch (err) {
      console.error("[login]", err);
      alert("로그인에 실패하였습니다."); 
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>로그인</h1>
        <div className="input-field">
          <label>아이디</label>
          <input
            type="text"
            placeholder="아이디"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-field">
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">로그인</button>
        <div className="in-link">
          <p>
            회원이 아니십니까? <a href="/Join">회원가입하기</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;