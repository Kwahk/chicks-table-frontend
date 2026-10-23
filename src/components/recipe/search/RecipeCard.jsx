import { memo } from "react";
import PropTypes from "prop-types";
import SearchIcon from "@/assets/grey-search-icon.png";

// props(recipe, onClick)가 그대로면 부모가 다시 그려져도 카드는 다시 그리지 않는다
const RecipeCard = memo(function RecipeCard({ recipe, onClick }) {
  return (
    <div className="recipe-card" onClick={() => onClick(recipe)}>
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
  );
});
RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    thumbnail: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RecipeCard;
