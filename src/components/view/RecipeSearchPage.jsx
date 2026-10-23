import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./RecipeSearchPage.css";
import SearchIcon from "../../assets/grey-search-icon.png";
import { useRecipeSearch } from "@/hooks/recipe";

const RECIPES_PER_PAGE = 8; // 한 페이지에 보여줄 레시피 수

const RecipeSearchPage = () => {
  // 검색어와 페이지는 URL(?q=두부&page=2)에 두어 뒤로 가기와 새로고침에도 유지한다
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("q") ?? "";
  const currentPage = Number(searchParams.get("page") ?? 1);

  const [searchInput, setSearchInput] = useState(keyword);
  const navigate = useNavigate(); // useNavigate 추가

  const {
    data: recipes = [],
    isLoading,
    isError,
    refetch,
  } = useRecipeSearch(keyword);

  // 엔터키를 누르면 검색어를 URL에 반영하고 첫 페이지로 이동
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // 현재 페이지에 해당하는 레시피 계산
  const indexOfLastRecipe = currentPage * RECIPES_PER_PAGE;
  const indexOfFirstRecipe = indexOfLastRecipe - RECIPES_PER_PAGE;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  // 페이지 버튼 클릭 핸들러 (페이지 변경 함수)
  const paginate = (pageNumber) => {
    setSearchParams({ q: keyword, page: String(pageNumber) });
  };

  // 총 페이지 수 계산
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(recipes.length / RECIPES_PER_PAGE); i++) {
    pageNumbers.push(i);
  }

  // 레시피 카드 클릭 핸들러 (레시피 이름을 상세 페이지로 전달)
  const handleRecipeClick = (recipe) => {
    // 레시피 이름을 URL에 포함하여 상세 페이지로 이동
    navigate(`/recipe/${encodeURIComponent(recipe.name)}`);
  };

  // 요청 상태에 따라 보여줄 내용을 정한다
  const renderResults = () => {
    if (!keyword)
      return <div className="no-results">검색어를 입력해 주세요.</div>;
    if (isLoading) return <div className="no-results">검색 중...</div>;
    if (isError)
      return (
        <div className="no-results">
          레시피를 불러오지 못했습니다.{" "}
          <button onClick={() => refetch()}>다시 시도</button>
        </div>
      );
    if (currentRecipes.length === 0)
      return <div className="no-results">검색 결과가 없습니다.</div>;

    return currentRecipes.map((recipe) => (
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
            분류 &gt; <span className="category-bold">{recipe.category}</span>
          </div>
        </div>
      </div>
    ));
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
        <div className="recipe-card-container">{renderResults()}</div>
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
