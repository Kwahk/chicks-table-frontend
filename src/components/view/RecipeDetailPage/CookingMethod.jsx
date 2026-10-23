import PropTypes from "prop-types";
import "./CookingMethod.css";

// 조리 과정은 상위(RecipeDetailPage)에서 받아 온 데이터를 그대로 그린다
const CookingMethod = ({ steps }) => {
  // 조리 방법과 이미지를 순서대로 출력
  const renderCookingSteps = () =>
    steps.map((step) => (
      <div key={step.order} className="cooking-step">
        {step.image ? (
          <img
            src={step.image}
            alt={`조리 방법 ${step.order} 이미지`}
            className="cooking-img"
          />
        ) : (
          <p>이미지가 없습니다.</p> // 이미지가 없는 경우 표시할 텍스트
        )}
        <p className="cooking-text">{step.text}</p>
      </div>
    ));

  return (
    <div className="cooking-method-container">
      <div className="method-title">조리 방법</div>
      <div className="cooking-steps">{renderCookingSteps()}</div>
    </div>
  );
};
CookingMethod.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      order: PropTypes.number,
      text: PropTypes.string,
      image: PropTypes.string,
    }),
  ).isRequired,
};

export default CookingMethod;
