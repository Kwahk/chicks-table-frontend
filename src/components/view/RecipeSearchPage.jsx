import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./RecipeSearchPage.css";
import { useRecipeSearch } from "@/hooks/recipe";
import { usePagination } from "@/hooks/usePagination";
import SearchBar from "@/components/recipe/search/SearchBar";
import RecipeCardList from "@/components/recipe/search/RecipeCardList";
import Pagination from "@/components/recipe/search/Pagination";
import StatusMessage from "@/components/common/StatusMessage";

const RECIPES_PER_PAGE = 8; // 한 페이지에 보여줄 레시피 수
const EMPTY = []; // 데이터가 없을 때도 매번 새 배열을 만들지 않도록 고정된 빈 배열 사용

const RecipeSearchPage = () => {
  // 검색어와 페이지는 URL(?q=두부&page=2)에 두어 뒤로 가기와 새로고침에도 유지한다
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("q") ?? "";
  const currentPage = Number(searchParams.get("page") ?? 1);
  const navigate = useNavigate();

  const {
    data: recipes = EMPTY,
    isLoading,
    isError,
    refetch,
  } = useRecipeSearch(keyword);
  const { pageItems, totalPages } = usePagination(
    recipes,
    currentPage,
    RECIPES_PER_PAGE,
  );

  // 새로 검색하면 첫 페이지로 이동
  const handleSearch = (value) => setSearchParams({ q: value });

  const handlePageChange = (page) =>
    setSearchParams({ q: keyword, page: String(page) });

  // 레시피 이름을 URL에 포함하여 상세 페이지로 이동
  // memo된 RecipeCard에 넘기므로 매 렌더마다 새 함수가 만들어지지 않게 한다
  const handleRecipeClick = useCallback(
    (recipe) => navigate(`/recipe/${encodeURIComponent(recipe.name)}`),
    [navigate],
  );

  // 요청 상태에 따라 보여줄 내용을 정한다
  const renderResults = () => {
    if (!keyword) return <StatusMessage message="검색어를 입력해 주세요." />;
    if (isLoading) return <StatusMessage message="검색 중..." />;
    if (isError)
      return (
        <StatusMessage
          message="레시피를 불러오지 못했습니다."
          onRetry={refetch}
        />
      );
    if (pageItems.length === 0)
      return <StatusMessage message="검색 결과가 없습니다." />;
    return (
      <RecipeCardList recipes={pageItems} onRecipeClick={handleRecipeClick} />
    );
  };

  return (
    <div className="recipe-search-page">
      <div className="search-section">
        <div className="search-title">
          병아리식탁은 <span className="bold-green">20,000가지</span>의 레시피를
          제공합니다.
          <span className="line-break"></span>
          찾고 계시는 다양한 레시피를 이곳에서 검색해 보세요.
        </div>
        <SearchBar initialValue={keyword} onSearch={handleSearch} />
      </div>

      <div className="search-result-section">
        <div className="search-result-title">검색 결과</div>
      </div>

      <div className="recipe-card-wrapper">
        <div className="recipe-card-container">{renderResults()}</div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default RecipeSearchPage;
