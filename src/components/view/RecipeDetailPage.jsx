import { useParams } from "react-router-dom";
import "./RecipeDetailPage.css";
import { useRecipeDetail } from "@/hooks/recipe";
import StatusMessage from "@/components/common/StatusMessage";
import RecipeSummary from "@/components/recipe/detail/RecipeSummary";
import IngredientInfo from "@/components/recipe/detail/IngredientInfo";
import CookingMethod from "@/components/recipe/detail/CookingMethod";
import NutritionTable from "@/components/recipe/detail/NutritionTable";

const RecipeDetailPage = () => {
  const { id } = useParams(); // URL에서 레시피 이름을 가져옴
  const { data: recipe, isLoading, isError, refetch } = useRecipeDetail(id);

  // 요청 상태에 따라 보여줄 내용을 정한다
  if (isLoading)
    return <StatusMessage as="p" className="p-tag" message="로딩 중..." />;
  if (isError)
    return (
      <StatusMessage
        as="p"
        className="p-tag"
        message="레시피를 불러오지 못했습니다."
        onRetry={refetch}
      />
    );
  if (!recipe)
    return (
      <StatusMessage
        as="p"
        className="p-tag"
        message="레시피를 찾을 수 없습니다."
      />
    );

  return (
    <div className="recipe-container">
      <RecipeSummary
        name={recipe.name}
        category={recipe.category}
        image={recipe.image}
      />
      <IngredientInfo ingredients={recipe.ingredients} />
      <CookingMethod steps={recipe.steps} />
      <NutritionTable nutrition={recipe.nutrition} />
    </div>
  );
};

export default RecipeDetailPage;
