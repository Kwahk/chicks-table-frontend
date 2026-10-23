import { useState, useEffect, useRef } from "react";
import './HeaderComponent.css';
import ChickLoge from '../../assets/chick_text.png';
import SearchIcon from '../../assets/search-icon.png';
import ChatbotIcon from '../../assets/chatbot-icon.png';
import Dropdown from '../../assets/dropdown-icon.png';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const HeaderComponent = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownIcon, setDropdownIcon] = useState(Dropdown);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  // const [profilePath, setProfilePath] = useState(null); // state로 profilePath 관리

  // 컴포넌트가 마운트될 때와 localStorage 변경을 감지
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);

      if (token) {
        fetchUserInfo(token); // 유저 정보 조회
      } else {
        setDropdownIcon(Dropdown);
      }
    };

    // localStorage가 변경될 때마다 로그인 상태 갱신
    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    // 외부 클릭 이벤트 리스너 추가
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false); // 외부 클릭 시 드롭다운 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      document.removeEventListener("mousedown", handleClickOutside); // 정리
    };
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get(`/user/${localStorage.getItem("userId")}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userInfo = response.data;
      //setProfilePath(userInfo.profilePath);
      setDropdownIcon(userInfo.profilePath || Dropdown);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    closeDropdown();
    navigate("/");
  };

  const handleSearchClick = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    } else {
      navigate("/recipesearch");
    }
  };

  const handleChatbotClick = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    } else {
      navigate("/chatbot");
    }
  };

  const renderLoggedOutDropdownMenu = () => {
    return (
      <ul className="dropdown-menu">
        <li className="dropdown-list">
          <Link to="/login" onClick={closeDropdown}>로그인</Link>
        </li>
        <li className="dropdown-list">
          <Link to="/join" onClick={closeDropdown}>회원가입</Link>
        </li>
      </ul>
    );
  };

  const renderLoggedInDropdownMenu = () => {
    return (
      <ul className="dropdown-menu">
        <li className="dropdown-list">
          <Link to="/mypage" onClick={closeDropdown}>마이페이지</Link>
        </li>
        <li className="dropdown-list">
          <Link to="/saved-recipes" onClick={closeDropdown}>저장된 레시피</Link>
        </li>
        <li className="dropdown-list">
          <Link to="/change-password" onClick={closeDropdown}>비밀번호 변경</Link>
        </li>
        <li className="dropdown-list" onClick={handleLogout}>
          로그아웃
        </li>
      </ul>
    );
  };

  return (
    <header className="top-bar">
      <div className="logo">
        <Link to="/">
          <img src={ChickLoge} alt="Chick Logo" className="Chick-Logo" />
        </Link>
      </div>
      <nav className="header-bar">
        <ul className="header-list">
          <li className="header-item" onClick={handleSearchClick}>
            <img src={SearchIcon} alt="Search Icon" className="search-icon" />
            레시피 검색
          </li>
          <div className="vertical-bar"></div>
          <li className="header-item" onClick={handleChatbotClick}>
            <img src={ChatbotIcon} alt="Chatbot Icon" className="chatbot-icon" />
            나만의 영양사
          </li>
          <div className="vertical-bar"></div>
          <li className="dropdown-container" onClick={toggleDropdown}>
            <img src={dropdownIcon} alt="Dropdown" className="dropdown-icon" />
          </li>
        </ul>
      </nav>

      {isDropdownVisible && (
        <div className="dropdown-menu-container" ref={dropdownRef}>
          {isLoggedIn ? renderLoggedInDropdownMenu() : renderLoggedOutDropdownMenu()}
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;
