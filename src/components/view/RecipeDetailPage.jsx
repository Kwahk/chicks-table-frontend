import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CookingMethod from "../view/RecipeDetailPage/CookingMethod";
import "./RecipeDetailPage.css";
import { getRecipeDetail } from "@/api/recipe";

const RecipeDetailPage = () => {
  const { id } = useParams(); // URL에서 RCP_NM (레시피 이름)을 가져옴
  const [recipe, setRecipe] = useState(null); // 선택된 레시피 정보를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // API를 통해 레시피 상세 정보를 가져오는 함수
  const fetchRecipeDetails = async () => {
    try {
      const recipeData = await getRecipeDetail(id); // 없으면 null
      setRecipe(recipeData); // 상세 레시피 정보 상태에 저장
      setLoading(false); // 로딩 완료
    } catch (error) {
      console.error("레시피 상세 정보를 불러오는데 실패했습니다.", error);
      setLoading(false); // 에러 시에도 로딩 종료
    }
  };

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  if (loading) return <p className="p-tag">로딩 중...</p>; // 로딩 중일 때 표시

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

      <CookingMethod />

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
