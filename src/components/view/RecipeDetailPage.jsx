import { useParams } from "react-router-dom";
import CookingMethod from "../view/RecipeDetailPage/CookingMethod";
import "./RecipeDetailPage.css";
import { useRecipeDetail } from "@/hooks/recipe";

const RecipeDetailPage = () => {
  const { id } = useParams(); // URL에서 레시피 이름을 가져옴
  const { data: recipe, isLoading, isError, refetch } = useRecipeDetail(id);

  // 요청 상태에 따라 보여줄 내용을 정한다
  if (isLoading) return <p className="p-tag">로딩 중...</p>;

  if (isError)
    return (
      <p className="p-tag">
        레시피를 불러오지 못했습니다.{" "}
        <button onClick={() => refetch()}>다시 시도</button>
      </p>
    );

  if (!recipe) return <p className="p-tag">레시피를 찾을 수 없습니다.</p>;

  return (
    <div className="recipe-container">
      <div className="recipe-info1">
        <div className="recipe-name1">{recipe.name}</div>
        <div className="recipe-category1">
          분류 &gt; <span className="category-bold1">{recipe.category}</span>
        </div>
      </div>
      <div className="image-container">
        <img src={recipe.image} alt={recipe.name} className="recipe-img1" />
      </div>
      <div className="material-container">
        <div className="material-title">재료 정보</div>
        <div className="material-text">
          {recipe.ingredients || "재료 정보가 없습니다."}
        </div>
      </div>

      <CookingMethod steps={recipe.steps} />

      {/* 영양 성분 테이블 추가 */}
      <div className="nutrition-container">
        <div className="nutrition-title">영양 성분</div>
        <table className="nutrition-table">
          <thead>
            <tr>
              <th>열량</th>
              <th>탄수화물</th>
              <th>단백질</th>
              <th>지방</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{recipe.nutrition.calories} kcal</td>
              <td>{recipe.nutrition.carbs} g</td>
              <td>{recipe.nutrition.protein} g</td>
              <td>{recipe.nutrition.fat} g</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
