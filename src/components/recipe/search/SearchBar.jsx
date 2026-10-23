import { useState } from "react";
import PropTypes from "prop-types";
import SearchIcon from "@/assets/grey-search-icon.png";

// 입력 중인 값은 이 컴포넌트 안에서만 관리하고, Enter를 누를 때만 부모에게 알린다
const SearchBar = ({ initialValue = "", onSearch }) => {
  const [value, setValue] = useState(initialValue);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch(value.trim());
  };

  return (
    <div className="searchbar-container">
      <div className="searchbar">
        <img src={SearchIcon} alt="Search Icon" className="grey-search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="레시피 검색"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};
SearchBar.propTypes = {
  initialValue: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
