import PropTypes from "prop-types";
import { useUser } from "@/hooks/user";
import { useDeleteScrap, useScraps } from "@/hooks/scrap";

import "./SavedSidebar.css"; // 고유 이름을 사용한 CSS 추가
import xImage from "@/assets/x.png";

const SavedSidebar = ({ setRecipeId, height }) => {
  const { data: user } = useUser();
  const nickname = user?.nickname ?? "";
  // 서버에서 레시피 목록 가져오기
  const { data: savedRecipes = [], isLoading, isError } = useScraps();
  const { mutate: removeScrap, isError: isDeleteError } = useDeleteScrap();

  const error = isError
    ? "레시피를 불러오는 도중 문제가 발생했습니다."
    : isDeleteError
      ? "레시피를 삭제하는 도중 문제가 발생했습니다."
      : "";

  // 스크랩 삭제 함수
  const handleDeleteClick = (scrapId, recipeTitle) => {
    const isConfirmed = window.confirm(
      `"${recipeTitle}" 레시피를 삭제하시겠습니까?`,
    );
    if (isConfirmed) {
      // 삭제 성공 시 목록 캐시가 갱신되어 화면에서 사라진다
      removeScrap(scrapId, {
        // 보고 있던 레시피를 지웠다면 상세 화면도 비운다
        onSuccess: () =>
          setRecipeId((current) => (current === scrapId ? undefined : current)),
      });
    }
  };

  return (
    <div className="scrap-modal-content" style={{ height: height }}>
      <h3>
        &quot;{nickname}&quot; 님의
        <br />
        저장한 레시피 목록
      </h3>
      {/* 에러가 있을 때만 에러 메시지를 표시 */}
      {error && <p style={{ color: "red", fontSize: "0.8rem" }}>{error}</p>}

      <div className="scrap-recipe-list">
        {
          isLoading ? (
            <p>불러오는 중...</p>
          ) : savedRecipes.length > 0 ? (
            savedRecipes.map((recipe, index) => (
              <div
                key={index}
                className="scrap-recipe-item"
                onClick={() => setRecipeId(recipe.id)}
              >
                <div>{recipe.title}</div>
                <button
                  className="scrap-delete-recipe"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(recipe.id, recipe.title);
                  }}
                >
                  <img
                    src={xImage}
                    alt="x 아이콘"
                    style={{ width: "10px", height: "10px" }}
                  />
                </button>
              </div>
            ))
          ) : (
            !error && <p>저장된 레시피가 없습니다.</p>
          ) // 데이터가 없을 경우 메시지 표시
        }
      </div>
    </div>
  );
};
SavedSidebar.propTypes = {
  setRecipeId: PropTypes.func,
  height: PropTypes.number,
};

export default SavedSidebar;
