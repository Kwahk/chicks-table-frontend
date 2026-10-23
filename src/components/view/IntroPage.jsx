import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroPage.css';
import IntroImage from '../../assets/chatting.png';

const Intro = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 state
  const navigate = useNavigate(); // navigate 훅을 사용하여 페이지 전환

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 설정
    } else {
      setIsLoggedIn(false); // 토큰이 없으면 비로그인 상태로 설정
    }
  }, []); // 빈 배열을 넣으면 컴포넌트가 처음 렌더링될 때만 실행

  // 시작 버튼 클릭 시 호출되는 함수
  const handleStartClick = () => {
    if (!isLoggedIn) {
      navigate("/login"); // 로그인 페이지로 이동
    } else {
      navigate("/chatbot"); // 로그인된 경우 레시피 검색 페이지로 이동
    }
  };

  return (
    <div className='intro-page'>
      <div className='text-container'>
        <div className='main-title'>
          당신의 <span className='bold'>식탁</span>을
          <span className='line-break'></span>
          <span className='bold'>건강</span>하게 지켜보세요!
        </div>
        <div className='sub-title'>
          우리 <span className='bold-green'>병아리식탁</span>은 사용자와의 AI 상담을 통해
          <span className='line-break'></span>
          사용자 맞춤 식단 레시피를 제공합니다.
        </div>
        <button className="start-btn" onClick={handleStartClick}>시작하기</button>
      </div>
      <img src={IntroImage} alt="Intro Image" className="intro-image" />
    </div>    
  );
};

export default Intro;