import PropTypes from "prop-types";
import RecipeCard from "./RecipeCard";

const RecipeCardList = ({ recipes, onRecipeClick }) =>
  recipes.map((recipe) => (
    <RecipeCard key={recipe.id} recipe={recipe} onClick={onRecipeClick} />
  ));
RecipeCardList.propTypes = {
  recipes: PropTypes.array.isRequired,
  onRecipeClick: PropTypes.func.isRequired,
};

export default RecipeCardList;
