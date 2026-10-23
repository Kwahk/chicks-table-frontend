import PropTypes from "prop-types";

const IngredientInfo = ({ ingredients }) => (
  <div className="material-container">
    <div className="material-title">재료 정보</div>
    <div className="material-text">
      {ingredients || "재료 정보가 없습니다."}
    </div>
  </div>
);
IngredientInfo.propTypes = {
  ingredients: PropTypes.string,
};

export default IngredientInfo;
