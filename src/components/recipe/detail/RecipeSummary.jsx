import PropTypes from "prop-types";

// 레시피 이름, 분류, 대표 이미지
const RecipeSummary = ({ name, category, image }) => (
  <>
    <div className="recipe-info1">
      <div className="recipe-name1">{name}</div>
      <div className="recipe-category1">
        분류 &gt; <span className="category-bold1">{category}</span>
      </div>
    </div>
    <div className="image-container">
      <img src={image} alt={name} className="recipe-img1" />
    </div>
  </>
);
RecipeSummary.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string,
  image: PropTypes.string,
};

export default RecipeSummary;
