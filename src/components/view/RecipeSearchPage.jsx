import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecipeSearchPage.css";
import SearchIcon from "../../assets/grey-search-icon.png";
import { searchRecipes } from "@/api/recipe";

const RecipeSearchPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(8); // 한 페이지에 보여줄 레시피 수
  const [isTyping, setIsTyping] = useState(false); // 입력중 상태를 관리할 변수
  const navigate = useNavigate(); // useNavigate 추가

  // API 호출 함수
  const fetchRecipes = async () => {
    try {
      const recipesData = await searchRecipes(searchInput);
      setRecipes(recipesData);
      setIsTyping(false); // 검색 완료 시 입력 중 상태 해제
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  // 검색어 입력 감지 및 API 호출
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1); // 새로운 검색 시 첫 페이지로 리셋
      fetchRecipes(); // 엔터키를 누르면 API 호출
    }
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    setIsTyping(true); // 입력 중 상태로 설정
  };

  // 현재 페이지에 해당하는 레시피 계산
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  // 페이지 버튼 클릭 핸들러 (페이지 변경 함수)
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 총 페이지 수 계산
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(recipes.length / recipesPerPage); i++) {
    pageNumbers.push(i);
  }

  // 레시피 카드 클릭 핸들러 (레시피 이름을 상세 페이지로 전달)
  const handleRecipeClick = (recipe) => {
    // 레시피 이름을 URL에 포함하여 상세 페이지로 이동
    navigate(`/recipe/${encodeURIComponent(recipe.name)}`);
  };

  return (
    <div className="recipe-search-page">
      {/* Search Section */}
      <div className="search-section">
        <div className="search-title">
          병아리식탁은 <span className="bold-green">20,000가지</span>의 레시피를
          제공합니다.
          <span className="line-break"></span>
          찾고 계시는 다양한 레시피를 이곳에서 검색해 보세요.
        </div>
        <div className="searchbar-container">
          <div className="searchbar">
            <img
              src={SearchIcon}
              alt="Search Icon"
              className="grey-search-icon"
            />
            <input
              type="text"
              className="search-input"
              placeholder="레시피 검색"
              value={searchInput}
              onChange={handleInputChange} // 입력 감지 함수
              onKeyDown={handleKeyDown} // 엔터 키 입력 감지
            />
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      <div className="search-result-section">
        <div className="search-result-title">검색 결과</div>
      </div>

      {/* Recipe Cards */}
      <div className="recipe-card-wrapper">
        <div className="recipe-card-container">
          {isTyping && !recipes.length ? (
            <div className="no-results">입력 중...</div> // 입력 중 상태 표시
          ) : currentRecipes.length > 0 ? (
            currentRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-card"
                onClick={() => handleRecipeClick(recipe)}
              >
                <div className="image-holder">
                  <img
                    src={recipe.thumbnail || SearchIcon}
                    alt="Recipe Img"
                    className="recipe-img"
                  />
                </div>
                <div className="recipe-info">
                  <div className="recipe-name">{recipe.name}</div>
                  <div className="recipe-category">
                    분류 &gt;{" "}
                    <span className="category-bold">{recipe.category}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">검색 결과가 없습니다.</div>
          )}
        </div>
      </div>

      {/* Pagination Section */}
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecipeSearchPage;
