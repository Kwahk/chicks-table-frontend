import PropTypes from "prop-types";

const NutritionTable = ({ nutrition }) => (
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
          <td>{nutrition.calories} kcal</td>
          <td>{nutrition.carbs} g</td>
          <td>{nutrition.protein} g</td>
          <td>{nutrition.fat} g</td>
        </tr>
      </tbody>
    </table>
  </div>
);
NutritionTable.propTypes = {
  nutrition: PropTypes.shape({
    calories: PropTypes.string,
    carbs: PropTypes.string,
    protein: PropTypes.string,
    fat: PropTypes.string,
  }).isRequired,
};

export default NutritionTable;
