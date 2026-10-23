import { useState, useEffect, useRef } from "react";
import "./HeaderComponent.css";
import ChickLoge from "../../assets/chick_text.png";
import SearchIcon from "../../assets/search-icon.png";
import ChatbotIcon from "../../assets/chatbot-icon.png";
import Dropdown from "../../assets/dropdown-icon.png";
import { Link, useNavigate } from "react-router-dom";
import { useBoundStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";
import { useUser, userKeys } from "@/hooks/user";

const HeaderComponent = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const isLoggedIn = useBoundStore((state) => state.isLoggedIn);
  const logout = useBoundStore((state) => state.logout);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // 로그인 상태일 때만 사용자 정보(프로필 사진)를 조회
  const { data: user } = useUser({ enabled: isLoggedIn });
  const dropdownIcon = (isLoggedIn && user?.profilePath) || Dropdown;
  const dropdownRef = useRef(null);
  // const [profilePath, setProfilePath] = useState(null); // state로 profilePath 관리

  // 로그인 상태는 스토어를 구독하므로 storage 이벤트로 감지할 필요가 없다
  useEffect(() => {
    // 외부 클릭 이벤트 리스너 추가
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false); // 외부 클릭 시 드롭다운 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // 정리
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const handleLogout = () => {
    logout();
    queryClient.removeQueries({ queryKey: userKeys.all }); // 이전 사용자 정보 캐시 삭제
    closeDropdown();
    navigate("/");
  };

  // 레시피 검색은 사용자 정보가 필요 없어 로그인 없이 이용할 수 있다
  const handleSearchClick = () => {
    navigate("/recipesearch");
  };

  // 챗봇은 질병 정보를 불러오고 답변을 저장하므로 로그인이 필요하다
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
          <Link to="/login" onClick={closeDropdown}>
            로그인
          </Link>
        </li>
        <li className="dropdown-list">
          <Link to="/join" onClick={closeDropdown}>
            회원가입
          </Link>
        </li>
      </ul>
    );
  };

  const renderLoggedInDropdownMenu = () => {
    return (
      <ul className="dropdown-menu">
        <li className="dropdown-list">
          <Link to="/mypage" onClick={closeDropdown}>
            마이페이지
          </Link>
        </li>
        <li className="dropdown-list">
          <Link to="/saved-recipes" onClick={closeDropdown}>
            저장된 레시피
          </Link>
        </li>
        <li className="dropdown-list">
          <Link to="/change-password" onClick={closeDropdown}>
            비밀번호 변경
          </Link>
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
            <img
              src={ChatbotIcon}
              alt="Chatbot Icon"
              className="chatbot-icon"
            />
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
          {isLoggedIn
            ? renderLoggedInDropdownMenu()
            : renderLoggedOutDropdownMenu()}
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;
