import SavedSidebar from "@/components/saved/SavedSidebar";
import SavedDetails from "@/components/saved/SavedDetails";
import "./SavedRecipes.css";
import { useState } from "react";

// 화면 높이는 CSS(calc(100vh - 60px))로 처리해 resize 이벤트를 쓰지 않는다
const SavedRecipes = () => {
  const [recipeId, setRecipeId] = useState();
  return (
    <div className="saved-recipes-page">
      <div className="saved-sidebar-container">
        <SavedSidebar setRecipeId={setRecipeId} />
      </div>
      <div className="saved-details-container">
        {recipeId && <SavedDetails recipeId={recipeId} />}
      </div>
    </div>
  );
};

export default SavedRecipes;
